const TelegramBot = require('node-telegram-bot-api');
const token = process.env.API_TOKEN
const router = require('express').Router();
const bot = new TelegramBot(token, { polling: true });
const dateFormat = require('../../utils/dateFormat');
const Signals = require('../../models/Signals');

require('dotenv').config
//Move bot functions out of signal-routes and into here

Signals.findAll({
  attributes: ['id', 'exchange', 'ticker', 'notes', 'image', 'createdAt']
})
  .then(data => {
    console.log(data, 'From Signal')
    bot.setMyCommands(['Current Analysis', 'View the most recent Analysis'], (options) => {

    })
  })
  .catch(
    err => { console.log("Signals Table not populated") }
  )



bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  if (msg.text === 'Current Analysis') {
    Signals.findAll({
      attributes: ['id', 'exchange', 'ticker', 'notes', 'createdAt']
    }).then(data => {
      return data
    })
      .then(res => {

        let r = res.slice(-1)
        let data = r[0].dataValues
        let time = dateFormat(data.createdAt)
        // bot.sendPhoto(chatId, `${data.image}`)
        bot.sendMessage(chatId,
          `${data.exchange}:${data.ticker}\n\n${data.notes}\n${time}\n\n`
          //Try to clean this up a bit.
        )
      })
      .catch(
        err => { console.log(err) }
      )
  }
  else {
    for (i = 0; i > 5; i++) {
      bot.sendMessage(chatId, "I don't understand");
      i = 0;
    }
    return
  }

});

bot.on('polling_error', listen => {
  console.log(listen)
});


module.exports = router;