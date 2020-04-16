var app = getApp();
var obj = wx.getLaunchOptionsSync()
var path = obj.path
var productId = obj.query.productId
var inviteCode = obj.query.inviteCode
var secen = obj.scene
var util = require('../../utils/util.js');
Page({
  data: {
    imgUrl: [],
    imgUrl2: [],
    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular: true,
    book: '',
    pay: '',
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    flag: true,
    isBindMobile: '',
    clearTimer: false,
    dataList: {},
    startTime:'',
    dataList2: {},
    productId: '',
    isShow: false,
  },
  onLoad: function(options) {
    var that = this;
    wx.request({
      url: 'https://ppl-api-test.ppljg66.com/xcx/auction/fetchAuctionLineDetail',
      header: {
        'content-type': 'application/json', // 默认值
        'uid': wx.getStorageSync('uid'),
        'token': wx.getStorageSync('token'),
        'loginChannel': 'WEB'
      },
      data: {
        id: options.productId ? options.productId : wx.getStorageSync('productId'),
        roomId:''
      },
      method: "get",
      success: function(res) {
        if (res.data.code == 'ok') {
          that.setData({
            dataList: res.data.data,
            title: res.data.data.goodsName,
            imgUrl: res.data.data.goodsVo.goodsImgs.split(','),
            imgUrl2: res.data.data.goodsVo.goodsDetailImgs.split(',')
          })
          wx.setNavigationBarTitle({
            title: that.data.dataList.goodsName
          })
            if (that.data.dataList.goodsVo.onlookerNum > 9999) {
              var num = (that.data.dataList.goodsVo.onlookerNum / 10000).toFixed(2) + 'W'
              that.setData({
                book: num,
              })
            }
              if (that.data.dataList.payNum.length > 9999) {
              var num = (that.data.dataList.payNum.length / 10000).toFixed(2) + 'W'
              that.setData({
                pay: num,
              })
            }
        } else if (res.data.code == 'B19'){
          wx.clearStorageSync()
          wx.redirectTo({
            url: '../../pages/index/index',
          })
        } else if (that.data.dataList == '') {
          wx.redirectTo({
            url: '../../pages/list/index',
          })
          }else {
        }
      },
    })
    wx.request({
      url: 'https://ppl-api-test.ppljg66.com/xcx/auction/fetchRoundForAuctionLine',
      header: {
        'content-type': 'application/json', // 默认值
        'uid': wx.getStorageSync('uid'),
        'token': wx.getStorageSync('token'),
        'loginChannel': 'WEB'
      },
      data: {
        limit: 5,
        page: 1,
        auctionLineId: options.productId ? options.productId : wx.getStorageSync('productId')
      },
      method: "get",
      success: function(res) {
        that.setData({
          dataList2: res.data.data,
        })
      }
    })
  },
  // 出价
  btn() {
    wx.navigateTo({
      url: '../bid/index'
    })
  },
  hanleJoin(e) {
    wx.setStorage({ key: 'bigSceneId',data: e.target.dataset.id })
    wx.navigateTo({
      url: '../bid/index?bigSceneId=' + e.target.dataset.id
    })
  },
  onShareAppMessage: (res) => {
    return {
      title: '',
      path: '/pages/details/index?id=' + wx.getStorageSync('productId') || productId,
      imageUrl: "../../asset/logo1.jpg",
    }
  }
})