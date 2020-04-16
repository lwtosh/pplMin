var app = getApp();
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
    msg:false,
    current: 'tab1',
    sortType: 'DEFAULT',
    imageurl1: "../../asset/action1.png",
    daindex1: 0,
    current_scroll: 'tab1'
  },
  login() {
    wx.redirectTo({
      url: '../../pages/index/index',
    })
  },
  handleMsg() {
    var that = this
    that.setData({
      msg: false,
    })
  },
  handleChange(e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
        current: cur
      })
    }
    if (cur == "tab1") {
      var that = this
      that.setData({
        sortType: "DEFAULT"
      })
      this.list()
    }
    if (cur == "tab2") {
      this.setData({
        sortType: "NEW"
      })
      this.list()
    }
  },
  hanlechage() {
    this.setData({
      current: "tab4"
    })
    if (this.data.daindex1 == 0) {
      this.setData({
        imageurl1: "../../asset/action2.png",
        daindex1: 1
      })
      this.setData({
        sortType: "PRICE_ASC"
      })
      this.list()
    } else {
      this.setData({
        imageurl1: "../../asset/action1.png",
        daindex1: 0
      })
      this.setData({
        sortType: "PRICE_DESC"
      })
      this.list()
    }
  },
  handleChangeScroll({ detail }) {
    this.setData({
      current_scroll: detail.key
    });
  },
  hanle(e) {
    wx.navigateTo({
      url: '../consignmentDetails/index?productId=' + e.currentTarget.dataset.id
    })
  },
  list() {
    var that = this
    app.func.reqget('/xcx/entrustSale/fetchEntrustSaleList', { sortType: that.data.sortType ,'uid': wx.getStorageSync('uid')}, (res) => {
      if (res.code == 'B19') {
        // wx.redirectTo({
        //   url: '../../pages/index/index',
        // })
        that.setData({
          msg: true,
        })
      }
      that.setData({
        dataList: res.data.content
      })
    })
    app.func.reqget('/xcx/other/fetchBanners', { type: 'ENTRUST_SALE', }, (res) => {
      that.setData({
        imgUrl: res.data
      })
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
    this.list()
    wx.stopPullDownRefresh()
  },
  onReachBottom: function () {
  },
  onShareAppMessage: function () {
    return {
      desc: "寄卖商城",
      path: '/page/consignment/index?sortType=DEFAULT'
    }
  }
})