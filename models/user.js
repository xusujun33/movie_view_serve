var mongoose = require('../common/db')

//用户数数据集
var user = mongoose.Schema({
    username: String,
    password: String,
    userMail: String,
    userPhone: String,
    userAdmin: String,
    userPower: String,
    userStop: String,
})

//用户查找方法
user.statics.findAll = function (callback) {
    this.find({}, callback);
}

//使用用户名查找
user.statics.findByUsername = function (name, callback) {
    this.find({
        'username': name
    }, callback);
}

//登录匹配是不是拥有相同的用户名和密码并没有处于封停状态
user.statics.findUserLogin = function (name, password, callback) {
    this.find({
        username: name,
        password: password,
        userStop: 0
    }, callback)
}

//验证邮箱、电话和用户名找到用户
user.statics.findUserPassword = function (name, mail, phone, callback) {
    this.find({
        username: name,
        userMail: mail,
        userPhone: phone
    }, callback)
}

var userModel = mongoose.model('user', user);
module.exports = userModel;