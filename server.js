const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');
const app = express();
const PORT = process.env.PORT || 3001;

require('dotenv').config();

//'middleware'
app.use(express.static('public'));
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

// turn on routes
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});
