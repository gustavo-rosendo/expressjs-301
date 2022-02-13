const express = require('express');
const router = express();

router.use(express.Router());

function validateUser(req, res, next) {
  res.locals.validated = true;
  console.log('validated!');
  next();
}

// validateUser is middleware that will be added ONLY to THIS router
// in other words, the main router does not know about it
router.use(validateUser);

router.get('/', (req, res, next) => {
  res.json({
    msg: "User router works!"
  })
});

module.exports = router;