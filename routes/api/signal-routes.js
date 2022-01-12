const NewSignal = require('../../models/NewSignal')
const router = require('./user-routes')

router.post('/', (req, res) => {
  NewSignal.create({
   post_text: req.body.post_text,
   signal: req.body.signal
  })
    .then(daxData => res.json(daxData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
});

module.exports = router;