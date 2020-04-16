var app = getApp();
Page({
  data: {
    imgUrl: [],
    imgUrl2: [],
    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular: true,
    dataList:{},
    id:''
  },
  hanle(e) {
    wx.navigateTo({
      url: '../details/index?productId=' + e.currentTarget.dataset.id
    })
  },
  btn(e) {
    wx.navigateTo({
      url: '../conversion/index?name=' + 'quan' + "&auctionLineId=" +this.data.dataList.id
    })
  },
  equity(){
    var that = this
    app.func.reqget('/xcx/equityMall/fetchEquityGoodsDetail', { id: this.options.productId ? this.options.productId : wx.getStorageSync('productId') }, (res) => {
      if (res.code == 'B19' || res.data == null) {
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
    this.equity()
    var that = this
    that.setData({
      productId: this.options.productId
    })
  },
  onReady: function () {

  },
  onShow: function () {
    this.equity()
  },
  onShareAppMessage: () => {
    // var that = this
    return {
      title: this.data.tilte,
      path: '/pages/equityValDetails/index?id=' + this.data.productId ? this.data.productId : wx.getStorageSync('productId')
    }
  }
})