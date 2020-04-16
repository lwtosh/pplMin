//获取应用实例
const app = getApp()
var obj = wx.getLaunchOptionsSync()
var inviteCode = obj.query.inviteCode
var beUid = obj.query.beUid
var invokeId = obj.query.invokeId
var productId = obj.query.productId
// var detailsId = obj.query.detailsId
var bigSceneId = obj.query.bigSceneId
var path = obj.path
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    flag: true,
    isBindMobile: '',
    path:'',
  },
  onLoad: function (options) {
    var obj = wx.getLaunchOptionsSync()
    var inviteCode = obj.query.inviteCode
    wx.setStorage({ key: 'inviteCode', data: inviteCode })
    console.log(wx.getStorageSync('inviteCode'))
    wx.login({
      success: function (res) {
        wx.setStorageSync('code', res.code)
      }
    })
  },

  bindGetUserInfo: function(e) {
    var that = this;
     if (e.detail.userInfo) {
      //用户按了允许授权按钮
      wx.request({
        url: 'https://ppl-api-test.ppljg66.com/xcx/login/doLoginByCode',
        // url: 'https://api.ppljg99.com/xcx/login/doLoginByCode',
        method: 'post',
        data: {
          authCode: wx.getStorageSync('code'),
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: data => {
          if (data.data.code == 'ok') {
            wx.setStorage({ key: 'wxLoginId', data: data.data.data.wxLoginId })
            if (data.data.data.isBindMobile === true) {
              wx.setStorage({ key: 'uid', data: data.data.data.userId })
              wx.setStorage({ key: 'token', data: data.data.data.token })
              wx.setStorage({ key: 'beUid', data: beUid })
              wx.setStorage({ key: 'invokeId', data: invokeId })
              wx.setStorage({ key: 'productId', data: productId })
              // wx.setStorage({ key: 'detailsId', data: detailsId })
              console.log(data.data.data.userId)
              wx.setStorage({ key: 'bigSceneId', data: bigSceneId })
              if (path == 'pages/list/index' || path == undefined){
               wx.switchTab({
                url: '../list/index'
                })
              }else{
               console.log(path)
              wx.redirectTo({
                url: '../../'+path,
              })  
              }
              
            }
            // that.setData({ flag: false})
          } else {
            wx.showToast({
              title: '请重新授权！',
              duration: 2000
            })
            that.Login()
            that.setData({ flag: false })
          }
        },
        fail(){
          wx.showToast({
            content: '请求出错。请重新授权',
          })
          that.Login()
          that.setData({ flag: false })
        }
      });
    } else {
      //用户按了拒绝按钮
       wx.switchTab({
         url: '../list/index'
       })
      // wx.showModal({
      //   title: '警告',
      //   content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!',
      //   success: function(res) {
      //     if (res.confirm) {}
      //   }
      // });
    }
  },
  handleGetPhoneNumber(e) {
    var that = this;
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      //用户按了允许授权按钮
      wx.request({
        url: 'https://ppl-api-test.ppljg66.com/xcx/login/doLoginAndBindMobile',
        method: 'post',
        data: {
          wxLoginId: wx.getStorageSync('wxLoginId') ,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          inviteCode: wx.getStorageSync('inviteCode') ? wx.getStorageSync('inviteCode'): 'SYSTEM'
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          if (res.data.code == 'ok') {
            wx.setStorage({ key: 'wxLoginId', data: res.data.data.wxLoginId })
            wx.setStorage({ key: 'uid', data: res.data.data.userId })
            wx.setStorage({ key: 'token', data: res.data.data.token })
            wx.setStorage({ key: 'beUid', data: beUid })
            wx.setStorage({ key: 'invokeId', data: invokeId })
            wx.setStorage({ key: 'productId', data: productId })
            // wx.setStorage({ key: 'detailsId', data: detailsId })
            wx.setStorage({ key: 'bigSceneId', data: bigSceneId })
            wx.showToast({
              title: '绑定成功',
              duration: 2000
            })
            if (path == '') {
              wx.navigateBack()
            }
            wx.redirectTo({
              url: '../../' + path,
            })
          } else {
            wx.showModal({
              content: res.data.message,
              showCancel: false,
              success: res => {
                if (res.confirm) { // 用户确认后
                  that.setData({
                    flag: true
                  });
                }
              }
            })
          }
        }
      });
    } else {
    }
  },
  bindGetUserInfo1(){
    wx.switchTab({
      url: '../list/index'
    })
  },
  Login() {
    wx.login({
      success: function(res) {
        wx.setStorageSync('code', res.code)
      }
    })
  }

})