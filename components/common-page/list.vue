<template>
  <view>
   
    <nav-bar :title='title' backUrl="/pages/index/index"></nav-bar>
   
    <view :class="[serviceMsg.status != 1 ? 'padding-btm' : '' ,'container']">
      <view class="swith-tab">
        <view :class="currentIndex == 0 ? 'on' : ''" @click="setCurr(0)">今日{{pageType == 1 ? '锻炼' : '跟练'}}</view>
        <view :class="currentIndex == 1 ? 'on' : ''" @click="setCurr(1)">全部{{pageType == 1 ? '锻炼' : '跟练'}}</view>
      </view>
      <swiper class="swiper" :duration="200" :current="currentIndex" @change="changeSwiper" :style="{ height: swiperHeight + 'px' }">
        <swiper-item>
        	<view class="swiper-item" id="content-wrap0">
            <view :class="[serviceMsg.status == 0 ? '' : 'top-margin-btm' ,'top']">
              <image class="img-1" :src="imgPrefix + '/static/operateSteps/portalH5/pages/recommend-img-2.png'"></image>
              <view class="left">
                <view>今日{{pageType == 1 ? '锻炼' : '健脑运动'}}已开放 坚持锻炼效果更佳</view>
                <view v-if="serviceMsg.status != 1 && isPad">解锁全部{{pageType == 1 ? '锻炼' : '健脑运动'}} 保持大脑年轻态</view>
              </view>
              <block v-if="isPad">
                <view class="btn-vip" @click="openServicePackage" v-if="serviceMsg.status != 1">全部解锁</view>
                <view v-else class="vip-msg">
                  <view>
                    <image :src="pageType == 1 ? imgPrefix + '/static/operateSteps/portalH5/pages/icon-vip-3.png' : imgPrefix + '/static/operateSteps/portalH5/pages/icon-vip-1.png'"></image>
                    <view>{{pageType == 1 ? '趣味健脑' : '健脑运动'}}服务包</view>
                  </view>
                  <view>服务包有效期至{{serviceMsg.expireDate}}</view>
                </view>
              </block>
            </view>
            <view v-if="!isPad && serviceMsg.status == 1" class="mobile-vip-msg">
              <view>
                <image :src="pageType == 1 ? imgPrefix + '/static/operateSteps/portalH5/pages/icon-vip-3.png' : imgPrefix + '/static/operateSteps/portalH5/pages/icon-vip-1.png'"></image>
                <view>{{pageType == 1 ? '趣味健脑' : '健脑运动'}}服务包</view>
              </view>
              <view>服务包有效期至{{serviceMsg.expireDate}}</view>
            </view>
            <view class="vip-tip" v-if="serviceMsg.status == 0">温馨提示: 服务包已过期，开通服务包立即解锁随时练</view>
            <slot name="today"></slot>
          </view>
        </swiper-item>
        <swiper-item>
        	<view class="swiper-item" id="content-wrap1">
            <view :class="[serviceMsg.status == 0 ? '' : 'top-margin-btm' ,'top']">
              <image class="img-1" :src="imgPrefix + '/static/operateSteps/portalH5/pages/recommend-img-2.png'"></image>
              <view class="left">
                <view>解锁全部{{pageType == 1 ? '锻炼项' : '健脑运动'}}，每日锻炼，保持大脑年轻态</view>
              </view>
              <block v-if="isPad">
                <view class="btn-vip" @click="openServicePackage" v-if="serviceMsg.status != 1">全部解锁</view>
                <view v-else class="vip-msg">
                  <view>
                    <image :src="pageType == 1 ? imgPrefix + '/static/operateSteps/portalH5/pages/icon-vip-3.png' : imgPrefix + '/static/operateSteps/portalH5/pages/icon-vip-1.png'"></image>
                    <view>{{pageType == 1 ? '趣味健脑' : '健脑运动'}}服务包</view>
                  </view>
                  <view>服务包有效期至{{serviceMsg.expireDate}}</view>
                </view>
              </block>
            </view>
            <view v-if="!isPad && serviceMsg.status == 1" class="mobile-vip-msg">
              <view>
                <image :src="pageType == 1 ? imgPrefix + '/static/operateSteps/portalH5/pages/icon-vip-3.png' : imgPrefix + '/static/operateSteps/portalH5/pages/icon-vip-1.png'"></image>
                <view>{{pageType == 1 ? '趣味健脑' : '健脑运动'}}服务包</view>
              </view>
              <view>服务包有效期至{{serviceMsg.expireDate}}</view>
            </view>
            <view class="vip-tip" v-if="serviceMsg.status == 0">温馨提示: 服务包已过期，开通服务包立即解锁随时练</view>
            <slot name="all"></slot>
          </view>
        </swiper-item>
      </swiper>
      <slot name="fab"></slot>
    </view>
    
    <!--移动端 解锁全部按钮-->
    <view class="unlock-vip" v-if="!isPad && serviceMsg.status != 1">
      <view>解锁全部锻炼，保持大脑年轻态</view>
      <view class="btn-unlock" @click="openServicePackage">全部解锁</view>
    </view>
    <!--end-->
    <view class="pop-box" v-if="isShowPop">
      <view class="pop-content">
        <view class="title">恭喜获得{{popVo.dateNum}}天服务包</view>
        <view class="sub-title">有效期至{{popVo.expireDate}}</view>
        <view class="list">
          <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-pop-2.png'"></image>
          <text>专属客服服务</text>
        </view>
        <view class="list">
          <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-pop-3.png'"></image>
          <text>每日个性推荐</text>
        </view>
        <view class="list">
          <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-pop-1.png'"></image>
          <text>解锁全部服务</text>
        </view>
        <view class="btn-close" @click="closePopHandle">确定</view>
      </view>
      
    </view>
    
  </view>
</template>

<script>
  
  import { navigateTo } from '../../utils/util.js'
  import navBar from '@/components/nav-bar'
  
  export default {
    components: {
      navBar
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      pageType: {
        type: Number,
        default: 1 // 1=>趣味锻炼 2=>健脑运动
      }
    },
    data() {
      return {
        currentIndex: 0,
        //滑块的高度(单位px)
        swiperHeight: 550,
        serviceMsg: {},
        discountMsg: {},
        userInfo: {},
        isShowPop: false,
        popVo: {},
        isPad: this.$pad,
        isWechat: this.$isWechat,
        imgPrefix: this.$imgPrefix
      }
    },
    mounted() {
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
      this.getServiceMsg()
      this.getGivenPopVo()
    },
    methods: {
      setCurr(index) {
        this.currentIndex = index
        // this.$emit('getSwiperDataHanlde', index)
      },
      changeSwiper(e) {
        this.currentIndex = e.detail.current
        this.$emit('getSwiperDataHanlde', this.currentIndex)
        //动态设置swiper的高度，使用nextTick延时设置
        this.$nextTick(() => {
          this.setSwiperHeight()
        })
      },
      //动态设置swiper的高度
      setSwiperHeight() {
        let element = "#content-wrap" + this.currentIndex
        let query = uni.createSelectorQuery().in(this)
        query.select(element).boundingClientRect(data => {
          if (data) {
            this.swiperHeight = data.height
          }
        }).exec()
      },
      getServiceMsg() {
        this.$request({
          url: '/gw/h5/v1/front/ucServicePack/getUcServicePack',
          method: 'get',
          data: {
            token: this.userInfo.token,
            recordType: this.pageType
          }
        }, false).then(res => {
          if (res.status === 1000) {
            this.serviceMsg = res.data ? res.data : {}
          }
        })
      },
      openServicePackage() {
        if (this.pageType == 1) {
          navigateTo('/pages/exercise/open-service-package')
        } else {
          navigateTo('/pages/micromotion/open-service-package')
        }
      },
      getGivenPopVo() {
        this.$request({
          url: '/gw/h5/v1/front/ucServicePack/getGivenPopVo',
          data: {
            token: this.userInfo.token,
            recordType: this.pageType
          }
        }, false).then(res => {
          if (res.status === 1000) {
            this.popVo = res.data ? res.data : {}
            this.isShowPop = res.data ? res.data.isPop : false
          }
        })
      },
      closePopHandle() {
        this.isShowPop = false
      },
      
    }
  }
</script>
<style lang="scss" scoped>
  .container {
    width: 750.02rpx;
    max-width: 750.02rpx;
    box-sizing: border-box;
    font-size: 14.65rpx;
    overflow: hidden;
    margin: 0 auto;
    color: #333;
    padding: 21.97rpx 11.72rpx;
    .swith-tab {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16.12rpx;
      color: #999;
      margin-bottom: 27.83rpx;
      &>view {
        padding-bottom: 5.86rpx;
        margin-right: 29.3rpx;
      }
      &>view.on {
        font-size: 17.58rpx;
        color: #502459;
        border-bottom: 2.2rpx solid #502459;
        font-weight: bold;
      }
    }
    .top {
      border-radius: 14.65rpx;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      padding: 9.52rpx 12.45rpx 14.65rpx 63.72rpx;
      .img-1 {
        width: 58.6rpx;
        height: 80.57rpx;
        position: absolute;
        left: 0;
        bottom: 0;
      }
      .left {
        &>view:nth-child(1) {
          font-size: 17.58rpx;
          padding-bottom: 7.32rpx;
        }
        &>view:nth-child(2) {
          font-size: 13.18rpx;
          color: #999;
        }
      }
      .btn-vip {
        border-radius: 7.32rpx;
        width: 163.33rpx;
        height: 45.41rpx;
        background-color: #502459;
        color: #fff;
        text-align: center;
        line-height: 45.41rpx;
      }
      .vip-msg {
        font-size: 13.18rpx;
        &>view:nth-child(1) {
          display: flex;
          align-items: center;
          image {
            width: 27.83rpx;
            height: 27.83rpx;
            margin-right: 7.32rpx;
          }
          view {
            font-size: 17.58rpx;
            font-weight: bold;
          }
        }
        &>view:nth-child(2) {
          font-size: 13.18rpx;
          padding-top: 8.79rpx;
        }
      }
    }
    .top-margin-btm {
      margin-bottom: 17.58rpx;
    }
    .vip-tip {
      height: 51.27rpx;
      background-color: #FFF0F0;
      text-align: center;
      padding-top: 26.37rpx;
      box-sizing: border-box;
      margin-top: -19.78rpx;
      margin-bottom: 17.58rpx;
      color: #E70000;
    }
    .mobile-vip-msg {
      height: 88rpx;
      border: 1px solid #BAC9DB;
      border-radius: 20rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20rpx;
      box-sizing: border-box;
      background-color: #fff;
      font-size: 24rpx;
      color: #666;
      margin-bottom: 20rpx;
      &>view:nth-child(1) {
        font-size: 32rpx;
        color: #4E6C90;
        font-weight: bold;
        display: flex;
        align-items: center;
        image {
          width: 48rpx;
          height: 48rpx;
          margin-right: 12rpx;
        }
      }
    }
  }
  .swiper {
    .swiper-item {
      margin-top: 10.99rpx;
    }
  }
  
  .pop-box {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9;
    .pop-content {
      width: 282.72rpx;
      height: 319.34rpx;
      background: url('https://hjom-oss.yimed.cn/static/operateSteps/portalH5/pages/pop-bg.png') no-repeat;
      background-size: 100% 100%;
      padding: 26.37rpx 0 29.3rpx 0;
      box-sizing: border-box;
      text-align: center;
      .title {
        font-size: 20.51rpx;
        color: #DF5C1D;
        font-weight: bold;
      }
      .sub-title {
        font-size: 13.18rpx;
        color: #DF5C1D;
        padding: 7.32rpx 0 21.97rpx 0;
      }
      .list {
        display: flex;
        align-items: center;
        padding-left: 63.72rpx;
        margin-bottom: 11.72rpx;
        image {
          width: 32.23rpx;
          height: 32.23rpx;
        }
        text {
          font-size: 14.65rpx;
          color: #885339;
          padding-left: 10.99rpx;
        }
      }
      .btn-close {
        width: 186.04rpx;
        height: 39.55rpx;
        background: #E9814F;
        border-radius: 7.32rpx;
        text-align: center;
        line-height: 39.55rpx;
        color: #fff;
        font-size: 17.58rpx;
        font-weight: bold;
        margin: 24.17rpx auto 0 auto;
      }
    }
  }
  .unlock-vip {
    display: none;
  }
  
  @media screen and (max-width: 500px) {
    .container {
      width: 750rpx;
      max-width: 750rpx;
      padding: 0rpx 26rpx 30rpx 26rpx;
      .swith-tab {
        width: 750rpx;
        margin-left: -26rpx;
        font-size: 34rpx;
        margin-bottom: 20rpx;
        justify-content: center;
        background-color: #fff;
        padding: 8rpx 0;
        &>view {
          margin-right: 20rpx;
          padding: 16rpx 56rpx;
        }
        &>view.on {
          font-size: 34rpx;
          color: #fff;
          border-bottom: none;
          font-weight: bold;
          background-color: #502459;
          border-radius: 40rpx;
        }
      }
      .top {
        border-radius: 20rpx;
        padding: 48rpx 56rpx 48rpx 126rpx;
        .img-1 {
          width: 100rpx;
          height: 138rpx;
        }
        .left {
          &>view:nth-child(1) {
            font-size: 32rpx;
            padding-bottom: 7.32rpx;
          }
        }
        .btn-vip {
          display: none;
        }
        .vip-msg {
          display: none;
        }
      }
      .top-margin-btm {
        margin-bottom: 20rpx;
      }
      .mobile-vip-msg {
        height: 88rpx;
        border: 1px solid #BAC9DB;
        border-radius: 20rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20rpx;
        box-sizing: border-box;
        background-color: #fff;
        font-size: 24rpx;
        color: #666;
        margin-bottom: 20rpx;
        &>view:nth-child(1) {
          font-size: 32rpx;
          color: #4E6C90;
          font-weight: bold;
          display: flex;
          align-items: center;
          image {
            width: 48rpx;
            height: 48rpx;
            margin-right: 12rpx;
          }
        }
      }
      .vip-tip {
        font-size: 24rpx;
        height: 54rpx;
        padding-top: 0rpx;
        line-height: 54rpx;
        margin-top: 0rpx;
        margin-bottom: 20rpx;
      }
      
    }
    .padding-btm {
      padding-bottom: 230rpx;
    }
    
    .unlock-vip  {
      display: block;
      width: 750rpx;
      max-width: 750rpx;
      padding: 14rpx 0;
      background-color: #fff;
      border-top-left-radius: 40rpx;
      border-top-right-radius: 40rpx;
      font-size: 28rpx;
      color: #835A8C;
      text-align: center;
      position: fixed;
      bottom: 0;
      left: 0;
      .btn-unlock {
        width: 698rpx;
        height: 96rpx;
        background-color: #502459;
        color: #fff;
        font-size: 34rpx;
        border-radius: 12rpx;
        line-height: 96rpx;
        margin: 14rpx auto 0 auto;
      }
    }
    
    .pop-box {
      .pop-content {
        width: 520rpx;
        height: 620rpx;
        padding: 72rpx 0 52rpx 0;
        .title {
          font-size: 40rpx;
        }
        .sub-title {
          font-size: 26rpx;
          padding: 8rpx 0 46rpx 0;
        }
        .list {
          padding-left: 130rpx;
          margin-bottom: 28rpx;
          image {
            width: 56rpx;
            height: 56rpx;
          }
          text {
            font-size: 30rpx;
            padding-left: 18rpx;
          }
        }
        .btn-close {
          width: 400rpx;
          height: 84rpx;
          border-radius: 12rpx;
          line-height: 84rpx;
          font-size: 34rpx;
          margin: 40rpx auto 0 auto;
        }
      }
    }
  }
</style>
