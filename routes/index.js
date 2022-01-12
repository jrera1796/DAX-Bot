const router = require('express').Router();
const NewPost = require('../models/NewSignal'); const apiRoutes = require('./api');
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '2073270337:AAG6Px-Ame7jS8hV_eV-ixu8EOzy_W2qAcA';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// var TelegramBot = require('telegrambot');
// var api = new TelegramBot(process.env.API_TOKEN + process.env.API_KEY);
// // var token = process.env.API_TOKEN;
// // var key = process.env.API_KEY;

router.use('/api', apiRoutes);

router.post('/', (req, res) => {
  // expects => {post_text: "This is the comment", signal: "Called at", created at: 2}
  NewPost.create({
    post_text: req.body.post_text,
    signal: req.body.signal

  })
    .then(data => {
     
        
        bot.sendMessage(1182469925, 
          `New signal called at ${req.body.post_text} \n Activted at ${req.body.signal}`
          );
      console.log(data)
      return res.json({status: 'done'})
    })
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;