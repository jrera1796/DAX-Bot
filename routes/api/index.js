const router = require('express').Router();

const userRoutes = require('./user-routes.js');
const newSignal = require('./signal-routes');
const telegramRoutes = require('./telegram-routes')

router.use('/users', userRoutes);
router.use('/signals', newSignal);
router.use('/telegram', telegramRoutes);

module.exports = router;