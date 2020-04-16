var app = getApp();
var time = require( "../../utils/util.js")
const { $Toast } = require('../../dist/base/index');
Page({
  data: {
    dataList:  [],
    dataList1: [],
    dataList2: [],
    dataList3: [],
    dataList4: [],
    currentTab: '',
    winHeight:'',
    hasMore: true,
    msgShow: false,
    visible:false,
    scrollPd: false,
    limit:20,
    page:1
  },
  list(){
    var that = this
    app.func.reqget('/xcx/order/fetchUserOrders', { 'uid': wx.getStorageSync('uid'), page: that.data.page, limit: that.data.limit,}, (res) => {
      for (let i = 0; i < res.data.content.length; i++) {
        res.data.content[i].operTime = time.formatTime(res.data.content[i].operTime)
        res.data.content[i].payTime = time.formatTime(res.data.content[i].payTime)
        res.data.content[i].dispatchTime = time.formatTime(res.data.content[i].dispatchTime)
        if (res.data.content[i].surplusPayTime  > 0) {
          var num = res.data.content[i].surplusPayTime
          var timer =  setInterval(function () { 
              that.setData({ 
                num : num--,
                surplusPayTime: that.count(num)
              })
              that.count(num)
            if (num == 0) {
              clearInterval(that.data.timer);
              that.setData({
                surplusPayTime: "00:00:00"
              })
            }
          }, 1000)
        }
      }
      // .sort((a, b) => { new Date(a.operTime).getTime() - new Date(b.operTime).getTime()})
      that.setData({
        dataList: res.data.content.concat(that.data.dataList),
      })
      //判断是否还有数据   当前页小于总页数则可以下拉加载数据       
      if (res.data.hasNext == true) {
        that.setData({
          scrollPd: true,//显示滑块、允许下拉
        })
        
      }else{
        that.setData({
          scrollPd: false,//显示滑块、允许下拉
        })
      }
    })
    app.func.reqget('/xcx/order/fetchUserOrders', { 'uid': wx.getStorageSync('uid'), status: "0"}, (res) => {
      for (let i = 0; i < res.data.content.length; i++) {
        res.data.content[i].operTime = time.formatTime(res.data.content[i].operTime)
        res.data.content[i].payTime = time.formatTime(res.data.content[i].payTime)
        if (res.data.content[i].surplusPayTime > 0) {
          var num = res.data.content[i].surplusPayTime
          var timer = setInterval(function () {
            that.setData({
              num: num--,
              surplusPayTime: that.count(num)
            })
            that.count(num)
            if (num == 0) {
              clearInterval(that.data.timer);
              that.setData({
                surplusPayTime: "00:00:00"
              })
            }
          }, 1000)
        }
      }
      that.setData({
        dataList1: res.data.content,
      })
    })
    app.func.reqget('/xcx/order/fetchUserOrders', { 'uid': wx.getStorageSync('uid'),status: "2" }, (res) => {
      for (let i = 0; i < res.data.content.length; i++) {
        res.data.content[i].operTime = time.formatTime(res.data.content[i].operTime)
        res.data.content[i].payTime = time.formatTime(res.data.content[i].payTime)
        res.data.content[i].dispatchTime = time.formatTime(res.data.content[i].dispatchTime)
      }
      that.setData({
        dataList2: res.data.content,
      })
    })
    app.func.reqget('/xcx/order/fetchUserOrders', { 'uid': wx.getStorageSync('uid'),status: "5" }, (res) => {
      for (let i = 0; i < res.data.content.length; i++) {
        res.data.content[i].operTime = time.formatTime(res.data.content[i].operTime)
        res.data.content[i].payTime = time.formatTime(res.data.content[i].payTime)
      }
      that.setData({
        dataList3: res.data.content,
      })
    })
    app.func.reqget('/xcx/order/fetchUserOrders', { 'uid': wx.getStorageSync('uid'), status: "4" }, (res) => {
      for (let i = 0; i < res.data.content.length; i++) {
        res.data.content[i].operTime = time.formatTime(res.data.content[i].operTime)
        res.data.content[i].payTime = time.formatTime(res.data.content[i].payTime)
      }
      that.setData({
        dataList4: res.data.content,
      })
    })
  },
  // 查看
  hanleCheck(e){
    if (e.currentTarget.dataset.status == 6){
      wx.navigateTo({
        url: '../sale/index'
      })
    }
    if (e.currentTarget.dataset.status == 3) {
      wx.navigateTo({
        url: '../entrust/index'
      })
    }
  },
  haneld(e){
    var that = this
    console.log(e)
    app.func.reqget('/order/fetchOrderLogisticsDetails?orderId=' + e.currentTarget.dataset.item.id+ '&uid=' + wx.getStorageSync('uid'), {}, (res) => {
      for (var i = 0; i < res.data.length; i++) {
        res.data[i].occurTime = time.formatTime(res.data[i].occurTime).split(" ")
      }
      that.setData({
        msgShow:true,
        dataInfos: res.data,
        datainfo2: e.currentTarget.dataset.item
      })
      console.log(that.data.dataInfos)
      that.setData({
        dataInfos2: res.data.slice(1,- 1),
      })
    })
  },
  hanleConfirm(e){
    var that = this
      that.setData({
        visible: true,
        orderNo: e.currentTarget.dataset.id
      })
  },
  handleClose1(e) {
    var that = this
    that.setData({
      visible: false
    });
    if (e.type == 'ok') {
      app.func.reqpost('/xcx/order/completeOrder?orderId=' + that.data.orderNo +'&uid=' + wx.getStorageSync('uid'), {}, (res) => {
        if (res.code == 'ok') {
          // $Toast({
          //   content: "成功",
          // })
          wx.navigateTo({
            url: '../order/index?currentTab=' + 3
          })
        } else {
          // $Toast({
          //   content: res.message,
          // });
        }
      })
    }
  },
  haldMsg(){
    var that = this
    that.setData({
      msgShow: false
    })
  },
  // 寄卖
  hanleEitd(e) {
    var item = JSON.stringify(e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '../saleEitd/index?item=' + item,
    })
  },
  // 提货
  hanleGoods(e) {
    var item = JSON.stringify(e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '../goods/index?item=' + item,
    })
  },
  onLoad: function (options) {
   this.list()
    var that = this;
    that.setData({
      currentTab: options.currentTab
    })
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 100;
        that.setData({
          winHeight: calc
        });
      }
    });
  },
  loadMore: function () {
    var that = this
    var pd = that.data.scrollPd;
    console.log(pd)
    //显示加载
    wx.showToast({
      title: '加载中...',
      duration: 100,
      icon: 'loading',
    })
    if (pd == true) {
      //防止多次触发滑动到底部事件
      that.setData({
        scrollPd: false//禁止下拉
      })
      var page = that.data.page;//当前页数

      that.setData({
        page: parseInt(page) + 1,
        showLoadding: true,//显示加载 
      })
      that.list();
    }
  },
  arrayUnique2(arr, name) {
    var hash = {};
    return arr.reduce(function (item, next) {
      hash[next[name]] ? '' : hash[next[name]] = true && item.push(next);
      return item;
    }, []);
  },
  onPullDownRefresh: function () {
    this.list()
    wx.stopPullDownRefresh()
  },
  //滑动切换
  swiperTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
  },
onHide(){},
  //点击切换
  clickTab: function (e) {
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  hanlePay(e){
    var item = JSON.stringify(e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '../payment/index?item=' + item,
    })
  },
  count(num){
    var h = Math.floor(num / 3600) < 10 ? "0" + Math.floor(num / 3600) : Math.floor(num / 3600)
    var min = Math.floor(num / 60) < 10 ? "0" + Math.floor(num / 60) : Math.floor(num / 60)
    var s = Math.floor(num % 60) < 10 ? "0" + Math.floor(num % 60) : Math.floor(num % 60)
    return `${h} : ${min}: ${s}`
  },
})
