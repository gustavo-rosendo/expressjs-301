const express = require('express');
const router = express();

router.use(express.Router());

router.get('/', (req, res, next) => {
  res.json({
    msg: "Router works!"
  })
});

module.exports = router;