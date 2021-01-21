var express = require('express');
var router = express.Router();
var user = require('../models/user');
var crypto = require('crypto');
var comment = require('../models/comment')
var movie = require('../models/movie')
var mail = require('../models/mail')

const init_token = 'TKL02o';


/* GET users listing. */
//用户登录接口
router.post('/login', (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    res.json({
      status: 1,
      message: '用户名密码不能为空'
    })
  } else {
    user.findUserLogin(req.body.username, req.body.password, (err, saveUser) => {
      if (saveUser.length == 0) {
        res.json({
          status: 1,
          message: '用户名或密码错误'
        })
      } else {
        var token = getMD5Password(saveUser[0]._id);
        res.json({
          status: 1,
          data: {
            token: token,
            user: saveUser
          },
          message: '用户登录成功'
        })
      }

    })
  }
})

//用户注册接口
router.post('/register', (req, res, next) => {
  if (!req.body.username) {
    res.json({
      status: 1,
      message: '用户名为空'
    })
  }
  if (!req.body.password) {
    res.json({
      status: 1,
      message: '密码为空'
    })
  }
  if (!req.body.userMail) {
    res.json({
      status: 1,
      message: '邮箱为空'
    })
  }
  if (!req.body.userPhone) {
    res.json({
      status: 1,
      message: '手机为空'
    })
  }
  user.findByUsername(req.body.username, (err, userSave) => {
    if (userSave.length != 0) {
      res.json({
        status: 1,
        message: '用户已注册',
      })
    } else {
      var registerUser = new user({
        username: req.body.username,
        password: req.body.password,
        userMail: req.body.userMail,
        userPhone: req.body.userPhone,
        userAdmin: 0,
        userPower: 0,
        userStop: 0
      })
      registerUser.save((err) => {
        if (err) res.json({
          status: 1,
          message: '注册失败'
        });
        res.json({
          status: 0,
          message: '注册成功'
        })
      })
    }
  })
})

//用户提交评论
router.post('/postComment', (req, res, next) => {
  if (!req.body.movie_id) return res.json({
    status: 1,
    message: '电影id为空'
  });
  if (!req.body.context) return res.json({
    status: 1,
    message: '评论内容为空'
  });
  var userComment = new comment({
    movie_id: req.body.movie_id,
    username: req.body.username ? req.body.username : '匿名用户',
    context: req.body.context,
    check: 0
  })
  userComment.save(err => {
    if (err) {
      res.json({
        status: 1,
        message: '评论失败'
      })
    } else {
      res.json({
        status: 0,
        message: '评论成功'
      })
    }
  });
})

//获取当前电影所有评论
router.post('/comments', (req, res, next) => {
  console.log(req.body);

  if (!req.body.movieId) {
    res.json({
      status: 1,
      message: '获取电影id失败'
    })
  } else {
    comment.findByMovieId(req.body.movieId, (err, comments) => {
      if (comments) {
        res.json({
          status: 0,
          message: '评论获取成功',
          data: comments
        })
      } else {
        res.json({
          status: 1,
          message: '评论获取失败'
        })
      }
    })
  }
})

//用户点赞
router.post('/support', (req, res, next) => {
  if (!req.body.movie_id) return res.json({
    status: 1,
    message: '电影id为空'
  })
  movie.findById(req.body.movie_id, (err, checkMovie) => {
    if (checkMovie) {
      movie.updateOne({
        _id: req.body.movie_id
      }, {
        movieNumSuppose: checkMovie.movieNumSuppose + 1
      }), (err, result) => {
        if (err) {
          res.json({
            status: 1,
            message: '点赞失败'
          })
        } else {
          res.json({
            status: 0,
            message: '点赞成功'
          })
        }
      }
    }
  })
})

//用户找回密码
router.post('/findPassword', (req, res, next) => {
  if (req.body.repassword) {
    if (req.body.token) {
      if (!req.body.user_id) {
        res.json({
          status: 1,
          message: '用户登录错误'
        })
      }
      if (!req.body.password) {
        res.json({
          status: 1,
          message: '用户原密码错误'
        })
      }
      if (req.body.token == getMD5Password(req.body.user_id)) {
        user.findOne({
          _id: req.body.user_id,
          username: req.body.username,
          password: req.body.password
        }, (err, checkUser) => {
          if (checkUser) {
            user.updateOne({
              _id: req.body.user_id
            }, {
              password: req.body.repassword
            }, (err, result) => {
              if (err) {
                res.json({
                  status: 1,
                  message: '密码重置失败'
                })
              } else {
                res.json({
                  status: 0,
                  message: '密码更改成功',
                  data: result
                })
              }
            })
          } else
            res.json({
              status: 1,
              message: '用户原密码错误'
            })
        })
      }
    } else {
      user.findUserPassword(req.body.username, req.body.userMail, req.body.userPhone, (err, checkUser) => {
        if (checkUser.length != 0) {
          user.updateOne({
            _id: checkUser[0]._id
          }, {
            password: req.body.repassword
          }, (err, result) => {
            if (err) {
              res.json({
                status: 1,
                message: '密码重置失败'
              })
            } else {
              res.json({
                status: 0,
                message: '密码更改成功',
                data: result
              })
            }
          })
        } else {
          res.json({
            status: 1,
            message: '用户不存在'
          })
        }
      })
    }
  } else {
    user.findUserPassword(req.body.username, req.body.userMail, req.body.userPhone, (err, checkUser) => {
      if (!req.body.username) return res.json({
        status: 1,
        message: '用户名为空'
      });
      if (!req.body.userMail) return res.json({
        status: 1,
        message: '邮箱为空'
      });
      if (!req.body.userPhone) return res.json({
        status: 1,
        message: '手机号为空'
      })
      if (checkUser.length != 0) {
        res.json({
          status: 0,
          message: '验证成功，请修改密码',
        })
      } else {
        res.json({
          status: 1,
          message: '信息错误'
        })
      }
    })
  }
})

//用户发送站内信
router.post('/sendEmail', (req, res, next) => {
  if (!req.body.token) return res.json({
    status: 1,
    message: '用户登录状态出错'
  });
  if (!req.body.user_id) return res.json({
    status: 1,
    message: '用户登录状态出错'
  });
  if (!req.body.toUserName) return res.json({
    status: 1,
    message: '未选择收件人'
  });
  if (!req.body.title) return res.json({
    status: 1,
    message: '请输入标题'
  });
  if (!req.body.context) return res.json({
    status: 1,
    message: '请输入发送内容'
  })
  if (req.body.token == getMD5Password(req.body.user_id)) {
    user.findByUsername(req.body.toUserName, (err, checkToUser) => {
      if (checkToUser.length == 0) {
        res.json({
          status: 1,
          message: '您发送的对象不存在'
        })
      } else {
        var sendMail = new mail({
          fromUser: req.body.user_id,
          toUser: checkToUser[0]._id,
          title: req.body.title,
          context: req.body.context
        })
        sendMail.save(err => {
          if (err) {
            res.json({
              status: 1,
              message: '信息发送失败'
            })
          } else {
            res.json({
              status: 0,
              message: '信息发送成功'
            })
          }
        })
      }
    })
  } else {
    res.json({
      status: 1,
      message: '用户登录错误'
    })
  }

})

//用户接收站内信
router.post('/showEmail', (req, res, next) => {
  //receive参数1 发送 2接收
  if (!req.body.token) return res.json({
    status: 1,
    message: '用户登录状态出错'
  });
  if (!req.body.user_id) return res.json({
    status: 1,
    message: '用户登录状态出错'
  });
  if (!req.body.receive) return res.json({
    status: 1,
    message: '参数错误'
  });
  if (req.body.token == getMD5Password(req.body.user_id)) {
    if (req.body.receive == 1) {
      mail.findByFromUserId(req.body.user_id, (err, sendMails) => {
        res.json({
          status: 0,
          message: '信息获取成功',
          data: sendMails
        })
      })
    }
    if (req.body.receive == 2) {
      mail.findByToUserId(req.body.user_id, (err, receiveMails) => {
        res.json({
          status: 0,
          message: '信息获取成功',
          data: receiveMails
        })
      })
    }
  } else {
    res.json({
      status: 1,
      message: '用户登录错误'
    })
  }
})

//获取MD5值
function getMD5Password(id) {
  var md5 = crypto.createHash('md5');
  var token_before = id + init_token;
  return md5.update(token_before).digest('hex');
}

module.exports = router;