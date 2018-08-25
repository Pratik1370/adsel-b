var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// var charts_controller = require('../controllers/charts_controller');
// router.get('/', charts_controller.index);

console.log("in indexjs");
module.exports = router;
