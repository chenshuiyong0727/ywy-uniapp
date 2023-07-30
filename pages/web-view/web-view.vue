<template>
  <view class="web-view-wrap">
    <web-view 
      :class="{'web-view': true, 'isActive': isActiveMethods()}" v-if="url"
			:src="url" 
			allow="geolocation; microphone; camera; midi; encrypted-media;" 
			@message="getMsg">
		</web-view>
    
    <cover-view class="cover-view" v-if="isShowMaskTip">
      <cover-view class="cover-view-content">
        <cover-view class="cover-view-tip">为了更好的体验，请将设备横屏展示</cover-view>
        <cover-view class="cover-view-btn" @click="closeMaskTip">知道了</cover-view>
      </cover-view>
      
    </cover-view>
  </view>

</template>

<script>
  // #ifdef APP-PLUS
  import { envSetting } from '@/utils/env.js'
  // #endif
  export default {
    data() {
      return {
				resizeSign: '', // resize监听
        url: '',
        isNeedLandscape: 'no', // 默认跳转到第三方页面需要横屏展示 'no' => 不需要
        backType: '' ,// 回退类型 1=>默认回退上一级 2=>认知障碍筛查结果回退 3=>数字疗法(无推荐) 4=>数字疗法(有推荐) 5=>数字疗法(我的页面)
        isShowMaskTip: false,
        cameraPermission: false // 是否需要相机权限
      }
    },
    onLoad() {
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.on('preLoad', (data) => {
        this.url = `${data.link}`
        this.backType = data.backType
        this.isNeedLandscape = data.isNeedLandscape ? data.isNeedLandscape : ''
        this.cameraPermission = data.cameraPermission ? data.cameraPermission : false
        uni.setStorageSync('gameUrl', data.link)
        uni.setStorageSync('backType', data.backType)
        uni.setStorageSync('isNeedLandscape', data.isNeedLandscape)
        // #ifdef APP-PLUS
        
        setTimeout(() => {
          let pages = getCurrentPages()
          let page = pages[pages.length - 1]
          let currentWebview = page.$getAppWebview()
          let wv = currentWebview.children()[0]
          const { windowHeight, statusBarHeight, safeAreaInsets } = uni.getSystemInfoSync()
          // 防止H5页面与app顶部状态栏重合
          wv.setStyle({top: statusBarHeight, height: windowHeight - statusBarHeight - safeAreaInsets.bottom }) 
          
          if (this.$pad) {
            // pad设备强制横屏安卓(延迟是为了防止横竖屏切换时，对其他页面造成样式混乱)
            if (this.isNeedLandscape == 'yes') {
              plus.screen.lockOrientation('landscape-primary')
            } else if (this.isNeedLandscape == 'no') {
              // 锁定竖屏
              plus.screen.lockOrientation('portrait-primary')
            }
            setTimeout(() => {
              const { windowHeight, statusBarHeight, safeAreaInsets } = uni.getSystemInfoSync()
              wv.setStyle({height: windowHeight - statusBarHeight - safeAreaInsets.bottom }) 
            }, 500);
          }
          if (!this.$pad) {
            wv.overrideUrlLoading({ mode: "reject", match: ".*"+envSetting.domainName+".*"}, (e)=>{
              console.log(e.url.split('/pages')[1],'overrideUrlLoading');
              uni.redirectTo({
                url: `/pages${e.url.split('/pages')[1]}`
              })
            })
          }
          
          wv.addEventListener('hide',function(e) {
            // native.goback()
            uni.navigateBack({
              delta: 1
            })
          }, false)

        }, 1000)
        
        if (this.cameraPermission) {
          plus.android.requestPermissions(['android.permission.CAMERA', 'android.permission.RECORD_AUDIO'], (e) => {
            if (e.deniedAlways.length > 0) {  
              // 弹出提示框，引导用户打开设置页面开启  
              uni.showToast({
                title: '权限被永久拒绝' + e.deniedAlways.toString(),
                icon: 'none',
                duration: 2000
              })
            }  
            if (e.deniedPresent.length > 0) {  
              // 弹出提示框解释为何需要权限，可再次调用plus.android.requestPermissions申请权限  
              uni.showToast({
                title: '权限被临时拒绝' + e.deniedPresent.toString(),
                icon: 'none',
                duration: 2000
              })
            }  
            if (e.granted.length > 0) { 
              console.log('权限被允许'+e.granted.toString());  
            }  
          }, (e) => {  
            uni.showToast({
              title: 'Request Permissions error:'+JSON.stringify(e),
              icon: 'none',
              duration: 2000
            })
          })
        }
        // #endif
      })
    },
    mounted() {
			//this.resizeMethods()
      this.url = this.url ? this.url : uni.getStorageSync('gameUrl')
      this.backType = this.backType ? this.backType : uni.getStorageSync('backType')
      this.isNeedLandscape = this.isNeedLandscape ? this.isNeedLandscape : uni.getStorageSync('isNeedLandscape')
      
      // #ifdef H5 || MP-WEIXIN
      uni.getSystemInfo({
        success: (res) => {
          if (this.$pad && this.isNeedLandscape == 'yes' && res.windowWidth / res.windowHeight < 1) {
            // 横竖屏比例小于1，竖屏
            this.isShowMaskTip = true
          } else {
            this.isShowMaskTip = false
          }
        }
      })
      
      uni.onWindowResize((res) => {
        if (res.size.windowWidth / res.size.windowHeight > 1) {
          this.isShowMaskTip = false
        }
      })
      // #endif
      // #ifdef H5
      setTimeout(() => {
        if (!this.url) {
          uni.switchTab({
            url: '/pages/index/index'
          })
        }
      }, 1000)
      // #endif
      
    },
    created() {
      // #ifdef H5
      window.addEventListener('message', this.getMsg)
      // #endif
      
    },
    beforeDestroy() {
      // #ifdef H5
      // window.removeEventListener('resize', this.resizeSign)
      window.removeEventListener('message', this.getMsg)
      // #endif
      uni.removeStorageSync('gameUrl');
    },
    destroyed() {
      // #ifdef APP-PLUS
      // 组件销毁时锁定竖屏
      if (this.isNeedLandscape) {
        if (this.$pad) {
          // plus.screen.lockOrientation("landscape-primary");
          plus.screen.lockOrientation("default");
        } else {
          plus.screen.lockOrientation("portrait-primary");
        }
      }
      // #endif
    },
    methods: {
      closeMaskTip() {
        this.isShowMaskTip = false
      },
			isActiveMethods () {
				return this.url.includes('activity/transfer/')
			},
      getMsg(e) {
        console.log('message11',e)
        let isBack = ''
        let hasUrl = ''
        let resultType = ''
        let payOrderId = ''
        // #ifdef H5
        if (e.data.data && e.data.data.arg.message) {
          isBack = e.data.data && e.data.data.arg.message
          resultType = e.data.data.arg.resultType
          payOrderId = e.data.data.arg.payorderid
        }
        if (e.data.data && e.data.data.arg.url) {
          hasUrl = e.data.data && e.data.data.arg.url
        }
        // #endif
        // #ifdef APP-PLUS
        
        if (e.detail.data && e.detail.data[0].message) {
          isBack = e.detail.data && e.detail.data[0].message
          resultType = e.detail.data && e.detail.data[0].resultType
          payOrderId = e.detail.data[0].payorderid
        }
        if (e.detail.data && e.detail.data[0].url) {
          hasUrl= e.data.data && e.detail.data[0].url
        }
        
        // #endif
        if (isBack === 'goTrian') {
          uni.redirectTo({
            url: '/pages/cognitive-training/recommend?specailBack=1&isRefresh=true'
          })
        } else if (isBack === 'kuaishaiEnd') {
          // 快筛答题结束
          uni.redirectTo({
            url: '/pages/evaluation/lock-report?payOrderId='+payOrderId
          })
          
        } else if (hasUrl) {
          const pages = getCurrentPages()
          console.log(pages)
          uni.redirectTo({
            url: `/${hasUrl}?backdelta=2&specailBack=1`
          })
        } else if (isBack === 'goBack') {
          if (this.backType == 2) {
            // N表示认知正常，CI表示疑似认知功能障碍，为空表示没做完
            
            if (resultType == 'N') {
              uni.redirectTo({
                url: '/pages/evaluation/health-guid?backdelta=3&specailBack=1'
              })
            } else if (resultType == 'CI') {
              uni.redirectTo({
                url: '/pages/cognitive-training/recommend?specailBack=1&isRefresh=true'
              })
            } else {
              uni.redirectTo({
                url: '/pages/evaluation/quick-sieve-record?backdelta=2'
              })
            }
          } else if (this.backType == 3) {
            uni.redirectTo({
              url: '/pages/cognitive-training/no-recommendation?specailBack=1&isRefresh=true'
            })
          } else if (this.backType == 4) {
            uni.redirectTo({
              url: '/pages/cognitive-training/recommend?specailBack=1&isRefresh=true'
            })
          } else if (this.backType == 5) {
            uni.switchTab({
              url: '/pages/my/index'
            })
          } else {
            const pages = getCurrentPages()
            if (pages.length === 1) { //如果只有一个调用原生js
              history.back()
            } else {
              let prevPage = pages[pages.length -2] 
              if(typeof prevPage.$vm.getGoodsList === 'function') {
                prevPage.$vm.getGoodsList() 
              }
              
              uni.navigateBack({
                delta: 1
              })
            }
          }
        }
        if (e.data.data && e.data.data.documentTitle) {
          uni.setNavigationBarTitle({
            title: e.data.data.documentTitle
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .web-view-wrap {
    width: 100%;
    height: 100%;
  }
  .web-view {
		width: 100%;
		height: 100%;
    overflow: hidden;
		position: fixed;
		left: 0;
		top: 0;
  }
  .cover-view {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 99;
    display: flex;
    justify-content: center;
    align-items: center;
    .cover-view-content {
      color: #fff;
      .cover-view-tip {
        font-size: 24.91rpx;
        font-weight: bold;
      }
      .cover-view-btn {
        width: 271.06rpx;
        height: 67.4rpx;
        border-radius: 7.33rpx;
        text-align: center;
        line-height: 67.4rpx;
        font-size: 21.98rpx;
        color: #558EFF;
        border: 1px solid #558EFF;
        border-radius: 32.97rpx;
        margin: 73.26rpx auto 0 auto;
      }
    }
  }
</style>
<style lang="scss">
	// 暂时为了解决顶栏消失时候的问题
  .web-view.isActive {
		web-view{
			height: 120%;
		}
  }
</style>