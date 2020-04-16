const {
  $Toast
} = require('../../dist/base/index');
var obj = wx.getLaunchOptionsSync()
var path = obj.path
Page({
  data: {
    isShow: false,
    isActive: true,
    ishide: true,
    current: 'homepage',
    dataList: {},
    dataList1: {},
    avatar: '',
    beUid: "",
    getbeUid:'',
    hong:false,
    invokeId: "",
    nickName: '',
    status: '',
    wechat:''
  },
  chat(){
    var that = this
    that.setData({
      wechat: { type: 'RED_PACK' },
    })
    var wechat = JSON.stringify(this.data.wechat)
    that.setData({
      wechat: wechat
    })
  },
  onLoad: function(options) {
    this.setData({
      beUid: options.beUid,
      invokeId: options.invokeId,
    })
    var that = this
    wx.request({
      url: 'https://api.ppljg99.com/xcx/redpack/getOpenRedPackInfo',
      header: {
        'content-type': 'application/json', // 默认值
        'uid': wx.getStorageSync('uid'),
        'token': wx.getStorageSync('token'),
        'loginChannel': 'WEB'
      },
      data: {
        beUid: that.data.beUid ? that.data.beUid : wx.getStorageSync('beUid'),
        invokeId: that.data.invokeId ? that.data.invokeId : wx.getStorageSync('invokeId')
      },
      method: "get",
      success: function(res) {
        if (res.data.code === 'ok') {
          that.setData({
            dataList: res.data.data,
            status: res.data.data.status,
            getbeUid: wx.getStorageSync('uid')
          })
        } else {
          wx.setStorage({
            key: 'enws',
            data: '1'
          })
          wx.redirectTo({
            url: '../../pages/index/index',
          });
        }
        if (that.data.dataList.beOpenUserInfo.id === that.data.beUid || that.data.dataList.beOpenUserInfo.id === wx.getStorageSync('beUid') ){
          that.setData({ hong:true})
        }
        if (res.data.data.status == 2) {
          wx.request({
            url: 'https://api.ppljg99.com/xcx/redpack/openRedpack',
            header: {
              'content-type': 'application/x-www-form-urlencoded', // 默认值
              'uid': wx.getStorageSync('uid'),
              'token': wx.getStorageSync('token'),
              'loginChannel': 'WEB'
            },
            data: {
              beUid: that.data.beUid ? that.data.beUid : wx.getStorageSync('beUid'),
              invokeId: that.data.invokeId ? that.data.invokeId : wx.getStorageSync('invokeId')
            },
            method: "post",
            success: function(res) {
              if (res.data.code === 'ok') {
                that.setData({
                  dataList1: res.data.data,
                })
              } else {
              }
            }
          })
        }
      }
    })
  },

  hanle(e) {
    var productTd = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../details/index?productTd=' + productTd
    })
  },
  //瓜分现金红包
  btn1() {
    this.setData({
      isShow: true,
      ishide: false
    })
    var that = this
    wx.request({
      url: 'https://api.ppljg99.com/xcx/redpack/openRedpack',
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
        'uid': wx.getStorageSync('uid'),
        'token': wx.getStorageSync('token'),
        'loginChannel': 'WEB'
      },
      data:{
        beUid: that.data.beUid ? that.data.beUid : wx.getStorageSync('beUid'),
        invokeId: that.data.invokeId ? that.data.invokeId : wx.getStorageSync('invokeId')
      },
      method: "post",
      success: function(res) {
        if (res.data.code !== 'B19') {
          that.setData({
            dataList1: res.data.data
          })
        } else {
        }
      }
    })
  },
  // 关闭红包弹框
  btn2() {
    this.setData({
      isHide: true,
      isActive: false
    })
  },
  //继续瓜分红包
  btn3() {
    this.onLoad()
  },
  //离开
  btn4() {
    this.setData({
      isHide: false
    })
  },
  launchAppError (e){
    if (e.detail.errMsg){
      wx.navigateTo({
        url: '../money/index'
      })
    }
  },
  btn5() {
    wx.navigateTo({
      url: '../money/index'
    })
  },

  onShareAppMessage: function() {}
})