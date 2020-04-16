var app = getApp();
var time = require("../../utils/util.js")
const { $Toast } = require('../../dist/base/index');
Page({
  data: {
    dataList: {},
    visible1: false,
    visible2: false,
    id: ''
  },
  list() {
    var that = this
    app.func.reqget('/xcx/order/fetchUserOrders', { 'uid': wx.getStorageSync('uid') ,status:3 }, (res) => {
      for (let i = 0; i < res.data.content.length; i++) {
        res.data.content[i].orderTime = time.formatTime(res.data.content[i].orderTime)
        res.data.content[i].payTime = time.formatTime(res.data.content[i].payTime)
      }
      that.setData({
        dataList: res.data.content,
      })
    })
  },
  hanleopen(e) {
    var item = JSON.stringify(e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '../goods/index?item=' + item ,
    })
  },
  handleClose1(e) {
    var that = this
    that.setData({
      visible1: false
    });
    if (e.type == 'ok') {
      app.func.reqpost('/xcx/entrustSale/offline?id=' + that.data.id + '&uid=' + wx.getStorageSync('uid'), {}, (res) => {
        if (res.code == 'ok') {
          $Toast({
            content: "下架成功",
          });
          that.list()
        } else {
          $Toast({
            content: res.message,
          });
        }
      })
    }
  },
  hanleopen2(e) {
    var that  = this
    that.setData({
      visible2:true,
      orderId: e.currentTarget.dataset.id
    })
  },
  handleClose3(){
    var that = this
    that.setData({
      visible2: false
    })
  },
  handleClose2(e){
    var that = this
    that.setData({
      visible2: false
    })
    app.func.reqpost('/xcx/auction/speedup?orderId=' + that.data.orderId + '&uid=' + wx.getStorageSync('uid'), {}, (res) => {
      if (res.code == 'ok') {
        $Toast({
          content: "加速成功",
        });
        that.list()
      } else {
        $Toast({
          content: res.message,
        });
      }
    })
  },
  onLoad: function (options) {
    this.list()
  },
  onPullDownRefresh: function () {
    this.list()
    wx.stopPullDownRefresh()
  },
  onReachBottom: function () {

  },
})