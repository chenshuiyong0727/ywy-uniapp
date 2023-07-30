import { envSetting } from './env.js'
// import { isTokenExpire } from './util.js'

export const request = (options = {}, isShowLoading = true) => {
  // let timeOut = 50
  if (uni.getStorageSync('org_token_auth')) {
    // 如果请求带token参数，则说明该接口需要登录，则往header中添加portalTokenAuth字段
    options.header = {
      tokenAuth: uni.getStorageSync('org_token_auth')
    }
  }
  return doRequst(options, isShowLoading)
}
const doRequst = (options, isShowLoading) => {
  return new Promise((resolve, reject) => {
    if (options.data && options.data.token) {
      delete options.data.token
    }
    if (isShowLoading) {
      uni.showLoading({
        title: '数据加载中',
        mask: true
      })
    }
    uni.request({
      url: envSetting.baseURL + options.url,
      method: options.method || 'GET',
      header: options.header,
      data: options.data || {},
      success: (res) => {
        if (res.data.code == 1) {
          const body = {
            status: res.data.sub_code,
            msg: res.data.sub_msg,
            subCode: res.data.sub_code,
            subMsg: res.data.sub_msg,
            data: res.data ? res.data.data : null
          }
          resolve(body);
        } else if (res.data.code == 102 || res.data.code == 103 || res.data.code === 800 || res.data.code === 801 || res.data.code === 802) {
          // 登录过期，跳转登录页面
          uni.clearStorageSync();
          uni.showToast({
            title: '登录过期，即将重新登录',
            icon: 'none'
          })
          setTimeout(() => {
            uni.navigateTo({
              url: '/pages/login/index'
            })
          }, 1000)
        } else {
          return uni.showToast({
            title: '系统访问异常,请联系管理员',
            icon: 'fail'
          });
        }

      },
      fail: (err) => {
        uni.showToast({
          title: '请求接口失败',
          icon: 'fail'
        })
        reject(err)
      },
      complete: () => {
        uni.hideLoading();
      }
    })
  })
}
