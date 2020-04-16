var app = getApp();

Page({
  data: {
    dataInfo:''
  },
  share(){
    var that = this
    app.func.reqget('/xcx/user/fetchInviteUserInfo', { 'uid': wx.getStorageSync('uid')}, (res) => {
      that.setData({
        dataInfo: res.data
      })
    })
  },
  onLoad: function (options) {
   this.share()
  },
  onShareAppMessage: function () {
    return {
      desc: "拍拍乐",
      path: '/pages/share/index?uid=' + wx.getStorageSync('uid')
    }
  }
})