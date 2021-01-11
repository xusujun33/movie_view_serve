var mongoose = require('../common/db');

//电影数据模型
var comment = mongoose.Schema({
    movie_id: String,
    username: String,
    context: String,
    check: Boolean
})

comment.statics.findByMovieId = function (id, callback) {
    this.find({
        movie_id: id,
        check: true
    }, callback)
}

comment.statics.findAll = function (callback) {
    this.findAll({}, callback)
}

var commentModel = mongoose.model('comment', comment)
module.exports = commentModel