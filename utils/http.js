
var api_base_url = 'https://ppl-api-test.ppljg66.com'
export default function ({ url, data = {}, method = 'GET' }) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: api_base_url + url,
      method: method,
      data: data,
      header: {
        'content-type': 'application/json', // 默认值
        'uid': wx.getStorageSync('uid'),
        'token': wx.getStorageSync('token'),
        'loginChannel': 'WEB'
      },
      success: (res) => {
      },
      fail: (err) => {
      }
    })
  })
}