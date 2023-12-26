const router = require('express').Router();

const { checkUser, checkRole } = require('../controllers/authController');
const userController = require('../controllers/userController');

router.get('/', checkUser, checkRole('admin'), userController.getAllUsers);

router
    .route('/create')
    .get(checkUser, checkRole('admin'), userController.getCreateUser)
    .post(checkUser, checkRole('admin'), userController.postCreateUser);

router
    .route('/edit/:id')
    .get(checkUser, checkRole('admin'), userController.getEditUser)
    .post(checkUser, checkRole('admin'), userController.postEditUser);

router.get(
    '/delete/:id',
    checkUser,
    checkRole('admin'),
    userController.deleteUser
);

module.exports = router;
