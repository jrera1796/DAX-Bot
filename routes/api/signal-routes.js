const Signals = require('../../models/Signals');
const router = require('express').Router();
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.API_TOKEN
const bot = new TelegramBot(token, { polling: true });
const dateFormat = require('../../utils/dateFormat');
const { default: axios } = require('axios');
const axios = require('axios')

const key = `https://api.chart-img.com/v1/tradingview/advanced-chart?symbol=OANDA:DE30EUR&interval=1h&width=500&height=300&key=7e1e270f-a954-46df-be6a-03bf2745370f`

  console.log('Fetching chart image through signals')
try {
  axios.get(key)

.then(res => res)
.then(console.log(res))
}
catch{(err => {console.log(err)})
}

router.post('/', (req, res) => {



  Signals.create({
    post_text: req.body.post_text,
    calledAt: req.body.calledAt
  })
    .then(dbUserData => {
      const calledAtNew = dateFormat(req.body.calledAt)
      //Import bot from a different folder and make it private
      bot.sendMessage(1182469925, `Relative Session Time\n${calledAtNew}\n\n\n${req.body.post_text},`)
      res.json(dbUserData)
    }).then(
//bot(chatId, photo link)

      bot.sendPhoto(1182469925, `https://api.chart-img.com/v1/tradingview/advanced-chart?symbol=OANDA:DE30EUR&interval=1h&width=500&height=300&key=7e1e270f-a954-46df-be6a-03bf2745370f`)
    ).then(
      bot.setMyCommands({CA: 'Current Analysis'})
    )
    .catch(err => {
      if(err) throw err;
      console.log("Couldn't create post")
      return;
    })  
});

router.use((req, res) => {
  res.status(404).end();
});


module.exports = router;