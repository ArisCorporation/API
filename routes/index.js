var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send({
    message: "API is ready! Please use: '/convert' to download the video!",
  })
})

module.exports = router
