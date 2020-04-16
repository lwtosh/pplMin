var app = getApp();
const { $Toast } = require('../../dist/base/index');
Page({
  data: {
  dataList:{},
  userInfo:{},
    info:{},
  dataList2:'',
    active:false,
  directCount :''
  },
  hanle(){
    wx.navigateTo({
      url: '../addressManage/index'
    })
  },
  hanle1() {
    wx.navigateTo({
      url: '../entrust/index'
    })
  },
  hanle2() {
    wx.navigateTo({
      url: '../sale/index'
    })
  },
  hanle3() {
    wx.navigateTo({
      url: '../kefu/index'
    })
  },
  code(){
    wx.navigateTo({
      url: '../share/index'
    })
  },
  hanleOrder1() {
    wx.navigateTo({
      url: '../order/index?currentTab='+ 1
    })
  },
  hanleOrder2() {
    wx.navigateTo({
      url: '../order/index?currentTab=' + 2
    })
  }, 
  hanleOrder3() {
    wx.navigateTo({
      url: '../order/index?currentTab=' + 3
    })
  },
  hanleOrder4(){
    wx.navigateTo({
      url: '../order/index?currentTab=' + 4
    })
  },
  more(){
    wx.navigateTo({
      url: '../order/index?currentTab=' + 0
    })
  },
  chongzhi(){
    $Toast({
      content: '需要到APP去充值',
    });
  },
  my(){
    var that = this
    app.func.reqget('/xcx/account/getAccountByUid', {'uid': wx.getStorageSync('uid')}, (res) => {
      that.setData({
        dataList: res.data,
      })
    })
    app.func.reqget('/xcx/user/fetchTinyUser', { 'userId': wx.getStorageSync('uid') }, (res) => {
      
      that.setData({
        userInfo: res.data,
      })
    })
    app.func.reqget('/xcx/account/getUserEquityByUid', { 'uid': wx.getStorageSync('uid') }, (res) => {
      if (res.code == 'B19') {
        that.setData({
          active: true
        })
      }
      that.setData({
        dataList2: res.data.equity,
      })
    })
    app.func.reqget('/xcx/order/fetchOrderCount', { 'uid': wx.getStorageSync('uid') }, (res) => {
      that.setData({
        info: res.data,
      })
    })
    app.func.reqget('/xcx/user/fetchSubCount', { 'uid': wx.getStorageSync('uid') }, (res) => {
      that.setData({
        directCount : res.data.directCount ,
      })
    })
  },
  onLoad: function (options) {
    this.my()
  },
  onPullDownRefresh: function () {
    this.my()
    wx.stopPullDownRefresh()
  },
  handleLogin(){
    wx.redirectTo({
      url: '../index/index',
    })
  },
  onShareAppMessage: function () {
    return {
      desc: "拍拍乐",
      path: '/pages/my/index'
    }
  }
})