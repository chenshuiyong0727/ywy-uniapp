<template>
  <view>
   
    <nav-bar title='认知症数字疗法'></nav-bar>
 
    <view class="container">
      <block v-if="isPad">
        <image class="img-1" :src="imgPrefix + '/static/operateSteps/cognitive-new-training-1.png?t=1'"></image>
        <image class="img-2" :src="imgPrefix + '/static/operateSteps/cognitive-new-training-2.png?t=1'"></image>
        <image class="img-3" :src="imgPrefix + '/static/operateSteps/cognitive-new-training-3.png?t=1'"></image>
        <image class="img-4" :src="imgPrefix + '/static/operateSteps/cognitive-new-training-4.png?t=1'"></image>
        <image class="img-5" :src="imgPrefix + '/static/operateSteps/cognitive-new-training-5.png?t=1'"></image>
        <image class="img-6" :src="imgPrefix + '/static/operateSteps/cognitive-new-training-6.png?t=1'"></image>
        <image class="img-7" :src="imgPrefix + '/static/operateSteps/cognitive-new-training-7.png?t=1'"></image>
        <image class="img-8" :src="imgPrefix + '/static/operateSteps/cognitive-new-training-8.png?t=1'"></image>
        <image class="img-9" :src="imgPrefix + '/static/operateSteps/cognitive-new-training-9.png?t=1'"></image>
      </block>
      <block v-else>
        <image class="img-1" :src="imgPrefix + '/static/operateSteps/mobile-cognitive-new-training-1.png?t=1'"></image>
        <image class="img-2" :src="imgPrefix + '/static/operateSteps/mobile-cognitive-new-training-2.png?t=1'"></image>
        <image class="img-3" :src="imgPrefix + '/static/operateSteps/mobile-cognitive-new-training-3.png?t=1'"></image>
        <image class="img-4" :src="imgPrefix + '/static/operateSteps/mobile-cognitive-new-training-4.png?t=1'"></image>
        <image class="img-5" :src="imgPrefix + '/static/operateSteps/mobile-cognitive-new-training-5.png?t=1'"></image>
        <image class="img-6" :src="imgPrefix + '/static/operateSteps/mobile-cognitive-new-training-6.png?t=1'"></image>
        <image class="img-7" :src="imgPrefix + '/static/operateSteps/mobile-cognitive-new-training-7.png?t=1'"></image>
        <image class="img-8" :src="imgPrefix + '/static/operateSteps/mobile-cognitive-new-training-8.png?t=1'"></image>
        <image class="img-9" :src="imgPrefix + '/static/operateSteps/mobile-cognitive-new-training-9.png?t=1'"></image>
        
      </block>
      <view class="bottom" v-if="showBtm=='true'">
        <view class="kf" @click="showKfCode">
          <image src="../../static/images/applet/icon_kefu.png"></image>
          <view>客服咨询</view>
        </view>
        <view class="btm-right">
          <view class="btn-buy" @click="goToPage">立即训练</view>
        </view>
      </view>
    </view>
    <kf-code v-if="isShowKfCode" @closeKfHandle="closeKfHandle"></kf-code>
    <!--侧边栏-->
    <fab v-if="isShowFab" :isOpenFabMenu="isPad ? true : false"></fab>
    <!--end 侧边栏-->
  </view>
</template>

<script>
  import fab from '@/components/fab'
  import navBar from '@/components/nav-bar'
  import { navigateTo } from '@/utils/util'
  import kfCode from '@/components/kf-code'
  import {mixin} from '@/mixin/mixin'
  export default {
    mixins:[mixin],
    components: {
      navBar,
      kfCode,
      fab
    },
    data() {
      return {
        userInfo: {},
        imgPrefix: this.$imgPrefix,
        isPad: this.$pad,
        isShowKfCode: false,
        showBtm: 'true',
        pageFrom: ''
      }
    },
    onLoad(options) {
      this.showBtm = options.showBtm ? options.showBtm : 'true'
      this.pageFrom = options.pageFrom ? options.pageFrom : ''
    },
    mounted() {
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
    },
    methods: {
      goToPage() {
        // navigateTo('/pages/cognitive-training/no-recommendation')
        getApp().loginStatus().then(() => {
          if (this.pageFrom == 'index') {
            this.$request({
              url: '/gw/h5/v1/front/goods/recommendFlag',
              method: 'post',
              data: {
                userId: this.userInfo.userId,
                token: this.userInfo.token
              }
            }, false).then(res => {
              if (res.status === 1000) {
                if (res.data == 1) {
                  // 训练有推荐
                  navigateTo('/pages/cognitive-training/recommend')
                } else {
                  navigateTo('/pages/cognitive-training/no-recommendation')
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
            navigateTo('/pages/cognitive-training/no-recommendation')
          }
        })
      },
      showKfCode() {
        this.isShowKfCode = true
      },
      closeKfHandle() {
        this.isShowKfCode = false
      },
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    width: 750.02rpx;
    max-width: 750.02rpx;
    overflow: hidden;
    margin: 0 auto;
    padding-bottom: 51rpx;
    image {
      width: 750.02rpx;
      display: block;
    }
    .img-1 {
      height: 307.69rpx;
    }
    .img-2 {
      height: 250.55rpx;
    }
    .img-3 {
      height: 358.24rpx;
    }
    .img-4 {
      height: 260.81rpx;
    }
    .img-5 {
      height: 180.95rpx;
    }
    .img-6 {
      height: 545.05rpx;
    }
    .img-7 {
      height: 289.38rpx;
    }
    .img-8 {
      height: 479.85rpx;
    }
    .img-9 {
      height: 339.93rpx;
    }
  }
  .bottom {
    width: 750.18rpx;
    height: 64.45rpx;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    bottom: 0;
    left: 50%;
    margin-left: -375.09rpx;
  
    .kf {
      margin-left: 10rpx;
  
      image {
        width: 32.23rpx;
        height: 32.23rpx;
        margin: 0 auto;
        display: block;
      }
  
      &>view {
        font-size: 11.72rpx;
        color: #5796F8;
      }
    }
  
    .btm-right {
      .btn-buy {
        width: 622.71rpx;
        height: 55.68rpx;
        background-color: #43C9A7;
        text-align: center;
        line-height: 55.68rpx;
        color: #fff;
        font-size: 21.98rpx;
        font-weight: bold;
        display: block;
        border-radius: 7.33rpx;
        margin-right: 29.3rpx;
      }
    }
  }
  @media screen and (max-width: 500px) {
    .container {
      width: 750rpx;
      max-width: 750rpx;
      padding-bottom: 130rpx;
      image {
        width: 750rpx;
      }
      .img-1 {
        height: 1224rpx;
      }
      .img-2 {
        height: 928rpx;
      }
      .img-3 {
        height: 942rpx;
      }
      .img-4 {
        height: 820rpx;
      }
      .img-5 {
        height: 442rpx;
      }
      .img-6 {
        height: 1306rpx;
      }
      .img-7 {
        height: 486rpx;
        
      }
      .img-8 {
        height: 892rpx;
        
      }
      .img-9 {
        height: 872rpx;
        
      }
    }
    .bottom {
      height:116rpx;
      .kf {
        margin-left: 16rpx;
        image {
          width: 60rpx;
          height: 60rpx;
        }
    
        &>view {
          font-size: 22rpx;
        }
      }
    
      .btm-right {
        .btn-buy {
          width: 490rpx;
          height: 92rpx;
          background-color: #43C9A7;
          text-align: center;
          line-height: 92rpx;
          color: #fff;
          font-size: 34rpx;
          font-weight: bold;
          display: block;
          border-radius: 12rpx;
          margin-right: 120rpx;
        }
      }
    }
  }
</style>