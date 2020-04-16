var app = getApp();
Page({
  data: {
    imgUrl: [],
    imgUrl2: [],
    dataList:{},
    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular: true,
  },
  hanle(e) {
    wx.navigateTo({
      url: '../details/index?productId=' + e.currentTarget.dataset.id
    })
  },
  btn(e) {
    wx.navigateTo({
      url: '../conversion/index?name=' + "ji" + "&auctionLineId=" + this.data.dataList.id
    })
  },
  jimai() {
    var that = this
    app.func.reqget('/xcx/entrustSale/fetchEntrustSaleDetail', { id: this.options.productId ? this.options.productId : wx.getStorageSync('productId') }, (res) => {
      if (res.code == 'B19' || res.data == null ) {
        wx.redirectTo({
          url: '../../pages/index/index',
        })
      }
      that.setData({
        dataList: res.data,
        tilte: res.data.goodsVo.goodsName,
        imgUrl: res.data.goodsVo.goodsImgs.split(','),
        imgUrl2: res.data.goodsVo.goodsDetailImgs.split(',')
      })
      wx.setNavigationBarTitle({
        title: res.data.goodsVo.goodsName
      })
    })
  },
  onLoad: function (options) {
   this.jimai()
    this.setData({
      productId: this.options.productId
    })
  },
  onReady: function () {
 
  },
  onShow: function () {
    this.jimai()
  },
  onShareAppMessage: (res) => {
    var that = this
    return {
      title: that.data.tilte,
      path: '/pages/consignmentDetails/index?id=' + that.data.productId ? that.data.productId : wx.getStorageSync('productId')
    }
  }
})