import { envSetting } from './env.js'
// import { isTokenExpire } from './util.js'

export const myRequest = (options = {}, isShowLoading = true) => {
  // let timeOut = 50
  if (options.data && options.data.token) {
    // 如果请求带token参数，则说明该接口需要登录，则往header中添加portalTokenAuth字段
    options.header = {
      portalTokenAuth: options.data.token
    }
    // let userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
    // let tokenExpireTime = userInfo.tokenExpireTime ? userInfo.tokenExpireTime : new Date()
    // console.log(isTokenExpire(tokenExpireTime))
    // if (isTokenExpire(tokenExpireTime) === 2) {
    //   // 登录过期，跳转登录页面
    //   uni.removeStorageSync('userInfo');
    //   uni.navigateTo({
    //     url: '/pages/login/index'
    //   })
    // } else if (isTokenExpire(tokenExpireTime) === 1 && options.url != '/gw/h5/v1/front/user/token/refresh') {
    //   // 5分钟之后token即将过期
    //   timeOut = 1000
    //   let refreshParam = {
    //     userId: userInfo.userId,
    //     token: userInfo.token,
    //     refreshToken: userInfo.refreshToken
    //   }
    //   uni.request({
    //     url: `${envSetting.baseURL}/gw/h5/v1/front/user/token/refresh`,
    //     method: 'post',
    //     data: refreshParam,
    //     success: (res) => {
    //       if (res.data.code == 1) {
    //         if (res.data.sub_code == 10005) {
    //           // token过期，跳转登录页面
    //           uni.removeStorageSync('userInfo');
    //           uni.navigateTo({
    //             url: '/pages/login/index'
    //           })
    //         } else {
    //           userInfo.token = res.data.data.token
    //           userInfo.tokenExpireTime = res.data.data.tokenExpireTime
    //           userInfo.refreshToken = res.data.data.refreshToken
    //           // 更新用户信息缓存
    //           uni.setStorageSync('userInfo', JSON.stringify(userInfo))
    //           options.header = {
    //             portalTokenAuth: res.data.data.token
    //           }
    //         }
    //       }
    //     }
    //   })
    // }
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
            data: res.data ? res.data.data : null
          }
          resolve(body);
        } else if (res.data.code == 102 || res.data.code == 103 || res.data.code === 800 || res.data.code === 801 || res.data.code === 802) {
          // 登录过期，跳转登录页面
          uni.removeStorageSync('userInfo')
          uni.removeStorageSync('hasGuidIndex')
          uni.removeStorageSync('hasGuidEntry')
          uni.removeStorageSync('sysDictList')
          uni.removeStorageSync('reAppointmentTime')
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
