// import http from '../../utils/httpres.js'
var app = getApp();
const { $Toast } = require('../../dist/base/index');
Page({
  data: {
    dataList: {},
    dataList2: {},
    imgUrl: [],
    indicatorDots: true,
    autoplay: true,
    dataList2Active:false,
    indicatorActiveColor: '#f52a6a',
    interval: 3000,
    duration: 1000,
    circular: true,
    isActive: false,
    messageTime:'',
    msg:false,
    cale:"1",
    book: '',
    toView: "",
    pay: '',
  },
  onLoad: function(options) {
    this.list()
  },
  login(){
    wx.redirectTo({
      url: '../../pages/index/index',
    })
  },
  handleMsg(){
    var that = this
    that.setData({
      msg: false,
    })
  },
  list() {
    var that = this
    console.log(that.data.cale)
    app.func.reqget('/xcx/auction/fetchNewestList', 
      { limit: 5, page: 1, }, (res)=>{
        if (res.code == 'B19') {
          
          that.setData({
            msg: true,
          })
        }
        if (res.code == 'B23') {
            $Toast({
              content: '调用远程服务错误，请等一会再进入',
            });
        }
        
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
        for (var i = 0; i < res.data.content.length; i++) {
          if (res.data.content[i].countDown > 0) {
            var min = res.data.content[i].countDown % 3600;
            that.setData({
              messageTime: Math.floor(res.data.content[i].countDown / 3600) + ":" + Math.floor(min / 60) + ":" + min % 60
            })
          }
        }
        that.setData({
          dataList: res.data.content,
          
        })
      })
    app.func.reqget('/xcx/other/fetchBanners', { type: 'INDEX',},(res)=>{
      that.setData({
        imgUrl: res.data,
        isActive: true
      })
    })
    app.func.reqget('/xcx/equityMall/fetchQualityForIndex',{}, (res) => {
      that.setData({
        dataList2: res.data.content,
      })
      
     
    })
  },
  hanle(e) {
    wx.navigateTo({
      url: '../details/index?productId=' + e.currentTarget.dataset.id
    })
  },
  hanle2(e) {
    wx.navigateTo({
      url: '../equityValDetails/index?productId=' + e.currentTarget.dataset.id
    })
  },
  more(){
    wx.navigateTo({
      url: '../equityVal/index'
    })
  },
  jimai() {
    wx.navigateTo({
      url: '../consignment/index'
    })
  },
  ledian(){
    wx.navigateTo({
      url: '../lePoint/index'
    })
  },
  quan() {
    wx.navigateTo({
      url: '../equityVal/index'
    })
  },
  zhi() {
    $Toast({
      content: '敬请期待...',
    });
  },
  onPullDownRefresh: function() {
    this.list()
  wx.stopPullDownRefresh()
  },
  onReachBottom: function() {

  },
  onHide(){
    // console.log('关闭页面了')
    // this.setData({
    //   cale:2
    // })
    // console.log(this.data.cale)
  },
  onShareAppMessage: function() {
    return {
      desc: "拍拍乐首页",
      path: '/pages/list/index'
    }
  }
})