const mqtt = require('../../utils/mqtt.js');
Page({
  data: {
    imgUrl: [
      '../../asset/p1.png',
      "../../asset/shijian.png",
      "../../asset/xinxi.png"
    ],
    scrollTop: '500',
    t1: "",
    dang: '',
    getbeUid: '',
    isBaoji: false,
    isBaoji2: false,
    isActive: false,
    status: false,
    hh: true,
    status2: false,
    status: false,
    messageTime: '',
    isTime: false,
    hide: false,
    nickname: '',
    newDate: [],
    bidPrice: '',
    uid: '',
    avatar: '',
    listArray: [],
    dataList: {},
    dataList2: {},
    wechat: [],
    boxArray: [],
    chatNo: '',
    fromList: [],
    toView: "",
    height: '425px',
    array: [],
    array1: [],
    reconnectCounts: 0,
    //MQTT连接的配置
    options: {
      protocolVersion: 4,
      clean: true,
      reconnectPeriod: 500, //1000毫秒，两次重新连接之间的间隔
      connectTimeout: 500, //1000毫秒，两次重新连接之间的间隔
      resubscribe: true, //如果连接断开并重新连接，则会再次自动订阅已订阅的主题（默认true）
      cleanSession: true,
      clientId: '',
      password: '',
      username: '',
    }
  },
  onShow() {
  },
  onLoad: function(options) {
    this.bid(options)
  },
  bid: function(options) {
    var that = this
    // 进入房间获取配置
    wx.request({
      url: 'https://ppl-api-test.ppljg66.com/xcx/auction/enterAuctionRoom',
      data: {
        roundRuleId: options.bigSceneId ? options.bigSceneId : wx.getStorageSync('bigSceneId'),
        password: ''
      },
      header: {
        'uid': wx.getStorageSync('uid'),
        'token': wx.getStorageSync('token'),
        'loginChannel': 'WEB',
        'content-type': 'application/x-www-form-urlencoded', // 默认值
      },
      method: "post",
      success: function(res) {
        if (res.data.code == 'B19') {
          wx.clearStorageSync()
          wx.redirectTo({
            url: '../../pages/index/index',
          })
        }
        that.setData({
          dataList: res.data.data,
          password: res.data.data.password,
          username: res.data.data.userName,
          chatNo: res.data.data.chatNo,
          clientId: res.data.data.clientId,
          roundId: res.data.data.roundId,
        })
        // 进入竞拍记录
        wx.request({
          url: 'https://ppl-api-test.ppljg66.com/xcx/auction/fetchRoundBidPriceRecords',
          data: {
            roundId: that.data.roundId,
            limit: 30
          },
          header: {
            'uid': wx.getStorageSync('uid'),
            'token': wx.getStorageSync('token'),
            'loginChannel': 'WEB',
            'content-type': 'application/x-www-form-urlencoded', // 默认值
          },
          method: "get",
          success: function(res) {
            that.setData({
              listArray: res.data.data.content.reverse(),
            })
          }
        })
      }
    })
    //获取房间详情内容
    wx.request({
      url: 'https://ppl-api-test.ppljg66.com/xcx/auction/fetchLatestByRoundRule',
      data: {},
      header: {
        'uid': wx.getStorageSync('uid'),
        'token': wx.getStorageSync('token'),
        'loginChannel': 'WEB',
        'content-type': 'application/x-www-form-urlencoded', // 默认值
      },
      data: {
        roundRuleId: options.bigSceneId ? options.bigSceneId : wx.getStorageSync('bigSceneId'),
      },
      method: "get",
      success: function(res) {
        that.setData({
          dataList2: res.data.data,
          getbeUid: wx.getStorageSync("uid"),
          wechat: {
            type: 'AUCTION_BID',
            bigSceneId: options.bigSceneId,
            goodsName: res.data.data.goods.goodsName
          },
        })
        var wechat = JSON.stringify(that.data.wechat)
        that.setData({
          wechat: wechat
        })
        if (that.data.dataList2) {
          setTimeout(function() {
            that.initSocket()
          }, 1000)
        }
        if (that.data.dataList2.status == 8) {
          setTimeout(function() {
            that.bid({
              bigSceneId: wx.getStorageSync("bigSceneId"),
              password: ''
            })
          }, 1000)
        }
        if (that.data.dataList2.nextOperTime == '-1') {
          that.setData({
            hide: true
          })
        }
        wx.setNavigationBarTitle({
          title: options.bigSceneId + '  ' + that.data.dataList2.goods.goodsName
        })
      }
    })
    if (that.data.dataList) {
      that.setData({
        isActive: true
      })
    }
  },
  launchAppError(e) {
    if (e.type = "error") {
      wx.navigateTo({
        url: '../money/index'
      })
    }
  },
  initSocket: function() {
    var that = this
    //小程序中只能用wxs://开头
    var url = 'wss://wss.ppljg66.com/mqtt'; //替换自己的请求地址
    var client = mqtt.connect(url, that.data.options);
    client.on('connect', function() {
      //订阅
      console.log('auction/' + that.data.chatNo)
      client.subscribe('auction/' + that.data.chatNo);
    })
    client.on('message', function(topic, payload) {
      var payload = JSON.parse([payload].join(": "))
      that.setData({
        fromList: that.arrayUnique2(that.data.fromList.concat(payload), 'messageId')
      })
      //  聊天和出价
      if ((payload.type === 'AUCTION_CHAT' || payload.type === 'AUCTION_PRICE_SUCCESS' ) && payload.data.roundId == that.data.roundId) {
        that.setData({
          array: that.arrayUnique2(that.data.array.concat(payload), 'messageId')
        })
      }
      //  出价
      if (payload.type === 'AUCTION_PRICE_SUCCESS') {
        that.setData({
          array1: that.data.array1.concat(payload),
          hide: false
        })
        //  暴击
        if (that.data.array1[that.data.array1.length - 1].data.crit == 2) {
          setTimeout(function() {
            that.setData({
              isBaoji: false
            })
          }, 4000)
          that.setData({
            isBaoji: true
          })
        }
        if (that.data.array1[that.data.array1.length - 1].data.crit == 4) {
          setTimeout(function() {
            that.setData({
              isBaoji2: false
            })
          }, 4000)
          that.setData({
            isBaoji2: true
          })
        }
      }
      if (payload.type == 'AUCTION_SET_COMPERE') {
        that.setData({ 
          avatar: payload.data.setedUser.avatarUrl
        })
      }
      // 竞拍结束
      for (var i = 0; i < that.data.fromList.length; i++) {
       
        if (that.data.fromList[i].type == 'AUCTION_END') {
          wx.request({
            url: 'https://ppl-api-test.ppljg66.com/xcx/auction/fetchLatestByRoundRule',
            data: {},
            header: {
              'uid': wx.getStorageSync('uid'),
              'token': wx.getStorageSync('token'),
              'loginChannel': 'WEB',
              'content-type': 'application/x-www-form-urlencoded', // 默认值
            },
            data: {
              roundRuleId:  wx.getStorageSync('bigSceneId'),
            },
            method: "get",
            success: function (res) {
              that.setData({
                dataList2: res.data.data,
                getbeUid: wx.getStorageSync("uid"),
                wechat: {
                  type: 'AUCTION_BID',
                  bigSceneId: wx.getStorageSync('bigSceneId'),
                  goodsName: res.data.data.goods.goodsName
                },
              })
              var wechat = JSON.stringify(that.data.wechat)
              that.setData({
                wechat: wechat
              })
              // if (that.data.dataList2) {
              //   setTimeout(function () {
              //     that.initSocket()
              //   }, 500)
              // }
              if (that.data.dataList2.status == 8) {
                setTimeout(function () {
                  that.bid({
                    bigSceneId: wx.getStorageSync("bigSceneId"),
                    password: ''
                  })
                }, 1000)
              }
              if (that.data.dataList2.nextOperTime == '-1') {
                that.setData({
                  hide: true
                })
              }
              wx.setNavigationBarTitle({
                title: wx.getStorageSync('bigSceneId') + '  ' + that.data.dataList2.goods.goodsName
              })
            }
          })
        }
        if (that.data.fromList[i].type == 'AUCTION_END' && that.data.fromList[i].data.flow == false || (that.data.dataList2.status === 7 && that.data.dataList2.endStatus === 2)) {
          that.setData({
            newDate: {
              type: 'AUCTION_PRICE_SUCCESS1',
              status: true,
              bidPrice: that.data.fromList[i].data.bidPrice,
              messageId:11111,
              roundId: that.data.fromList[i].data.roundId,
              nickname: that.data.fromList[i].data.bidUser.nickname,
              uid: that.data.fromList[i].data.bidUser.uid
            }
          })
          that.setData({
            array: that.arrayUnique2(that.data.array.concat(that.data.newDate),'messageId')
          })
        }
        if (that.data.fromList[i].type == 'AUCTION_END' && that.data.fromList[i].data.flow == true|| (that.data.dataList2.status === 7 && that.data.dataList2.endStatus === 2)) {
          var newDate = []
          that.setData({
            newDate: {
              type: 'AUCTION_PRICE_SUCCESS',
              status2: true,
              bidPrice: that.data.fromList[i].data.bidPrice,
              nickname: that.data.fromList[i].data.bidUser.nickname,
              uid: that.data.fromList[i].data.bidUser.uid
            }
          })
          that.setData({
            array: that.arrayUnique2(that.data.array.concat(that.data.newDate), 'messageId')
          })
        }
      }
      that.setData({
        toView: 'msg-' + (that.data.array.length - 1)
      })
    })
  },
  arrayUnique2(arr, name) {
    var hash = {};
    return arr.reduce(function(item, next) {
      hash[next[name]] ? '' : hash[next[name]] = true && item.push(next);
      return item;
    }, []);
  }
})