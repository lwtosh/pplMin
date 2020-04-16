//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    // logs: []
  },
  onLoad: function () {
    var h = Math.floor(2333 / 3600) < 10 ? "0" + Math.floor(2333 / 3600) : Math.floor(2333 / 3600)
    var min = Math.floor(2333 / 60) < 10 ? "0" + Math.floor(2333 / 60) : Math.floor(2333 / 60)
    var s = Math.floor(2333 % 60) < 10 ? "0" + Math.floor(2333 % 60) : Math.floor(2333 % 60)
    // Math.floor(min / 3600) + ":" + Math.floor(min / 60) + ":" + min % 60
    console.log(h + min + s)
    // var second = Math.floor(micro_second / 1000); 

    // var hr = Math.floor(second / 3600); 

    // var min = Math.floor((second - hr * 3600) / 60); 
    // var micro_sec = Math.floor((micro_second % 1000) / 10); return hr + ":" + min + ":" + sec;
  },
  //继续瓜分红包
  btn3() {
    wx.redirectTo({
      url: '../../pages/home/index'
    })
  },
})
