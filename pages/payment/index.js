var app = getApp();
const {
  $Toast
} = require('../../dist/base/index');
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
    dataInfo: {},
    auctionLineId: "",
    animal: '提货',
    animal2: '托管',
    checked: false,
    checked2: false,
    visible1: false,
    visible3: false,
    visible4: false,
    msgShow: false,
    msgShow1: false,
    valuec: '',
    is: ''
  },
  handleFruitChange({
    detail = {}
  }) {
    this.setData({
      current: detail.value
    });
  },
  handleFruitChange2(e) {
    this.setData({
      checked: e.detail.current
    });
  },
  agement() {
    var that = this
    if (that.data.valuec == "") {
      $Toast({
        content: "请阅读并同意《用户托管协议》",
      });
    } else {
      that.setData({
        msgShow1: true
      })
    }
  },
  address() {
    var that = this
    if (that.data.dataInfo.addressId == undefined) {
      app.func.reqget('/xcx/user/fetchUserDefaultAddress', {
        'uid': wx.getStorageSync('uid')
      }, (res) => {
        if (res.code == 'ok') {
          that.setData({
            addresssInfo: res.data
          })
        }
      })
    } else {
      that.setData({
        addresssInfo: that.data.dataInfo
      })
    }
    app.func.reqget('/xcx/account/getAccountByUid', {
      'uid': wx.getStorageSync('uid')
    }, (res) => {
      that.setData({
        money: res.data.money
      })
    })
  },
  // 乐点
  pay() {
    var that = this
    if (that.data.addresssInfo == '') {
      $Toast({
        content: '你还没有填地址哦~',
      });
    } else if (that.data.current == undefined) {
      $Toast({
        content: '你还没有选择提货还是兑换~',
      });
    } else if (that.data.checked == false) {
      $Toast({
        content: '你还没有选择支付方式~',
      })
    } else {
      if (that.data.current == '提货') {
        that.setData({
          msgShow1: true
        });
      } else {
        that.setData({
          msgShow: true
        });
      }

    }
  },
  haldMsg() {
    this.setData({
      msgShow: false
    });
    this.setData({
      msgShow1: false
    });
  },
  payment() {
    var that = this
    if (that.data.current == '托管') {
      if (that.data.valuec == "") {
        $Toast({
          content: "请阅读并同意《用户托管协议》",
        });
      }
        app.func.reqpost('/xcx/order/payOrder?orderId=' + that.data.dataInfo.id + '&addressId=' + (that.data.item == undefined ? that.data.addresssInfo.id : that.data.item.id) + '&payMethod=' + "BALANCE" + '&status=' + 3 + '&uid=' + wx.getStorageSync('uid'), {}, (res) => {
          if (res.code == 'ok') {
            $Toast({
              content: "托管成功",
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
    } else {
      app.func.reqpost('/xcx/order/payOrder?orderId=' + that.data.dataInfo.id + '&addressId=' + (that.data.item1 == undefined ? that.data.addresssInfo.addressId : that.data.item1.id) + '&payMethod=' + "BALANCE" + '&status=' + 2 + '&uid=' + wx.getStorageSync('uid'), {}, (res) => {
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
  }

},
checkboxChange: function(e) {
  this.setData({
    valuec: e.detail.value
  })
},
hanleChange() {
  wx.navigateTo({
    url: '../add/index'
  })
},
onLoad: function(options) {
  var that = this
  that.setData({
    dataInfo: JSON.parse(options.item)
  });
  console.log(JSON.parse(options.item))
  that.address()
},
onPullDownRefresh: function() {
  this.address()
  wx.stopPullDownRefresh()
},
onShow: function(e) {
  var that = this
  var item = JSON.parse(that.data.item)
  that.setData({
    item1: item
  });
},
})