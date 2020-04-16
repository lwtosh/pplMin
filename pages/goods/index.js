var app = getApp();
const { $Toast } = require('../../dist/base/index');
Page({
  data: {
    addresssInfo: {},
    dataInfo: {},
    auctionLineId: "",
    visible1: false
  },

  address() {
    var that = this
    if (that.data.dataInfo.addressId == '' || that.data.dataInfo.tinyUserInfo === null ) {
      app.func.reqget('/xcx/user/fetchUserDefaultAddress', { 'uid': wx.getStorageSync('uid') }, (res) => {
        if (res.code == 'ok') {
          that.setData({
            addresssInfo: res.data
          })
        }
      })
    } else {
      that.setData({
        addresssInfo: that.data.dataInfo
      })
    }
  },
  // 提货
  pay() {
    var that = this
      that.setData({
        visible1: true
      });
  },
  handleClose1(e) {
    var that = this
    that.setData({
      visible1: false
    });
    if (e.type == 'ok') {
      console.log(that.data.addresssInfo)
      app.func.reqpost('/xcx/order/pickOrder?orderId=' + that.data.dataInfo.id + '&addressId=' + (that.data.item1 == undefined ? that.data.addresssInfo.addressId : that.data.item1.id)  + '&uid=' + wx.getStorageSync('uid'), {}, (res) => {
        if (res.code == 'ok') {
          $Toast({
            content: "提货成功",
          });
          setTimeout(function () {
            wx.navigateTo({
              url: '../entrust/index'
            })
          }, 1000)
        } else if (res.code == 'M07'){
          $Toast({
            content: "该订单不能提货",
          });
        } 
        else {
          $Toast({
            content: res.message,
          });
        }
      })
    }
  },
  onLoad: function (options) {
    var that = this
    that.setData({
      dataInfo: JSON.parse(options.item)
    });
    console.log(that.data.dataInfo)
    that.address()
  },
  hanleChange() {
    wx.navigateTo({
      url: '../add/index'
    })
  },
  onShow: function (e) {
    var that = this
    var item = JSON.parse(that.data.item)
    that.setData({
      item1: item
    });
  },
})