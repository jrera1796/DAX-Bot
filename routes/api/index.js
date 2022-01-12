const router = require('express').Router();

const userRoutes = require('./user-routes.js');
const newSignal = require('./signal-routes.js')

router.use('/users', userRoutes);
router.use('/signals', newSignal);

module.exports = router;