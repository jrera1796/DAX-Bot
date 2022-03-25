const TelegramBot = require('node-telegram-bot-api');
const token = process.env.API_TOKEN
const bot = new TelegramBot(token, { polling: true });
const dateFormat = require('../../utils/dateFormat');
require('dotenv').config
//Move bot functions out of signal-routes and into here
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

        bot.sendMessage(chatId, 
          `${data.exchange}:${data.ticker}
          \n
          \n
          ${data.notes}
          \n
          ${time}`
          )
      })
      .catch(
        err => { console.log(err) }
      )
  };

});