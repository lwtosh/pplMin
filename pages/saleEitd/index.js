var app = getApp();
const { $Toast } = require('../../dist/base/index');
Page({

  data: {
    dataInfo:{}
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  pay() {
    var that = this
    if (that.data.inputValue == ''){
      $Toast({
        content:'请填写寄卖价',
      });
    }
    if (that.data.dataInfo.entrustGoodsId  === null ){
      console.log(that.data.dataInfo)
      app.func.reqpost('/xcx/entrustSale/entrustSaleGoods?orderId=' + that.data.dataInfo.id + "&salePrice=" + that.data.inputValue + '&uid=' + wx.getStorageSync('uid'), {}, (res) => {
        if (res.code == 'ok') {
          $Toast({
            content: "寄卖成功",
          });
          setTimeout(function () {
            wx.navigateTo({
              url: '../sale/index'
            })
          }, 500)
        } else {
          $Toast({
            content: res.message,
          });
        }
      })
    }else{
      app.func.reqpost('/xcx/entrustSale/editEntrustSale?id=' + that.data.dataInfo.id + "&salePrice=" + that.data.inputValue + '&uid=' + wx.getStorageSync('uid'), {}, (res) => {
        if (res.code == 'ok') {
          $Toast({
            content: "修改成功",
          });
          setTimeout(function () {
            wx.navigateTo({
              url: '../sale/index'
            })
          }, 500)
        } else {
          $Toast({
            content: res.message,
          });
        }
      })
    }
  },
  onLoad: function (options) {
    var that = this
    that.setData({
      dataInfo: JSON.parse(options.item),
      inputValue: JSON.parse(options.item).salePrice
    });
  },
})