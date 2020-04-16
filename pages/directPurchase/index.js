
Page({

  data: {
    dataList: {},
    imgUrl: [],
    indicatorDots: true,
    autoplay: true,
    indicatorActiveColor: '#f52a6a',
    interval: 3000,
    duration: 1000,
    circular: true,
    current: 'tab1',
    current_scroll: 'tab1'
  },
  handleChange({ detail }) {
    this.setData({
      current: detail.key
    });
  },
  handleChangeScroll({ detail }) {
    this.setData({
      current_scroll: detail.key
    });
  },
  hanle(e) {
    wx.navigateTo({
      url: '../consignmentDetails/index'
    })
  },
  list() {
    var that = this
    wx.request({
      url: 'https://ppl-api-test.ppljg66.com/xcx/auction/fetchAuctionLinePage',
      header: {
        'content-type': 'application/json', // 默认值
        'uid': wx.getStorageSync('uid'),
        'token': wx.getStorageSync('token'),
        'loginChannel': 'WEB'
      },
      data: {
        limit: 5,
        page: 1,
      },
      method: "get",
      success: function (res) {
        if (res.data.code == 'B19') {
          wx.redirectTo({
            url: '../../pages/index/index',
          })
        }
        that.setData({
          dataList: res.data.data.content,
          isActive: true
        })
        for (var i = 0; i < that.data.dataList.length; i++) {
          if (that.data.dataList[i].goodsVo.onlookerNum > 9999) {
            var num = (that.data.dataList[i].goodsVo.onlookerNum / 10000).toFixed(2) + 'W'
            that.setData({
              book: num,
            })
          }
          if (that.data.dataList[i].goodsVo.onlookerNum.length > 9999) {
            var num = (that.data.dataList[i].payNum.length / 10000).toFixed(2) + 'W'
            that.setData({
              pay: num,
            })
          }
        }
        for (var i = 0; i < that.data.dataList.length; i++) {
          if (that.data.dataList[i].countDown > 0) {
            var min = Math.floor(that.data.dataList[i].countDown % 3600);
            var num = min
            setInterval(function () {
              that.setData({
                num: num--,
                messageTime: Math.floor(min / 3600) + ":" + Math.floor(min / 60) + ":" + min % 60
              })
            }, 1000)
          }
        }
      }
    })
    wx.request({
      url: 'https://ppl-api-test.ppljg66.com/xcx/auction/fetchBanners',
      header: {
        'content-type': 'application/json', // 默认值
        'uid': wx.getStorageSync('uid'),
        'token': wx.getStorageSync('token'),
        'loginChannel': 'WEB'
      },
      data: {
        type: 'AUCTION',
      },
      method: "get",
      success: function (res) {
        that.setData({
          imgUrl: res.data.data,
        })

      }
    })
  },
  onLoad: function (options) {
    this.list()
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {
  },
  onShareAppMessage: function () {

  }
})