const Signals = require('../../models/Signals');
const router = require('express').Router();
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.API_TOKEN
const bot = new TelegramBot(token, { polling: true });
const dateFormat = require('../../utils/dateFormat');

function chartIMG(){
  console.log('Fetching chart image')
fetch(
`https://api.chart-img.com/v1/tradingview/advanced-chart?symbol=OANDA:DE30EUR&interval=1h&width=500&height=300&key=${process.env.IMG_KEY}`)
.then(CurrentChart=> {
  return CurrentChart
}
)
}

router.post('/', (req, res) => {
  Signals.create({
    post_text: req.body.post_text,
    calledAt: req.body.calledAt
  })
    .then(dbUserData => {
      chartIMG();
      const calledAtNew = dateFormat(req.body.calledAt)
      //Import bot from a different folder and make it private
      bot.sendMessage(1182469925, `Relative Session Time\n${calledAtNew}\n\n\n${req.body.post_text},`)
      res.json(dbUserData)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.use((req, res) => {
  res.status(404).end();
});


module.exports = router;