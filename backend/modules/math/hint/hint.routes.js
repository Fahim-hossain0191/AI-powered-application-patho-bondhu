const express = require('express');
const router = express.Router();
const { hintController } = require('./hint.controller');
const authMiddleware = require('../../../middlewares/auth.middleware');

/**
 * POST /api/math/hint
 */
router.post('/', authMiddleware, hintController);

module.exports = router;
