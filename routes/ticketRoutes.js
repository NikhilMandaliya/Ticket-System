const router = require('express').Router();

const { checkUser, checkRole } = require('../controllers/authController');
const { upload } = require('../controllers/uploadController');
const ticketController = require('../controllers/ticketController');

// Get all tickets
router.get('/', checkUser, ticketController.getTickets);

// Create ticket
router
    .route('/create')
    .get(checkUser, checkRole('client'), ticketController.getCreateTicket)
    .post(
        checkUser,
        checkRole('client'),
        upload.single('image'),
        ticketController.postCreateTicket
    );

// Edit ticket
router
    .route('/edit/:id')
    .get(checkUser, checkRole('client'), ticketController.getEditTicket)
    .post(
        checkUser,
        checkRole('client'),
        upload.single('image'),
        ticketController.postEditTicket
    );

// Delete Ticket
router.get('/delete/:id', ticketController.getDeleteTicket);

// Employee remarks
router
    .route('/add-employee-remarks/:id')
    .get(
        checkUser,
        checkRole('employee'),
        ticketController.getAddEmployeeRemarks
    )
    .post(
        checkUser,
        checkRole('employee'),
        ticketController.postAddEmployeeRemarks
    );

// Manager Disapprove and Remarks
router.get(
    '/manager-disapprove/:id',
    checkUser,
    checkRole('manager'),
    ticketController.getManagerDisapproveTicket
);
router
    .route('/add-manager-remarks/:id')
    .get(checkUser, checkRole('manager'), ticketController.getAddManagerRemarks)
    .post(
        checkUser,
        checkRole('manager'),
        ticketController.postAddManagerRemarks
    );

// Admin Disapprove and Remarks
router.get(
    '/admin-disapprove/:id',
    checkUser,
    checkRole('admin'),
    ticketController.getAdminDisapproveTicket
);
router
    .route('/add-admin-remarks/:id')
    .get(checkUser, checkRole('admin'), ticketController.getAddAdminRemarks)
    .post(checkUser, checkRole('admin'), ticketController.postAddAdminRemarks);

module.exports = router;
