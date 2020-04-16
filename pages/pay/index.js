Page({
  data: {

  },
  onLoad: function (options) {

  },
  back(){
    wx.switchTab({
      url: '../list/index'
    })
  },
  order() {
    wx.navigateTo({
      url: '../order/index'
    })
  },
  onReady: function () {

  },
  onShow: function () {

  },
})