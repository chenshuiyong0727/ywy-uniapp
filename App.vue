<script>
  import { navigateTo, debounce } from './utils/util'
  export default {
    globalData: {
      canMounted: true,
      intervalManager: null,
      screenWidth: 500,
      isToday: true,
      isChangeScreen: false,
      isShowFab: true,
      currentScreenStatus: 'portrait'
    },
    onLaunch: function() {
      // #ifdef APP-PLUS
      // 锁定横屏
      if (this.$pad) {
        plus.screen.lockOrientation("default");
      } else {
        plus.screen.lockOrientation("portrait-primary");
      }
      // #endif
      
      // #ifdef APP-PLUS || H5
      // 预加载页面
      uni.preloadPage({url: '/pages/cognitive-training/guid'})
      uni.preloadPage({url: '/pages/exercise/begin'})
      uni.preloadPage({url: '/pages/exercise/open-service-package'})
      uni.preloadPage({url: '/pages/micromotion/begin'})
      uni.preloadPage({url: '/pages/micromotion/open-service-package'})
      // #endif
      
      this.setGuidStorageCondition()
      // 加载字典
      this.initSysDict()
    },
    onShow() {
      // uni.setStorageSync('hasIndexGuid', true)
      uni.setStorageSync('hasFormGuid', true)
      uni.setStorageSync('hasEvaGuid', true)
      uni.setStorageSync('hasTrainGuid', true)
      uni.setStorageSync('hasTrainGuid2', true)
      
      // #ifdef MP || H5
      uni.onWindowResize((res) => {
        
        this.globalData.isChangeScreen = !this.globalData.isChangeScreen
        this.globalData.screenWidth = res.size.windowWidth
      })
      // #endif
      
    },
    mounted() {
      // #ifdef H5
      window.addEventListener("offline", () => {
        this.$networkTip.showTip()
      })
      window.addEventListener("online", () => {
        this.$networkTip.closeTip()
      })
      // #endif
      
    },
    methods: {
      initSysDict() {
        this.$request({
          url: '/gw/h5/v1/base/sys/dict/listSysDictFront',
          method: 'post'
        }).then(res => {
          if (res.status === 1000) {
            // sysDictList = res.data
            uni.setStorageSync('sysDictList', JSON.stringify(res.data))
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      loginStatus(redirectUrl = '') {
        let userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
        return new Promise((resolve) => {
          if (!userInfo || JSON.stringify(userInfo) == '{}') {
            // 未登录
            uni.navigateTo({
              url: redirectUrl ? '/pages/login/index?redirectUrl='+redirectUrl : '/pages/login/index'
            })
          } else {
            resolve({
              isLogin: true
            })
          }
        })
      },
      setGuidStorageCondition() {
        // 记录首次进入应用的时间
        if (!uni.getStorageSync('enterPageTime')) {
          uni.setStorageSync('enterPageTime', new Date().getTime())
        } else {
          // 已有记录时间，判断时间是否是当天
          this.globalData.isToday = new Date().getTime() - uni.getStorageSync('enterPageTime') < 86400000
          if (!this.globalData.isToday) {
            // 不是今天，刷新缓存
            uni.setStorageSync('enterPageTime', new Date().getTime())
            uni.setStorageSync('hasGuidIndex', false)
          }
        }
      },
      // 跳转研一训练
      goCognitiveTraining: debounce(function(params) {
        this.loginStatus().then(() => {
          if (this.$pad) {
            this.$request({
              url: '/gw/h5/v1/training/plan/getMainUrl',
              method: 'get',
              data: {
                token: params.token,
                orderId: params.payOrderId ? params.payOrderId : '',
              }
            }).then(res => {
              if (res.status === 1000) {
                if (res.data) {
                  let urlParam = {}
                  if (params.redirectUrl) {
                    urlParam.link = `${res.data}&redirectUrl=${params.redirectUrl}`
                  } else {
                    urlParam.link = `${res.data}`
                  }
                  if (params.backType) {
                    urlParam.backType = params.backType
                  }
                  if (params.isNeedLandscape) {
                    urlParam.isNeedLandscape = params.isNeedLandscape ? params.isNeedLandscape : 'yes' 
                  }
                  navigateTo('/pages/web-view/web-view', urlParam)
                } else {
                  uni.showToast({
                    title: '数据返回异常',
                    icon: 'none',
                    duration: 2000
                  })
                }
              } else {
                uni.showToast({
                  title: res.msg,
                  icon: 'none',
                  duration: 2000
                })
              } 
            })
          } else {
            navigateTo('/pages/cognitive-training/can-not-train')
          }
        })
      }, 1000, true),
      // 跳转研一测评(认知障碍筛查)
      goEvalution: debounce(function(params, loading = true) {
        let isMobile = ''
        let type = ''
        // #ifdef H5
        isMobile = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch
        if (isMobile) {
          type = this.$pad ? 'pad' : 'mobile'
        } else {
          type = 'pc'
        }
        // #endif
        // #ifndef H5
        uni.getSystemInfo({
          success: (res) => {
            if (res.model == 'PC') {
              type = 'pc'
            } else {
              if (res.screenWidth > 500) {
                type = 'pad'
              } else {
                type = 'mobile'
              }
            }
          }
        })
        // #endif
        
        this.loginStatus().then(() => {
          this.$request({
            url: '/gw/h5/v1/fastsieve/web',
            method: 'get',
            data: {
              token: params.token,
              type,
              requestType: params.requestType,
              orderid: params.payOrderId
            }
          }, loading).then(res => {
            if (res.status === 1000) {
              if (res.data) {
                // this.isShowPayResult = false
                let urlParam = {
                  link: res.data,
                  isNeedLandscape: 'yes'
                }
                if (params.backType) {
                  urlParam.backType = params.backType
                }
                navigateTo('/pages/web-view/web-view', urlParam)
              } else {
                uni.showToast({
                  title: '数据返回异常',
                  icon: 'none',
                  duration: 2000
                })
              }
              
            } else {
              uni.showToast({
                title: res.msg,
                icon: 'none',
                duration: 2000
              })
            }
          })
        })
      }, 1000, true),
      // 跳转研二认知评估
      goAppointmentDetail(params) {
        getApp().loginStatus().then(() => {
          this.$request({
            url: '/gw/h5/v1/schedule/third/list',
            method: 'get',
            data: {
              token: params.token,
              type: params.type
            }
          }).then(res => {
            if (res.status === 1000) {
              if (res.data) {
                navigateTo('/pages/web-view/web-view', {
                  link: res.data,
                  cameraPermission: params.cameraPermission ? true : false
                })
              } else {
                uni.showToast({
                  title: '数据返回异常',
                  icon: 'none',
                  duration: 2000
                })
              }
              
            } else {
              uni.showToast({
                title: res.msg,
                icon: 'none',
                duration: 2000
              })
            }
          })
        })
      },
      // 跳转研二健康咨询
      goHealthConsulting(params) {
        this.$request({
          url: '/gw/h5/v1/schedule/detail',
          method: 'get',
          data: {
            orderId: params.payOrderId,
            token: params.token,
            type: params.type
          }
        }).then(res => {
          if (res.status === 1000) {
            if (res.data) {
              navigateTo('/pages/web-view/web-view', {
                link: res.data,
                cameraPermission: true
              })
            } else {
              uni.showToast({
                title: '数据返回异常',
                icon: 'none',
                duration: 2000
              })
            }
            
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      watch(method, istr) {
        let obj = this.globalData
        console.log(obj)
        Object.defineProperty(obj, istr, {
          configurable: true,
          enumerable: true,
          set: function(value) {
            this._consumerGoodsStatus = value
            method(value)
          },
          get: function(value) {
            return this._consumerGoodsStatus
          }
        })
      },
      // 第三方token登录
      thirdLoginByToken(token, path) {
        
        let params = {
          thirdToken: token,
          path
        }
        // #ifdef H5
        params.platform = 1
        // #endif
        // #ifdef MP-WEIXIN
        params.platform = 2
        // #endif
        return new Promise((resolve, reject) => {
          this.$request({
            url: '/gw/h5/v1/front/user/loginByThirdToken',
            method: 'post',
            data: params
          }).then((res) => {
            if (res.status === 1000) {
              this.$request({
                url: '/gw/h5/v1/front/user/getUcUser',
                method: 'post',
                data: {
                  token: res.data.token,
                },
              }).then((infoRes) => {
                if (infoRes.status === 1000) {
                  let data = {
                    ...res.data,
                    info: infoRes.data,
                  }
                  uni.setStorageSync('userInfo', JSON.stringify(data))
                  resolve({loginStatus: 1})
                } else {
                  uni.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 2000
                  })
                  reject()
                }
              })
            } else {
              uni.showToast({
                title: res.msg,
                icon: 'none',
                duration: 2000
              })
              reject()
            }
          })
        })
        
      }
    }
  }
</script>

<style lang="scss">
  /*每个页面公共css */
  page {
    background-color: #F3F4F5;
    height: 100%;
  }
  
  /* #ifdef H5 */
  uni-page-head {
    display: none;
  }
  /* #endif */
  uni-checkbox:not([disabled]) .uni-checkbox-input:hover {
    border-color: #d1d1d1;
  }
  uni-checkbox .uni-checkbox-input {
    width: 20rpx !important;
    height: 20rpx;
  }
  uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked {
    color: #fff !important;
    background-color: #43C9A7;
    border-color: #43C9A7 !important;
  }
  ::v-deep uni-toast {
    z-index: 9999 !important;
  }
  
  /* tabbar 样式覆盖 */
  .uni-tabbar {
    .uni-tabbar__bd {
      flex-direction: row;
      height: 51.27rpx !important;
      .uni-tabbar__icon {
        width: 35.16rpx !important;
        height: 35.16rpx !important;
        margin-right: 10rpx;
        margin-top: 0rpx;
      }
      .uni-tabbar__label {
        font-size: 11.72rpx !important;
      }
    }
  }
  .uni-app--showtabbar uni-page-wrapper::after {
    height: 51.27rpx !important;
  }
  @media screen and (max-width: 500px) {
    uni-checkbox .uni-checkbox-input {
      color: #43C9A7 !important;
      width: 30rpx !important;
      height: 30rpx;
    }
    .uni-tabbar {
      .uni-tabbar__bd {
        flex-direction: column;
        height: 100rpx !important;
        .uni-tabbar__icon {
          width: 50rpx !important;
          height: 50rpx !important;
          margin-right: 0rpx;
          margin-top: 5px;
        }
        .uni-tabbar__label {
          font-size: 20rpx !important;
          margin-top: 0 !important;
        }
      }
    }
    .uni-app--showtabbar uni-page-wrapper::after {
      height: 100rpx !important;
    }
  }
  
  @media screen and (min-width: 768px) {
    /* #ifdef MP */
    // .container {
    //   transform: scale(0.65);
    //   transform-origin: top center;
     
    // }
    // page>view:nth-child(1) {
    //   height: 100vh;
    // }
    /* #endif */
  }
</style>
