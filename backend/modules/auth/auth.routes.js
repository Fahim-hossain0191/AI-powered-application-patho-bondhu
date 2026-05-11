const express  = require('express');
const passport = require('../../config/passport');
const authController = require('./auth.controller');

const router = express.Router();

// Email/Password routes
router.post('/register', authController.register);
router.post('/login',    authController.login);
router.post('/logout',   authController.logout);
router.post('/refresh',  authController.refreshToken);

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

router.get('/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/auth/google/error`,
  }),
  authController.googleCallback
);

module.exports = router;