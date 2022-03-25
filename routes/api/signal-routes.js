const Signals = require('../../models/Signals');
const router = require('express').Router();
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.API_TOKEN
const bot = new TelegramBot(token, { polling: true });
const dateFormat = require('../../utils/dateFormat');
require('dotenv').config

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  if (msg.text === 'Current Analysis') {
    Signals.findAll({
      attributes: ['id', 'exchange', 'ticker', 'notes', 'createdAt']
    }).then(data => {
      return data
    })
      .then(res => {
        //save image in temporary folder
        let r = res.slice(-1)
        let data = r[0].dataValues
        let time = dateFormat(data.createdAt)

        bot.sendMessage(chatId, 
          `${data.exchange}:${data.ticker}\n\n${data.notes}\n${time}`
          )
      })
      .catch(
        err => { console.log(err) }
      )
  }

  else{
bot.sendMessage(chatId, 'Hmm not sure')
  }

});

router.post('/', (req, res) => {

  Signals.create({
    exchange: req.body.exchange,
    ticker: req.body.ticker,
    interval: req.body.interval,
    notes: req.body.notes

  })
    .then(dbUserData => {
      lastID = dbUserData.id
      console.log(dbUserData.id)
      const str = `https://api.chart-img.com/v1/tradingview/advanced-chart?symbol=${req.body.exchange}:${req.body.ticker}&interval=${req.body.interval}&width=500&height=300&key=${process.env.IMG_KEY}`
      console.log(str)
      bot.sendPhoto(1182469925, str)
      //Import bot from a different folder
      bot.sendMessage(1182469925, `Testing chartIMG`)

      res.json(dbUserData)

    })
    .catch(err => {
      if (err) throw err;
      console.log("Couldn't create post")
      return;
    })
});

router.use((req, res) => {
  res.status(404).end();
});


module.exports = router;