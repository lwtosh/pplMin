Page({
  data: {
    imgUrl: ['https://img.alicdn.com/imgextra/i3/2838892713/O1CN01yZfE4w1Vub5IlMtlu_!!0-item_pic.jpg_2200x2200Q50s50.jpg_.webp'],
    imgUrl2: ['https://img.alicdn.com/imgextra/i2/2838892713/O1CN01Kvyrwn1Vub0mcnNOj_!!2838892713.jpg_2200x2200Q90s50.jpg_.webp', 'https://img.alicdn.com/imgextra/i3/2838892713/O1CN01DxezuB1Vub1dDSWSr_!!2838892713.jpg_2200x2200Q90s50.jpg_.webp', 'https://img.alicdn.com/imgextra/i1/2838892713/O1CN01sulXcp1Vub1tWmNnR_!!2838892713.jpg_2200x2200Q90s50.jpg_.webp','https://img.alicdn.com/imgextra/i3/2838892713/O1CN01VPy1G71Vub1sbuXTC_!!2838892713.jpg_2200x2200Q90s50.jpg_.webp'],
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
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "Huawei/华为 nova 4"
    })
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onShareAppMessage: function () {

  }
})