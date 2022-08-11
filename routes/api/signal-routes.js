const Signals = require('../../models/Signals');
const router = require('express').Router();

require('dotenv').config

router.post('/', (req, res) => {

  Signals.create({
    exchange: req.body.exchange,
    ticker: req.body.ticker,
    interval: req.body.interval,
    notes: req.body.notes

  })
    .then(dbUserData => {
      // console.log(dbUserData.id)
      // const str = `https://api.chart-img.com/v1/tradingview/advanced-chart?symbol=${req.body.exchange}:${req.body.ticker}&interval=${req.body.interval}&width=500&height=300&key=${process.env.IMG_KEY}`
      // console.log(str)
      // Signals.update({
      //   image: str
      // },{
      //   where:{
      //     id: dbUserData.id
      //   }
      // })

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