var mongoose = require('../common/db')

var mail = mongoose.Schema({
    fromUser: String,
    toUser: String,
    title: String,
    context: String
})

//根据发送对象查找站内信
mail.statics.findByToUserId = function (user_id, callback) {
    this.find({
        toUser: user_id
    }, callback)
}

//根据接收对象查找站内信
mail.statics.findByFromUserId = function (user_id, callback) {
    this.find({
        fromUser: user_id
    }, callback)
}


var mailModel = mongoose.model('mail', mail);
module.exports = mailModel;