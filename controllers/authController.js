const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

// (async () => {
//     try {
//         await User.create({
//             name: 'Client',
//             email: 'client@gmail.com',
//             password: '12345678',
//             passwordConfirm: '12345678',
//             role: 'client',
//         });
//         console.log('success');
//     } catch (error) {
//         console.log(error);
//     }
// })();

exports.checkUser = async (req, res, next) => {
    try {
        const token = req.cookies['authentication'];
        req.session.checkUserSuccess = true;
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded._id);
            if (!user) {
                req.flash('red', 'Please login first!');
                return res.redirect('/login');
            }
            req.user = user;
            res.locals.role = user.role;
            req.session.checkUserSuccess = undefined;
            next();
        } else {
            req.flash('red', 'Please login first!');
            res.redirect('/login');
        }
    } catch (error) {
        if (error.message == 'invalid signature')
            req.flash('red', 'Invalid token! Please login again.');
        else req.flash('red', error.message);
        res.redirect('/login');
    }
};

exports.checkRole = allowedRoles => {
    return (req, res, next) => {
        if (allowedRoles.includes(req.user.role)) {
            next();
        } else {
            req.flash(
                'red',
                'You do not have permission to perform this action.'
            );
            res.redirect('/login');
        }
    };
};

exports.getDashboard = (req, res) => res.render('index');

exports.getLogin = async (req, res) => {
    try {
        if (req.session.checkUserSuccess) {
            req.session.checkUserSuccess = undefined;
            return res.render('login');
        }

        const token = req.cookies['authentication'];
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded._id);
            if (!user) return res.render('login');

            res.redirect('/');
        } else {
            res.render('login');
        }
    } catch (error) {
        req.flash('red', error.message);
        res.render('login');
    }
};

exports.postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.correctPassword(password, user.password))) {
            req.flash('red', 'Incorrect email or password');
            return res.redirect(req.originalUrl);
        }

        const token = await user.generateAuthToken();
        res.cookie('authentication', token, {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        });
        res.redirect('/');
    } catch (error) {
        req.flash('red', error.message);
        res.redirect(req.originalUrl);
    }
};

exports.logout = (req, res) => {
    res.clearCookie('authentication');
    res.redirect('/login');
};
