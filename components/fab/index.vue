<template>
  <!--#ifndef MP-->
  <view
    :class="[isPad ? 'fab-pad-container' : 'fab-mobile-container', 'fab-container']" 
    @touchstart="touchstart"
    @touchmove.prevent="touchmove"
    @touchend="touchend"
    :style="{left: leftPos, top: topPos}"
  >
  <!--#endif-->
  <!--#ifdef MP-->
  <view
    :class="[isPad ? 'fab-pad-container' : 'fab-mobile-container', 'fab-container']" 
    @touchstart="touchstart"
    @touchmove.stop.prevent="touchmove"
    @touchend.stop.prevent="touchend"
    :style="{left: leftPos, top: topPos}"
  >
  <!--#endif-->
    <view class="content">
      <view :class="[isDirectionDown ? 'down' : 'up', 'content-main']" id="content-main">
        <view class="tx" id="avatar" @click="showMenuHandle($event, 1)">
          <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-guid-tip2.png'"></image>
        </view>
        <view :class="[isExpandFabMenu ? 'show-menu-style' : 'hide-menu-style', 'wrap']" :style="{ height: wrapHeight + 'px', top: operateWrapTop + 'px' }">
          <view class="list">
            <view class="item" v-if="isShowUseGuid" @click="useGuidHandle">
              <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/fab-icon-guid.png'"></image>
              <view>使用引导</view>
            </view>
            <view class="item" v-if="isShowUseHelp" @click="showKfCode">
              <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/fab-icon-kf.png'"></image>
              <view>客服帮助</view>
            </view>
            <view class="item" v-if="isShowBackHome" @click="goBackHome">
              <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/fab-icon-home.png'"></image>
              <view>返回首页</view>
            </view>
            <!-- #ifdef H5 -->
            <view class="item" v-if="isShowDownApp" @click="goDownApp">
              <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/fab-icon-down.png'"></image>
              <view>下载APP</view>
            </view>
            <!-- #endif -->
          </view>
        </view>
        <view :style="{top: openFlagTop + 'px'}" :class="[isExpandFabMenu ? 'angle-bottom' : 'angle-top', 'open-flag']" @click="showMenuHandle($event,2)">
          <text>{{openFlagText}}</text>
        </view>
      </view>
    </view>
    <kf-code v-if="isShowKfCode" @closeKfHandle="closeKfHandle"></kf-code>
  </view>
</template>

<script>
  import kfCode from '@/components/kf-code'
  import { envSetting } from '@/utils/env.js'
  export default {
    components: {
      kfCode
    },
    props: {
      isOpenFabMenu: {
        type: Boolean,
        default: true
      },
      isShowUseGuid: {
        type: Boolean,
        default: false
      },
      isShowUseHelp: {
        type: Boolean,
        default: true
      },
      isShowBackHome: {
        type: Boolean,
        default: true
      },
      isShowDownApp: {
        type: Boolean,
        default: true
      },
      direction: {
        type: String,
        default: 'down'
      }
      
    },
    data() {
      return {
        wrapHeight: 50,
        openFlagText: '关闭',
        isShowKfCode: false,
        isPad: this.$pad,
        imgPrefix: this.$imgPrefix,
        isExpandFabMenu: true,
        startPos: {},
        movePos: {},
        endPos: {},
        leftPos: '90%',
        topPos: this.$pad ? '40%' : '70%',
        operateWrap: {},
        avatarWrap: {},
        systemInfo: {},
        longClick: 0,
        hasTouchMove: false,
        timer: null,
        isDirectionDown: this.$pad ? true : false,
        openFlagTop: 50,
        operateWrapTop: 4,
        isFirstEntry: true
      }
    },
    
    mounted() {
      
        uni.getSystemInfo({
          success: (res) => {
            this.systemInfo = res
            this.initFab()
            console.log('4',this.systemInfo)
          }
        })
        
      
      
      getApp().watch(this.screenChangeHandle, 'isChangeScreen')
    },
    destroyed() {
      console.log('asdfa')
    },
    methods: {
      // 屏幕旋转变化
      screenChangeHandle() {
        
        // this.systemInfo = uni.getSystemInfoSync()
        setTimeout(() => {
          console.log('6', uni.getSystemInfoSync())
          this.systemInfo = uni.getSystemInfoSync()
          if (getApp().globalData.currentScreenStatus != this.systemInfo.deviceOrientation) {
            let element = "#content-main"
            let query = uni.createSelectorQuery().in(this)
            query.select(element).boundingClientRect(data => {
              if (data) {
                this.operateWrap = data
                this.leftPos = `${this.systemInfo.screenWidth - data.width}px`
                this.topPos = this.$pad ? '40%' : '70%'
              }
            }).exec()
            getApp().globalData.currentScreenStatus = this.systemInfo.deviceOrientation
          }
          
          
          
        }, 300)
        
        //[this.systemInfo.screenWidth, this.systemInfo.screenHeight] = [this.systemInfo.screenHeight, this.systemInfo.screenWidth]
        //this.initFab()
        // uni.getSystemInfo({
        //   success: (res) => {
        //     this.systemInfo = res
        
        //   }
        // })
        
        
        // 刷新本页面
        // this.$router.go(0)
      },
      initFab() {
        
        this.isExpandFabMenu = this.isOpenFabMenu
        this.isDirectionDown = this.direction == 'down' ? true : false
        if (this.isExpandFabMenu) {
          this.openFlagText = '关闭'
          this.setHeight()
        } else {
          this.openFlagText = '展开'
        }
        this.systemInfo = uni.getSystemInfoSync()
        let element = "#content-main"
        
        let query = uni.createSelectorQuery().in(this)
        query.select(element).boundingClientRect(data => {
          if (data) {
            console.log('asdfasdfas', data)
            this.operateWrap = data
            this.operateWrap.height = data.height ? data.height : data.width
            this.leftPos = `${this.systemInfo.screenWidth - data.width}px`
            this.topPos = this.$pad ? '40%' : '70%'
          }
        }).exec()
        let query2 = uni.createSelectorQuery().in(this)
        let element2 = "#avatar"
        query2.select(element2).boundingClientRect(data => {
          if (data) {
            this.avatarWrap = data
            if (this.isDirectionDown) {
              // this.openFlagTop = data.height
            }
            
          }
        }).exec()
      },
      setHeight() {
        let element = ".list"
        let query = uni.createSelectorQuery().in(this)
        
        query.select(element).boundingClientRect(data => {
          if (data) {
            this.wrapHeight = data.height
            this.operateWrap.height = this.wrapHeight + 70
            if (this.isDirectionDown) {
              this.openFlagTop = data.height
              this.operateWrapTop = 4
            } else {
              this.operateWrapTop = `-${data.height - 50}`
            }
          }
        }).exec()
      },
      showMenuHandle(e, type) {
        this.isExpandFabMenu = !this.isExpandFabMenu
        if (this.isExpandFabMenu) {
          this.setHeight()
          this.openFlagText = '关闭'
        } else {
          this.wrapHeight = 50
          this.openFlagText = '展开'
          this.operateWrap.height = this.wrapHeight + 70
          
          if (type == 1) {
            if (e.detail.y + 40 + this.avatarWrap.height >= this.systemInfo.windowHeight / 2 + 200) {
              this.isDirectionDown = false
            } else {
              this.isDirectionDown = true
            }
          }
          
          if (this.isDirectionDown) {
            this.openFlagTop = this.wrapHeight
            this.operateWrapTop = 4
          } else {
            this.openFlagTop = 50
            this.operateWrapTop = 4
          }
        }
        
        
        // this.$nextTick(() => {
        //   this.operateWrap.height = this.wrapHeight + 70
        //   // let element = "#content-main"
        //   // let query = uni.createSelectorQuery().in(this)
        //   // this.systemInfo = uni.getSystemInfoSync()
        //   // query.select(element).boundingClientRect(data => {
        //   //   if (data) {
        //   //     this.operateWrap = data
        //   //     this.leftPos = `${this.systemInfo.screenWidth - data.width}px`
        //   //   }
        //   // }).exec()
        // })
        
      },
      showKfCode() {
        this.isShowKfCode = true
      },
      closeKfHandle() {
        this.isShowKfCode = false
      },
      goBackHome() {
        uni.switchTab({
          url: '/pages/index/index'
        })
      },
      useGuidHandle() {
        this.$emit('useGuidHandle')
      },
      goDownApp() {
        // #ifdef H5
        window.location.href = envSetting.downAppLink
        // #endif
      },
      touchstart(e) {
        this.longClick = 0
        
        if (this.isFirstEntry && this.isExpandFabMenu) {
          this.setHeight()
          this.isFirstEntry = false
        }
        this.timer = setTimeout(() => {
          this.longClick = 1
          this.startPos.x = e.touches[0].clientX
          this.startPos.y = e.touches[0].clientY
        }, 300)
      },
      touchmove(e) {
        // H5禁止滚动
        if (this.systemInfo.uniPlatform == 'web') {
          // var mo = function(e) {
          //   e.preventDefault()
          // }
          document.body.style.overflow = 'hidden'
          //document.addEventListener("touchmove", mo, { passive: false }) //禁止页面滑动
        }
        this.hasTouchMove = true
        this.longClick = 1
        this.movePos.x = e.touches[0].clientX
        this.movePos.y = e.touches[0].clientY
        if (this.movePos.x + this.operateWrap.width / 2 >= this.systemInfo.screenWidth) {
           this.leftPos = `${this.systemInfo.screenWidth - this.operateWrap.width}px`
        } else if (this.movePos.x - this.operateWrap.width / 2 <= 0) {
           this.leftPos = 0
        } else {
          this.leftPos = `${this.movePos.x - this.avatarWrap.width / 2}px`
        }
        
        if (this.movePos.y - this.operateWrap.height / 2 <= 120) {
          if (this.isDirectionDown) {
            this.topPos = `${120}px`
          } else {
            this.topPos = `${140}px`
          }
          
        } else if (this.movePos.y + this.operateWrap.height - this.operateWrap.height/2 > this.systemInfo.windowHeight) {
          if (this.isDirectionDown) {
            this.topPos = `${this.systemInfo.windowHeight - this.operateWrap.height - 20}px`
          } else {
            this.topPos = `${this.systemInfo.windowHeight - this.avatarWrap.height - 20}px`
          }
          
        } else {
          this.topPos = `${this.movePos.y - this.avatarWrap.height / 2}px`
        }
      },
      touchend(e) {
        clearTimeout(this.timer)
        if (this.longClick == 1 && this.hasTouchMove) {
          this.endPos.x = e.changedTouches[0].clientX
          this.endPos.y = e.changedTouches[0].clientY
          if (this.endPos.x >= this.systemInfo.screenWidth / 2) {
            this.leftPos = `${this.systemInfo.screenWidth - this.avatarWrap.width}px`
          } else {
            this.leftPos = 0
          }
          if (this.endPos.y - this.operateWrap.height / 2 <= 120) {
            if (this.isDirectionDown) {
              this.topPos = `${120}px`
            } else {
              this.topPos = `${140}px`
            }
          } else if (this.movePos.y + this.operateWrap.height - this.operateWrap.height/2 > this.systemInfo.windowHeight) {
            if (this.isDirectionDown) {
              this.topPos = `${this.systemInfo.windowHeight - this.operateWrap.height - 20}px`
            } else {
              this.topPos = `${this.systemInfo.windowHeight - this.avatarWrap.height - 20}px`
            }
          } else {
            this.topPos =  `${this.endPos.y - this.avatarWrap.height / 2 - 20}px`
          }
          
          if (!this.isExpandFabMenu) {
            if (this.movePos.y + 40 + this.avatarWrap.height >= this.systemInfo.windowHeight / 2 + 200) {
              this.isDirectionDown = false
            } else {
              this.isDirectionDown = true
            }
          }
          
          this.hasTouchMove = false
          this.longClick = 0
          this.timer = null
        }
        if (this.systemInfo.uniPlatform == 'web') {
          // var mo = function(e) {
          //   e.preventDefault()
          // };
          document.body.style.overflow = '' //出现滚动条
          // document.removeEventListener("touchmove", mo, { passive: false })
        }
      }
    }
  }
</script>


<style scoped lang="scss">
  .fab-container {
    width: 73.26rpx;
    position: fixed;
    
    right: 180rpx;
    z-index: 12;
    //transition: all 0.1s;
    .content {
      .content-main {
        width: 100%;
        // padding-top: 30rpx;
        position: relative;
        .tx {
          width: 73.26rpx;
          height: 73.26rpx;
          border-radius: 50%;
          background-color: rgba(190, 217, 255, 0.35);
          position: absolute;
          
          z-index: 2;
          
          image {
            width: 73.26rpx;
            height: 100.37rpx;
            margin-top: -26rpx;
          }
        }
        .wrap {
          background-color: #fff;
          border-radius: 36.63rpx;
          overflow: hidden;
          transition: all 0.2s;
          width: 100%;
          position: absolute;
          top: 2px;
        }
        .list {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          
          
          .item {
            font-size: 16rpx;
            color: #5D80B0;
            text-align: center;
            font-weight: bold;
            padding: 8.79rpx 0;
            border-bottom: 0.73rpx solid #EAF3FF;
            image {
              width: 29.3rpx;
              height: 29.3rpx;
              display: block;
              margin: 0 auto;
            }
          }
          .item:last-child {
            border-bottom: none;
          }
        }
        .open-flag {
          
          width: 54.95rpx;
          height: 20.51rpx;
          line-height: 23rpx;
          border: 1px solid #0D72FF;
          border-radius: 13rpx;
          font-size: 14rpx;
          color: #0D72FF;
          padding-left: 5.86rpx;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          background-color: #fff;
          z-index: 3;
          transition: top 0.2s;
          &::after {
            content: '';
            width: 0;
            height: 0;
            border-right: 7.33rpx solid transparent;
            border-left: 7.33rpx solid transparent;
            position: absolute;
            right: 7.33rpx;
            top: 50%;
            transform: translateY(-50%);
          }
        }
        .angle-top {
          &::after {
            border-top: 7.33rpx solid #0D72FF;
          }
        }
        .angle-bottom {
          margin-top: 10rpx;
          &::after {
            border-bottom: 7.33rpx solid #0D72FF;
          }
        }
      }
      .down {
        .list {
          padding: 84.98rpx 0 17.58rpx 0;
        }
      }
      .up {
        .list {
          padding: 17.58rpx 0 84.98rpx 0;
        }
      }
    }
  }
  .fab-pad-container {
    // top: 146.52rpx;
    .content {
      .content-main {
        .tx {
          // top: 28rpx;
        }
      }
    }
  }
  
  // @media screen and (min-width: 501px) and (max-width: 801px) {
  //   .fab-pad-container {
  //     top: 40%;
  //     right: 0;
  //   }
  // }
  // @media screen and (min-width: 601px) and (max-width: 768px) {
  //   .fab-pad-container {
  //     bottom: 200rpx;
  //     right: 0;
  //   }
  // }
  // @media screen and (min-width: 801px) { 
  //   .fab-pad-container {
  //     top: 146.52rpx;
  //     right: 160rpx;
  //   }
  // }
  // @media screen and (min-width: 1024px) {
  //   .fab-pad-container {
  //     top: 146.52rpx;
  //     right: 180rpx;
  //   }
  // }
  @media screen and (max-width: 500px) {
    .fab-container {
      width: 112rpx;
      right: 0rpx;
      .content {
        .content-main {
          // padding-top: 40rpx;
          .tx {
            width: 112rpx;
            height: 112rpx;
            margin-bottom: 0rpx;
            
            image {
              width: 112rpx;
              height: 152rpx;
              margin-top: -40rpx;
            }
          }
          .wrap {
            border-radius: 56rpx;
            
          }
          .show-menu-style {
            // margin-top: 20rpx;
            opacity: 1;
          }
          .hide-menu-style {
            // margin-top: 24rpx;
            opacity: 0;
          }
          .list {
            
            .item {
              font-size: 22rpx;
              padding: 15rpx 0;
              border-bottom: 1rpx solid #EAF3FF;
              image {
                width: 40rpx;
                height: 40rpx;
              }
            }
            .item:last-child {
              padding-bottom: 0;
            }
            .item:first-child {
              padding-top: 5rpx;
            }
          }
          .open-flag {
            margin: -12rpx auto 0 auto;
            width: 88rpx;
            height: 32rpx;
            line-height: 32rpx;
            border-radius: 16rpx;
            font-size: 24rpx;
            padding-left: 12rpx;
            &::after {
              border-right: 10rpx solid transparent;
              border-left: 10rpx solid transparent;
              right: 15rpx;
            }
          }
          .angle-top {
            &::after {
              border-top: 10rpx solid #0D72FF;
            }
          }
          .angle-bottom {
            // margin-top: 15rpx;
            &::after {
              border-bottom: 10rpx solid #0D72FF;
            }
          }
        }
        .down {
          .list {
            padding: 120rpx 0 28rpx 0;
          }
          .angle-top {
            top: 112rpx;
          }
        }
        .up {
          .list {
            padding: 28rpx 0 150rpx 0;
          }
        }
      }
    }
    .fab-mobile-container {
      top: 38%;
      .content {
        .content-main {
          .tx {
            // top: 60rpx;
          }
        }
      }
    }
  }
</style>