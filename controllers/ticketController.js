const Ticket = require('../models/ticketModel');

exports.getTickets = async (req, res) => {
    try {
        const user = req.user;

        let query;
        if (user.role === 'client') {
            query = { client: user.id };
        } else if (user.role === 'employee') {
            query = { status: { $in: ['pending', 'disapproved_manager'] } };
        } else if (user.role === 'manager') {
            query = {
                status: { $in: ['pending_manager', 'disapproved_admin'] },
            };
        } else if (user.role === 'admin') {
            query = {};
        }

        const tickets = await Ticket.find(query);

        res.render('ticket', { tickets });
    } catch (error) {
        req.flash('red', error.message);
        res.render('login');
    }
};

exports.getCreateTicket = (req, res) => res.render('ticket_create');

exports.postCreateTicket = async (req, res) => {
    try {
        await Ticket.create({
            client: req.user.id,
            title: req.body.title,
            description: req.body.description,
            image: req.file ? `/uploads/${req.file.filename}` : undefined,
        });

        req.flash('green', 'Ticket created successfully.');
        res.redirect('/ticket');
    } catch (error) {
        req.flash('red', error.message);
        res.redirect('/ticket');
    }
};

exports.getEditTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            req.flash('red', 'Ticket not found!');
            return res.redirect('/ticket');
        }

        res.render('ticket_edit', { ticket });
    } catch (error) {
        if (error.name === 'CastError') req.flash('red', 'Ticket not found!');
        else req.flash('red', error.message);
        res.redirect('/ticket');
    }
};

exports.postEditTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            req.flash('red', 'Ticket not found!');
            return res.redirect('/ticket');
        }

        ticket.title = req.body.title;
        ticket.description = req.body.description;

        if (req.file) ticket.image = `/uploads/${req.file.filename}`;

        await ticket.save();

        req.flash('green', 'Ticket edited successfully.');
        res.redirect('/ticket');
    } catch (error) {
        req.flash('red', error.message);
        res.redirect('/ticket');
    }
};

exports.getDeleteTicket = async (req, res) => {
    try {
        await Ticket.findByIdAndDelete(req.params.id);

        req.flash('green', 'Ticket deleted successfully.');
        res.redirect('/ticket');
    } catch (error) {
        if (error.name === 'CastError' || error.name === 'TypeError')
            req.flash('red', 'Ticket not found!');
        else req.flash('red', error.message);
        res.redirect('/ticket');
    }
};

exports.getAddEmployeeRemarks = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            req.flash('red', 'Ticket not found!');
            return res.redirect('/ticket');
        }

        res.render('employee_remarks', { ticket });
    } catch (error) {
        if (error.name === 'CastError') req.flash('red', 'Ticket not found!');
        else req.flash('red', error.message);
        res.redirect('/ticket');
    }
};

exports.postAddEmployeeRemarks = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            req.flash('red', 'Ticket not found!');
            return res.redirect('/ticket');
        }

        ticket.employeeRemarks = req.body.employeeRemarks;
        ticket.status = 'pending_manager';

        await ticket.save();

        req.flash(
            'green',
            'Remarks added successfully. Awaiting manager approval.'
        );
        res.redirect('/ticket');
    } catch (error) {
        req.flash('red', error.message);
        res.redirect('/ticket');
    }
};

exports.getManagerDisapproveTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            req.flash('red', 'Ticket not found!');
            return res.redirect('/ticket');
        }

        ticket.status = 'disapproved_manager';

        await ticket.save();

        req.flash('green', 'Ticket disapproved.');
        res.redirect('/ticket');
    } catch (error) {
        req.flash('red', error.message);
        res.redirect('/ticket');
    }
};

exports.getAddManagerRemarks = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            req.flash('red', 'Ticket not found!');
            return res.redirect('/ticket');
        }

        res.render('manager_remarks', { ticket });
    } catch (error) {
        if (error.name === 'CastError') req.flash('red', 'Ticket not found!');
        else req.flash('red', error.message);
        res.redirect('/ticket');
    }
};

exports.postAddManagerRemarks = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            req.flash('red', 'Ticket not found!');
            return res.redirect('/ticket');
        }

        ticket.managerRemarks = req.body.managerRemarks;
        ticket.status = 'pending_admin';

        await ticket.save();

        req.flash(
            'green',
            'Remarks added successfully. Awaiting admin approval.'
        );
        res.redirect('/ticket');
    } catch (error) {
        req.flash('red', error.message);
        res.redirect('/ticket');
    }
};

exports.getAdminDisapproveTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            req.flash('red', 'Ticket not found!');
            return res.redirect('/ticket');
        }

        // Update ticket status to 'disapproved_admin'
        ticket.status = 'disapproved_admin';

        await ticket.save();

        req.flash('green', 'Ticket disapproved.');
        res.redirect('/ticket');
    } catch (error) {
        req.flash('red', error.message);
        res.redirect('/ticket');
    }
};

exports.getAddAdminRemarks = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            req.flash('red', 'Ticket not found!');
            return res.redirect('/ticket');
        }

        res.render('admin_remarks', { ticket });
    } catch (error) {
        if (error.name === 'CastError') req.flash('red', 'Ticket not found!');
        else req.flash('red', error.message);
        res.redirect('/ticket');
    }
};

exports.postAddAdminRemarks = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            req.flash('red', 'Ticket not found!');
            return res.redirect('/ticket');
        }

        ticket.adminRemarks = req.body.adminRemarks;

        await ticket.save();

        req.flash(
            'green',
            'Admin remarks added successfully. Ticket approved.'
        );
        res.redirect('/ticket');
    } catch (error) {
        req.flash('red', error.message);
        res.redirect('/ticket');
    }
};
