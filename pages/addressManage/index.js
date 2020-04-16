var app = getApp();
const { $Toast } = require('../../dist/base/index');
Page({
  data: {
    dataList: {},
    checked: "",
    visible1:false,
    isDefault: ''
  },
  handeList() {
    var that = this
    app.func.reqget('/xcx/user/fetchUserAddressList', {
      'uid': wx.getStorageSync('uid')
    }, (res) => {
      that.setData({
        dataList: res.data
      })
    })
  },
  handleAnimalChange(e) {
    var that = this
    app.func.reqpost('/xcx/user/updateUserAddressDefault?id=' + e.detail.value + '&isDefault=' + "1" + '&uid=' + wx.getStorageSync('uid'),{},(res) => {
      if(res.code == 'ok'){
        that.handeList()
      }
    })
  },
  address() {
    wx.navigateTo({
      url: '../address/index'
    })
  },
  addEidt(e) {
    wx.navigateTo({
      url: '../address/index?id=' + e.target.dataset.id
    })
  },
  del(e){
    var that = this
    that.setData({
      visible1: true,
      delId: e.target.dataset.id,
      isDefault: e.target.dataset.isdefault
    });
  },
  handleClose1(e) {
      var that = this
      that.setData({
        visible1: false
      });
      if (e.type == 'ok') {
        app.func.reqpost('/xcx/user/delUserAddress?id=' + that.data.delId + '&uid=' + wx.getStorageSync('uid'), {}, (res) => {
          if (res.code == 'ok') {
            $Toast({
              content: "删除成功",
            });
            this.handeList()
          } else {
            $Toast({
              content: res.message,
            });
          }
        })
      }
    },
  onLoad: function(options) {
    this.handeList()
  },
  onPullDownRefresh: function () {
    this.handeList()
    wx.stopPullDownRefresh()
  },
})