//index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseGoods: {},
    startDate: "",
    endDate: "",
    orderList: [], //订单列表

    //假数据
    dataList:

    {
      "count": 2, //总页数 
      "list": [{
          "goods": [{
            "number": 1,
            "flowers": [{
              "flower_name": "花花"
            }],
            "order_good_id": "0e96b13e39ea49bcbce6c5ccee32ab4e",
            "good_id": "1585b32f67e04106b4c685dcec1aa556",
            "order_id": "5892d23092ec48b5976e80c71031f788",
            "good": {
              "good_display_img": "../../image/zhutu.jpg",
              "good_name": "小明",
              "good_price": 10,
            }
          }],
          "order_id": "5892d23092ec48b5976e80c71031f788",
          "totalprice": 120.00
        },
        {
          "goods": [{
              "number": 1,
              "flowers": [{
                "flower_name": "蓝"
              }],
              "order_good_id": "0caf434a5d1147838263c0fbcefcc2ef",
              "good_id": "b7b698cd4bde4e20915177de4367e75e",
              "order_id": "f3e4652572cb4ac59e29e53e3bbfb33f",
              "good": {
                "good_display_img": "../../image/zhutu.jpg",
                "good_price": 10,
                "good_name": "小炮",
              }
            },
            {
              "number": 1,
              "flowers": [{
                "flower_name": "ee"
              }],
              "order_good_id": "753313f00c6247a2982b654b3de97bd0",
              "good_id": "1585b32f67e04106b4c685dcec1aa556",
              "order_id": "f3e4652572cb4ac59e29e53e3bbfb33f",
              "good": {
                "good_display_img": "../../image/zhutu.jpg",
                "good_name": "小明",
                "good_price": 20,
              }
            },
            {
              "number": 1,
              "flowers": [{
                "flower_name": "绿"
              }],
              "order_good_id": "797ecaf6ec0241a1bce5b21443faff21",
              "good_id": "c32d93ea90f34ad2b458d3e5f2a9152f",
              "order_id": "f3e4652572cb4ac59e29e53e3bbfb33f",
              "good": {

                "good_display_img": "../../image/zhutu.jpg",
                "good_name": "德莱文",
                "good_price": 20,

              }
            }
          ],
          "order_id": "f3e4652572cb4ac59e29e53e3bbfb33f",
          "totalprice": 120.00
        },
        {
          "goods": [{
              "number": 3,
              "flowers": [{
                "flower_name": "绿"
              }],
              "order_good_id": "358f6615483a440fa4c00001664aac1c",
              "good_id": "c32d93ea90f34ad2b458d3e5f2a9152f",
              "order_id": "01448473609247f894e2de4215124262",
              "good": {
                "good_display_img": "../../image/zhutu.jpg",
                "good_price": 20,
                "good_name": "德莱文",
              }
            },
            {
              "number": 1,
              "flowers": [{
                "flower_name": "花花"
              }],
              "order_good_id": "adf0d5d5c7bd480e9b26f21e7e869a45",
              "good_id": "1585b32f67e04106b4c685dcec1aa556",
              "order_id": "01448473609247f894e2de4215124262",
              "good": {
                "good_display_img": "../../image/zhutu.jpg",
                "good_price": 20,
                "good_name": "小明",
              }
            }
          ],
          "order_id": "01448473609247f894e2de4215124262",
          "totalprice": 120.00
        }
      ]
    },

    resultShow: false, //显示列表
    orderCon: 0, //0表示商品 1表示用户
    conId: '', //传过来的id

    windowHeight: '', //屏幕高度 

    scrollPd: false, //是否可滑动
    scrollTop: 0, //设置srcoll-view距离顶部位置
    top: 0, //当前滑块位置
    page: 1, //当前页数
    row: 3, //一页数量

    showLoadding: false, //显示加载
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

    //获得屏幕高度
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      },
    })

    //动画
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: "ease",
      delay: 0
    })
    animation.translateY(5).step();
    this.setData({
      animationData: animation.export()
    })


    wx.setNavigationBarTitle({
      title: '商品订单记录'
    })

    //行数 死数据、只有3行
    var row = that.data.row;

    //获得数据 默认第一页
    that.queryOrdersByGood(1, row)


  },


  /**
   * 操作数据
   * 
   * 由于是死数据，page只为判断是否还有下一页
   */
  queryOrdersByGood: function(page, row) {
    var that = this;

    var dataList = that.data.dataList; //假数据
    var count = dataList.count; //总页数
    var myList = dataList.list; //列

    that.setData({
      orderList: myList.concat(that.data.orderList), //拼接列表
      resultShow: true, //显示数据
      showLoadding: false, //去除加载提示
      page: page, //存储当前页数，为是否有下一页做判断

    })

    //判断是否还有数据   当前页小于总页数则可以下拉加载数据       
    if (parseInt(count) > parseInt(that.data.page)) {
      that.setData({
        scrollPd: true, //显示滑块、允许下拉
      })
    }
  },

  /**
   * 加载更多 下一页 
   * */
  loadMore: function() {
    var that = this;
    var thatData = this.data;
    var pd = thatData.scrollPd; //是否加载数据，true则加载

    //显示加载
    wx.showToast({
      title: '加载中...',
      duration: 100,
      icon: 'loading',
    })

    if (pd) {
      //防止多次触发滑动到底部事件
      that.setData({
        scrollPd: false //禁止下拉
      })

      var page = thatData.page; //当前页数
      var row = thatData.row; //数量
      var pageAdd = parseInt(page) + 1; //下一页

      that.setData({
        showLoadding: true, //显示加载 
      })

      that.queryOrdersByGood(pageAdd, row);

    }


  },
  /**
   * 滑动事件
   * */
  scroll: function(e) {
    var that = this;
    that.setData({
      top: e.detail.scrollTop
    })
  },
})