var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var movie = require('../models/movie');
// var article = require('../models/article');
var user = require('../models/user')
var comment = require('../models/comment');
const recommend = require('../models/recommend');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

//mongoose连接测试
// router.get('/mongooseTest', function (req, res, next) {
//   mongoose.connect('mongodb://localhost/pets', {
//     useMongoClient: true
//   });
//   mongoose.Promise = global.Promise;

//   var Cat = mongoose.model('Cat', {
//     name: String
//   });

//   var tom = new Cat({
//     name: 'Tom'
//   });
//   tom.save((err) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log('success insert');
//     }
//   });
//   res.send('数据库连接测试')
// })

//显示主页的推荐大图
router.get('/showIndex', (req, res, next) => {
  recommend.findAll((err, getRecommend) => {
    res.json({
      status: 0,
      message: '获取推荐',
      data: getRecommend
    })
  })
})

//显示所有的排行榜，对应电影字段index
router.get('/showRanking', (req, res, next) => {
  movie.find({
    movieMainPage: true
  }, (err, getMovies) => {
    if (err) return res.json({
      status: 1,
      err
    })
    res.json({
      status: 0,
      data: getMovies,
      message: '获取主页'
    })
  })
})

//显示文章列表
router.get('/showArticle', (req, res, next) => {

})

//显示文章内容
router.get('/articleDetail', (req, res, next) => {

})

//显示用户个人信息
router.get('/showUser', (req, res, next) => [

])

module.exports = router;