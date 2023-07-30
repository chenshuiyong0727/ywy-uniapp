// 支付方法
const yjpay = (obj, success, fail) => {
  let baseurl = "https://yjpay.yj-health.com/dev";
  uni.requestPayment({
    provider: 'wxpay',

    "timeStamp": obj.timeStamp,
    "package": obj.package,
    "paySign": obj.paySign,
    "appId": obj.appId,
    "signType": obj.signType,
    "nonceStr": obj.nonceStr,
    'success': function(res) {
      console.log('asdfasdf')
      uni.request({
        url: baseurl + "/api/pay/queryPayOrderCar",
        data: {
          tn: obj.payTn
        },
        header: {
          'Accept': 'application/json',
          'content-type': 'application/json',
          'ReqSource': 'weapp',
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function(e) {
          if (e && e.data.entity) {
            let body = {
              wxMsg: res,
              payOrderId: e.data.entity.payOrderId ? e.data.entity.payOrderId : "",
              mchOrderNo: e.data.entity.mchOrderNo ? e.data.entity.mchOrderNo : "",
              status: e.data.entity.status ? e.data.entity.status : ""
            }
            success(body);
          } else {
            let body = {
              wxMsg: res,
              payOrderId: "",
              mchOrderNo: "",
              status: ""
            }
            success(body);
          }
        },
        fail: function(e) {
          console.log('fail', e);
          fail(e);
        },
      })


    },
    'fail': function(res) {
      uni.request({
        url: baseurl + "/api/pay/queryPayOrderCar",
        data: {
          tn: obj.payTn
        },
        header: {
          'Accept': 'application/json',
          'content-type': 'application/json',
          'ReqSource': 'weapp',
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function(e) {
          if (e && e.data.entity) {
            let body = {
              wxMsg: res,
              payOrderId: e.data.entity.payOrderId ? e.data.entity.payOrderId : "",
              mchOrderNo: e.data.entity.mchOrderNo ? e.data.entity.mchOrderNo : "",
              status: e.data.entity.status ? e.data.entity.status : ""
            }
            fail(body);
          } else {
            let body = {
              wxMsg: res,
              payOrderId: "",
              mchOrderNo: "",
              status: ""
            }
            fail(body);
          }
        },
        fail: function(e) {
          console.log('fail', e);
          fail(e);
        },
      })
    }
  })

}

module.exports = {
  yjpay: yjpay,

}
