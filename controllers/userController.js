const User = require('../models/userModel');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort('-_id');

        res.render('user', { users });
    } catch (error) {
        req.flash('red', error.message);
        res.redirect('/');
    }
};

exports.getCreateUser = (req, res) => res.render('user_create');

exports.postCreateUser = async (req, res) => {
    try {
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            role: req.body.role,
        });

        req.flash('green', 'User created successfully.');
        res.redirect('/user');
    } catch (error) {
        if (error.code === 11000) req.flash('red', 'Email already registered.');
        else req.flash('red', error.message);
        res.redirect('/user');
    }
};

exports.getEditUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            req.flash('red', 'User not found!');
            return res.redirect('/user');
        }

        res.render('user_edit', { user });
    } catch (error) {
        if (error.name === 'CastError') req.flash('red', 'User not found!');
        else req.flash('red', error.message);
        res.redirect('/user');
    }
};

exports.postEditUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            req.flash('red', 'User not found!');
            return res.redirect('/user');
        }

        user.name = req.body.name;
        user.email = req.body.email;
        user.role = req.body.role;

        await user.save();

        req.flash('green', 'User updated successfully.');
        res.redirect('/user');
    } catch (error) {
        if (error.code === 11000) req.flash('red', 'Email already registered.');
        else if (error.name === 'CastError')
            req.flash('red', 'User not found!');
        else req.flash('red', error.message);
        res.redirect('/user');
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);

        req.flash('green', 'User deleted successfully.');
        res.redirect('/user');
    } catch (error) {
        if (error.name === 'CastError' || error.name === 'TypeError')
            req.flash('red', 'User not found!');
        else req.flash('red', error.message);
        res.redirect('/user');
    }
};
