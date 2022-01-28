const Signals = require('../../models/Signals');
const router = require('express').Router();
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.API_TOKEN
const bot = new TelegramBot(token, {polling: true});
const dateFormat = require('../utils/dateFormat');

router.post('/', (req, res) => {
  Signals.create({
    post_text: req.body.post_text,
     calledAt: req.body.calledAt
  })
    .then(dbUserData => {
calledAtNew => dateFormat(calledAt)
      bot.sendMessage(1182469925, 
       
          `${req.body.post_text}, Called at ${calledAt}`
          )
res.json(dbUserData)})
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// router.post('/', (req, res) => {
//   console.log(req)
//   Signals.create({
    
//     post_text: req.body.post_text,
//     signal: req.body.signal

//   })
//     .then(data => {
     
//         // bot.sendMessage(1182469925, 
//         console.log(
//           `New signal called at ${req.body.post_text} \n Activted at ${req.body.signal}`
//           );
//       console.log(data)
//       return res.json({status: 'done'})
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(400).json(err);
//     });
// });

router.use((req, res) => {
  res.status(404).end();
});
module.exports = router;