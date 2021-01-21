var mongoose = require('../common/db')

var recommend = mongoose.Schema({
    recommendImg: String,
    recommendSrc: String,
    recommendTitle: String
})

//根据id获取主页推荐
recommend.statics.findByIndexId = function (m_id, callback) {
    this.find({
        findByIndexId: m_id
    }, callback)
}

//找到所有推荐
recommend.statics.findAll = function (callback) {
    this.find({}, callback)
}

var recommendModel = mongoose.model('recommend', recommend);

module.exports = recommendModel;