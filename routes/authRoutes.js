const router = require('express').Router();

const authController = require('../controllers/authController');

router
    .route('/login')
    .get(authController.getLogin)
    .post(authController.postLogin);

router.get('/logout', authController.logout);

router.get('/', authController.checkUser, authController.getDashboard);

module.exports = router;
