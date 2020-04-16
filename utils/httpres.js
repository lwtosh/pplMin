
var rootDocment = 'https://ppl-api-test.ppljg66.com';
// var rootDocment = 'https://api.ppljg99.com';

function req1(url, data, cb) {
  wx.request({
    url: rootDocment + url,
    data:data,
    method: 'post',
    header: {
      'content-type': 'application/json', // 默认值
      'uid': wx.getStorageSync('uid'),
      'token': wx.getStorageSync('token'),
      'loginChannel': 'WEB'
       },
    success: function (res) {
      // if(res.code = 'B19'){
      //   wx.redirectTo({
      //     url: '../../pages/index/index',
      //   })
      // }
      return typeof cb == "function" && cb(res.data)
    },
    fail: function () {
      return typeof cb == "function" && cb(false)
    }
  })
}
function req2(url, data, cb) {
  wx.request({
    url: rootDocment + url,
    data: data,
    method: 'get',
    header: {
      'content-type': 'application/json', // 默认值
      'uid': wx.getStorageSync('uid'),
      'token': wx.getStorageSync('token'),
      'loginChannel': 'WEB'
      },
    success: function (res) {
      // if (res.code = 'B19') {
      //   wx.redirectTo({
      //     url: '../../pages/index/index',
      //   })
      // }
      return typeof cb == "function" && cb(res.data)
    },
    fail: function () {
      return typeof cb == "function" && cb(false)
    }
  })
}
module.exports = {

  req1: req1,

  req2: req2,


}