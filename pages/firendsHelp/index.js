const { $Toast } = require('../../dist/base/index');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    level: '2',
    flag: false
  },
  handleOpen1: function () {
    this._interval = setTimeout(() => {
      this.setData({
        flag: true
      })
    }, 1000)
    clearInterval(this._interval)
    this.setData({
      flag: false
    })
  },
  handleSuccess() {
    $Toast({
      content: '~ 你已成功送他2积分',
      type: 'success'
    });
  },
  onShow: function () {
  },
  onShareAppMessage: (res) => {
    return {
      title: '我的拍拍乐积分用完了，点击分按钮送我积分吧!',
      path: '/pages/details/index?id=123',
      imageUrl: "../../asset/logo.png",
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  },
})