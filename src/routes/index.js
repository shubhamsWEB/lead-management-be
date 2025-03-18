const express = require('express');
const leadRoutes = require('./leadRoutes');
const authRoutes = require('./authRoutes');

const router = express.Router();
router.use('/auth', authRoutes);
router.use('/leads', leadRoutes);

module.exports = router;