const Signals = require('../../models/Signals');
const router = require('./user-routes')
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.API_TOKEN
const bot = new TelegramBot(token, {polling: true});

router.post('/', (req, res) => {
  Signals.create({
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