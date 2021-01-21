var mongoose = require('../common/db');

//电影数据模型
var movie = mongoose.Schema({
    movieName: String,
    movieImg: String,
    movieVideo: String,
    movieDownload: String,
    movieTime: String,
    movieNumSuppose: Number,
    movieNumDownload: Number,
    movieMainPage:Boolean
})


//查找所有电影
movie.statics.findAll = function (callback) {
    this.findAll({}, callback)
}

var movieModel = mongoose.model('movie', movie)
module.exports = movieModel