var app = getApp();
const { $Toast } = require('../../dist/base/index');
Page({
  data: {
    fruit: [{
      id: 2,
      name: '提货',
    }, {
      id: 3,
        name: '托管'
    }],
    fruit2: [{
      id: 1,
      name: '余额(当前余额￥4500.25)',
    }],
    addresssInfo: {},
    addressInfo:{},
    dataInfo:{},
    auctionLineId:"",
    animal: '提货',
    animal2: '托管',
    checked: false,
    checked2: false,
    visible1: false,
    visible3: false,
    visible4: false,
    msgShow: false,
    msgShow1: false,
    valuec:'',
    is:''
  },
  handleFruitChange({ detail = {} }) {
    this.setData({
      current: detail.value
    });
  },
  handleFruitChange2(e){
    this.setData({
      checked2: e.detail.current
    });
  },
  handleChange(){
    wx.navigateTo({
      url: '../add/index'
    })
  },
  address(){
    var that = this
      app.func.reqget('/xcx/user/fetchUserDefaultAddress', { 'uid': wx.getStorageSync('uid') }, (res) => {
        if (res.code == 'ok') {
          that.setData({
            addresssInfo: res.data
          })
        }
      })
     
    app.func.reqget('/xcx/account/getAccountByUid', { 'uid': wx.getStorageSync('uid') }, (res) => {
      that.setData({
        lePoint: res.data.lePoint,
        money: res.data.money
      })
    })
    
    if (that.options.name == "le"){
      app.func.reqget('/xcx/lpmall/fetchLpLineById', { 'auctionLineId': that.options.auctionLineId }, (res) => {
        that.setData({
          dataInfo: res.data,
        })
      })
    }
    if (that.options.name == "quan") {
      wx.setNavigationBarTitle({
        title: "确认付款"
      })
      app.func.reqget('/xcx/account/getUserEquityByUid', { 'uid': wx.getStorageSync('uid') }, (res) => {
        that.setData({
          equity: res.data.equity,
        })
      })
      app.func.reqget('/xcx/equityMall/fetchEquityGoodsDetail', { 'id': that.options.auctionLineId }, (res) => {
        that.setData({
          dataInfo: res.data,
        })
      })
    }
    if (that.options.name == "ji") {
      wx.setNavigationBarTitle({
        title: "确认付款"
      })
      app.func.reqget('/xcx/entrustSale/fetchEntrustSaleDetail', { 'id': that.options.auctionLineId }, (res) => {
        that.setData({
          dataInfo: res.data,
        })
      })
    }
  },
  // 乐点
  pay(){
    var that = this
    if (that.data.addresssInfo == ''){
      $Toast({
        content: '你还没有填地址哦~',
      });
    } else if (that.data.current == undefined) {
      $Toast({
        content: '你还没有选择提货还是兑换~',
      });
    }else {
      if (that.data.current == '提货'){
        that.setData({
          visible1: true
        });
      }else{
        that.setData({
          msgShow: true
        });
      }
      
    }
  },
  haldMsg(){
    this.setData({
      msgShow: false
    });
    this.setData({
      msgShow1: false
    });
  },
  handleClose1(e) {
    var that = this
    that.setData({
      visible1: false
    });
    if (e.type == 'ok'){
      app.func.reqpost('/xcx/lpmall/cashLpLine?auctionLineId=' + that.data.auctionLineId + '&addressId=' + (that.data.item == undefined ? that.data.addresssInfo.id : that.data.item.id) + '&status=' + (that.data.current == '托管'? 3 : 2) + '&uid=' + wx.getStorageSync('uid'),{}, (res) => {
        if (res.code == 'ok') {
          wx.navigateTo({
            url: '../pay/index'
          })
        } else {
          $Toast({
            content: res.message,
          });
        }
      })
    }
  },
  checkboxChange: function (e) {
    this.setData({
      valuec: e.detail.value
    })
  },
  btnAgement(e){
    var that = this
    if (that.data.valuec == ""){
      $Toast({
        content: "请阅读并同意《用户托管协议》",
      });
    }else{
      that.setData({
        visible1: true
      });
      if (e.type == 'ok') {
        app.func.reqpost('/xcx/lpmall/cashLpLine?auctionLineId=' + that.data.auctionLineId + '&addressId=' + (that.data.item == undefined ? that.data.addresssInfo.id : that.data.item.id) + '&status=' + 3 + '&uid=' + wx.getStorageSync('uid'), {}, (res) => {
          if (res.code == 'ok') {
            wx.navigateTo({
              url: '../pay/index'
            })
          } else {
            $Toast({
              content: res.message,
            });
          }
        })
      }
    }
  },
  // 权益值
  pay2() {
    var that = this
    if (that.data.addresssInfo == '') {
      $Toast({
        content: '你还没有填地址哦~',
      });
    } else if (that.data.checked2 == false && that.data.dataInfo.money > 0){
      $Toast({
        content: '请选择支付方式',
      });
    } else  {
      that.setData({
        visible3: true
      });
    }
  },
  handleClose2(e) {
    var that = this
    that.setData({
      visible3: false
    });
    if (e.type == 'ok') {
      app.func.reqpost('/xcx/equityMall/createEquityOrder?id=' + that.data.auctionLineId + '&addressId=' + (that.data.item == undefined ? that.data.addresssInfo.id : that.data.item.id )+ '&uid=' + wx.getStorageSync('uid'), {}, (res) => {
        if (res.code == 'ok') {
          that.setData({
            orderNo: res.data.id
          });
          setTimeout(function () {
            app.func.reqpost('/xcx/order/payOrder?orderId=' + that.data.orderNo + '&addressId=' + (that.data.item == undefined ? that.data.addresssInfo.id : that.data.item.id) + '&payMethod=' + "BALANCE" + '&status=' + 3 + '&uid=' + wx.getStorageSync('uid'), {}, (res) => {
              if (res.code == 'ok') {
                $Toast({
                  content: "支付成功",
                });
                wx.navigateTo({
                  url: '../pays/index'
                })
              } else {
                $Toast({
                  content: res.message,
                });
              }
            })
          }, 1000)
        }else{
          $Toast({
            content: res.message,
          });
        }
      })
     
      
    }
  },
  // 寄卖
  pay3(){
    var that = this
    if (that.data.addresssInfo == '') {
      $Toast({
        content: '你还没有填地址哦~',
      });
    } else if (that.data.checked2 == false) {
      $Toast({
        content: '请选择支付方式',
      });
    } else {
      
      app.func.reqpost('/xcx/entrustSale/createEntrustSaleOrder?id=' + that.data.dataInfo.id + '&addressId=' + (that.data.item == undefined ? that.data.addresssInfo.id : that.data.item.id) + '&uid=' + wx.getStorageSync('uid'), {}, (res) => {
        if (res.code == 'ok') {
          that.setData({
            orderid: res.data.orderNo,
            orderId1: res.data.id
          });
          that.setData({
            msgShow1: true
          });
        } else if (res.code == 'M72'){
          $Toast({
            content: "该商品已售出",
          });
        }else {
          $Toast({
            content: res.message,
          });
        }
      })
    }
  },
  payment() {
    var that = this
    app.func.reqpost('/xcx/order/payOrder?orderId=' + that.data.orderId1 + '&addressId=' + (that.data.item == undefined ? that.data.addresssInfo.id : that.data.item.id) + '&payMethod=' + "BALANCE" + '&status=' + 0 + '&uid=' + wx.getStorageSync('uid'), {}, (res) => {
      if (res.code == 'ok') {
        wx.navigateTo({
          url: '../pays/index'
        })
      } else {
        $Toast({
          content: res.message,
        });
      }
    })
  },
  onLoad: function (options) {
    var that = this
    that.setData({
      is: options.name,
      auctionLineId: options.auctionLineId
    });
    that.address()
    wx.hideShareMenu()
  },
  onShow: function (e) {
   var that = this
    var item = JSON.parse(that.data.item)
   that.setData({
     item: item
   })
    console.log(this.data.item)
  },
})