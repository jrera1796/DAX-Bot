const Signals = require('../../models/Signals');
const router = require('express').Router();
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.API_TOKEN
const bot = new TelegramBot(token, { polling: true });
const dateFormat = require('../../utils/dateFormat');


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
    })
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