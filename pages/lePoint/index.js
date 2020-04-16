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
    daindex1: 0,
    circular: true,
    current: 'tab1',
    imageurl1: "../../asset/action1.png",
    daindex1: 0,
    sortType:'DEFAULT',
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
    if (cur == "tab3") {
      this.setData({
        sortType: "NEW"
      })
      this.list()
    }
    if (cur == "tab2") {
      this.setData({
        sortType: "SALE_NUMBER"
      })
      this.list()
    }
    if (cur == "tab4") {
      this.hanlechage()
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
        sortType: "LP_ASC"
      })
      this.list()
    } else {
      this.setData({
        imageurl1: "../../asset/action1.png",
        daindex1: 0
      })
      this.setData({
        sortType: "LP_DESC"
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
      url: '../lePointDetails/index?productId=' + e.currentTarget.dataset.id
    })
  },
  hanleConversion(e) {
    wx.navigateTo({
      url: '../conversion/index?name=' + "le" + '&auctionLineId=' + e.currentTarget.dataset.id
    })
  },
  list() {
    var that = this
    app.func.reqget('/xcx/lpmall/fetchLpLines', { sortType: that.data.sortType }, (res) => {
      if (res.code == 'B19') {
        // wx.redirectTo({
        //   url: '../../pages/index/index',
        // })
      }
      that.setData({
        dataList: res.data.content
      })
    })
    app.func.reqget('/xcx/other/fetchBanners', { type: 'LE_MALL', }, (res) => {
      that.setData({
        imgUrl: res.data
      })
    })
  },
  onLoad: function (options) {
    this.list()
  },
  onPullDownRefresh: function () {
    this.list()
    wx.stopPullDownRefresh()
  },
  onShareAppMessage: function () {
    return {
      desc: "乐点商城",
      path: '/pages/lePoint/index?sortType=DEFAULT'
    }
  }
})