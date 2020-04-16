var http = require('utils/httpres.js') 
App({
  data: {
    path:''
  },
  onLaunch: function (options) {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var obj = wx.getLaunchOptionsSync()
    var  path = obj.path 
    wx.login({
      success: function (res) {
        wx.setStorage({key:'code', data:res.code})
        wx.getSetting({
          success: function (res) {
            if (res.authSetting['scope.userInfo']) {
            }else {
              // wx.redirectTo({
              //   url: '../../pages/index/index',
              // })
            }
          }
        });
        wx.getUserInfo({
          withCredentials: true,
          success: function (res) {
            // 取得用户微信信息，调用后端接口更新用户信息
            const userInfo = res.userInfo
            const encryptedData = res.encryptedData
            const iv = res.iv
            const params = {
              nick_name: userInfo.nickName,
              gender: userInfo.gender,
              province: userInfo.province,
              city: userInfo.city,
              country: userInfo.country,
              avatar_url: userInfo.avatarUrl,
              encrypted_data: encryptedData,
              encrypt_iv: iv
            }
          }
        })
      }
    })  
  },
  func: {
    reqget: http.req2 , //这里配置我们需要的方法
    reqpost: http.req1,  //这里配置我们需要的方法
    cale:''
  }
})