const User = require('./User');
const Signal = require('./Signals')

Signal.belongsTo(User);

module.exports = { User };