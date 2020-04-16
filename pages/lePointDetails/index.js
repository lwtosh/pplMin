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
    title:"",
    circular: true,
  },
  btn(e) {
    wx.navigateTo({
      url: '../conversion/index?name=' + 'le' + "&auctionLineId=" +this.data.dataList.id
    })
  },
  lePoint() {
    var that = this
    app.func.reqget('/xcx/lpmall/fetchLpLineById', { auctionLineId: this.options.productId ? this.options.productId : wx.getStorageSync('productId') }, (res) => {
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
    this.lePoint()
    this.setData({
      productId: this.options.productId
    })
  },
  onShow(){
    this.lePoint()
  },
  onShareAppMessage: (res) => {
    return {
      desc: this.data.tilte,
      path: '/pages/lePointDetails/index?id=' + this.data.productId ? this.data.productId : wx.getStorageSync('productId')
    }
  }
})