const TelegramBot = require('node-telegram-bot-api');
const token = process.env.API_TOKEN
const router = require('express').Router();
const bot = new TelegramBot(token, { polling: true });
const dateFormat = require('../../utils/dateFormat');
const Signals = require('../../models/Signals');
let er = 0;
require('dotenv').config

bot.onText(/(\a)/, (msg, match) => {
  const chatId = msg.chat.id;
  const sw = match.input

  switch (sw) {

    case 'Current Analysis':
    case 'ca':
    case '/ca':
      currentAnalysis(chatId, -1)
      break;

    case 'Previous Analysis':
    case 'pa':
    case '/pa':
      currentAnalysis(chatId, -2)
      break;
    case null:
    case undefined:
    case '/dax':
      er++
      if (er === 1) {
        errorMessages(chatId)
      }
      break;

    //Tests and other responses

    case 'Dax Dice':
    case '/dice':
      diceGame(chatId);
      break;
  }
  return;
});

function currentAnalysis(cn, cd) {
  //Chat Number, Current Day
  Signals.findAll({
    attributes: ['id', 'exchange', 'ticker', 'notes', 'createdAt']
  }).then(data => {
    return data
  })
    .then(res => {
      let r = res.slice(cd)
      let data = r[0].dataValues
      let time = dateFormat(data.createdAt)
      bot.sendMessage(cn,
        `${data.exchange}:${data.ticker}\n\n${data.notes}\n${time}`
      )
    })
    .catch(
      err => { console.log(err) }
    )
}

function errorMessages(n) {
  bot.sendMessage(n,
    `I'm not sure I understood that.`
  )
  er = 0;
}

function diceGame(n) {
  let dv1; let dv2;
  bot.sendDice(n).then(data => { dv1 = data.dice.value; console.log(dv1) })
  bot.sendDice(n).then(data => { dv2 = data.dice.value; console.log(dv2) })
    .then(d => {
      if (dv1 + dv2 === 7) {
        console.log("W")
      }
      else {
        console.log('L')
      }
    })
}


bot.on('polling_error', listen => {
  console.log(listen)
});


module.exports = router;