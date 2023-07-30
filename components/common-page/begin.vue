<template>
  <view>
  
    <nav-bar :title='title'></nav-bar>
  
    
    <view class="container">
      <slot name="imgs"></slot>
      <view class="fixed-bottom" v-if="serviceMsg.status !=1 && showBtm=='true'">
        <!-- <view class="price">
          <view v-if="servicePackDetail.amount / 100 > 0">¥<text>{{servicePackDetail.amount / 100}}/年</text></view>
          <view v-else><text>限时免费</text></view>
          <view>¥{{servicePackDetail.originalCost / 100}}/年</view>
        </view> -->
        <!-- <view class="button-group">
          
          <view @click="goToPage(pageType == 1 ? '/pages/exercise/list' : '/pages/micromotion/list')">立即锻炼</view>
        </view> -->
        <view class="btn">
          <view @click="goToPage(pageType == 1 ? '/pages/exercise/list' : '/pages/micromotion/list')">立即锻炼</view>
        </view>
      </view>
      <view class="fixed-bottom" style="padding: 0" v-if="serviceMsg.status == 1 && showBtm=='true'">
        <!-- <view class="left">{{popVo.msg}}</view>
        <view class="right">
          <view class="price">
            <view>¥<text>0/年</text></view>
            <view>¥{{servicePackDetail.originalCost / 100}}/年</view>
          </view>
          <view class="btn" @click="goToPage(pageType == 1 ? '/pages/exercise/list' : '/pages/micromotion/list')">立即锻炼</view>
        </view> -->
        <view class="btn" @click="goToPage(pageType == 1 ? '/pages/exercise/list' : '/pages/micromotion/list')">立即锻炼</view>
      </view>
      <slot name="fab"></slot>
    </view>
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
  import fab from '@/components/fab'
  import { navigateTo } from '../../utils/util.js'
  import navBar from '@/components/nav-bar'
  export default {
    components: {
      navBar,
      fab
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      pageType: {
        type: Number,
        default: 1 // 1=>趣味锻炼 2=>健脑运动
      },
      showBtm: {
        type: String,
        default: 'true'
      }
    },
    data() {
      return {
        imgPrefix: this.$imgPrefix,
        userInfo: {},
        isShowPop: false,
        serviceMsg: {},
        servicePackDetail: {},
        popVo: {},
        isPad: this.$pad
      }
    },
    mounted() {
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
      if (this.showBtm == 'true' && this.userInfo && JSON.stringify(this.userInfo) != '{}') {
        this.getGivenPopVo()
        this.getServiceMsg()
        this.getServicePackDetailVo()
      }
    },
    methods: {
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
      getServicePackDetailVo() {
        this.$request({
          url: '/gw/h5/v1/front/ucServicePack/getServicePackDetailVo',
          method: 'get',
          data: {
            token: this.userInfo.token,
            recordType: this.pageType
          }
        }, false).then(res => {
          if (res.status === 1000) {
            this.servicePackDetail = res.data ? res.data : {}
          }
        })
      },
      closePopHandle() {
        this.isShowPop = false
      },
      goToPage(url) {
        getApp().loginStatus().then(() => {
          // 跳转列表页
          uni.redirectTo({
            url
          })
          // navigateTo(url)
        })
        
      },
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    width: 750.02rpx;
    max-width: 750.02rpx;
    box-sizing: border-box;
    font-size: 21.97rpx;
    overflow: hidden;
    margin: 0 auto;
    .fixed-bottom {
      width: 750.02rpx;
      height: 64.45rpx;
      padding: 10.99rpx 14.65rpx;
      box-sizing: border-box;
      position: fixed;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      .btn {
        width: 719.41rpx;
        height: 55.68rpx;
        border-radius: 7.33rpx;
        line-height: 55.68rpx;
        background-color: #43C9A7;
        text-align: center;
        font-size: 21.98rpx;
        color: #fff;
        font-weight: bold;
      }
      // .button-group {
      //   display: flex;
      //   align-items: center;
      //   &>view {
      //     width: 146.49rpx;
      //     height: 45.41rpx;
      //     box-sizing: border-box;
      //     text-align: center;
      //     line-height: 45.41rpx;
      //     font-size: 17.58rpx;
      //     color: #DF5C1D;
      //     background-color: #fff;
      //   }
      //   &>view:nth-child(1) {
      //     border-top-left-radius: 7.32rpx;
      //     border-bottom-left-radius: 7.32rpx;
      //     border-top: 1px solid #DF5C1D;
      //     border-left: 1px solid #DF5C1D;
      //     border-bottom: 1px solid #DF5C1D;
      //     border-right: 1px solid #DF5C1D;
      //   }
      //   &>view:nth-child(2) {
      //     border-top-right-radius: 7.32rpx;
      //     border-bottom-right-radius: 7.32rpx;
      //     border-top: 1px solid #DF5C1D;
      //     border-right: 1px solid #DF5C1D;
      //     border-bottom: 1px solid #DF5C1D;
      //     background-color: #DF5C1D;
      //     color: #fff;
      //   }
      // }
      // .price {
      //   padding-right: 16.11rpx;
      //   text-align: right;
      //   &>view:nth-child(1) {
      //     color: #DF5C1D;
      //     font-size: 11.72rpx;
      //     text {
      //       font-size: 23.44rpx;
      //     }
      //   }
      //   &>view:nth-child(2) {
      //     font-size: 11.72rpx;
      //     color: #999;
      //     text-decoration: line-through;
      //   }
      // }
      // .right {
      //   display: flex;
      //   align-items: center;
      //   .btn {
      //     width: 219.73rpx;
      //     height: 64.45rpx;
      //     line-height: 64.45rpx;
      //     text-align: center;
      //     background-color: #DF5C1D;
      //     font-size: 19.04rpx;
      //     color: #fff;
      //     font-weight: bold;
      //   }
      // }
      // .left {
      //   flex: 1;
      //   font-size: 14.65rpx;
      //   color: #502459;
      //   padding-left: 19.04rpx;
      // }
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
  @media screen and (max-width: 500px) {
    .container {
      width: 750rpx;
      max-width: 750rpx;
      .fixed-bottom {
        width: 750rpx;
        height: 116rpx;
        padding: 8rpx;
        .btn {
          width: 682rpx;
          height: 92rpx;
          border-radius: 12rpx;
          line-height: 92rpx;
          
          font-size: 34rpx;
         
        }
        // .button-group {
        //   &>view {
        //     width: 256rpx;
        //     height: 100rpx;
        //     line-height: 100rpx;
        //     font-size: 34rpx;
        //   }
        //   &>view:nth-child(1) {
        //     border-top-left-radius: 10rpx;
        //     border-bottom-left-radius: 10rpx;
        //   }
        //   &>view:nth-child(2) {
        //     border-top-right-radius: 10rpx;
        //     border-bottom-right-radius: 10rpx;
        //   }
        // }
        // .price {
        //   text-align: left;
        //   &>view:nth-child(1) {
        //     font-size: 24rpx;
        //     text {
        //       font-size: 44rpx;
        //     }
        //   }
        //   &>view:nth-child(2) {
        //     font-size: 24rpx;
        //   }
        // }
        // .right {
        //   .btn {
        //     width: 308rpx;
        //     height: 116rpx;
        //     line-height: 116rpx;
        //     font-size: 34rpx;
        //   }
        // }
        // .left {
        //   font-size: 22rpx;
        //   padding-left: 0rpx;
        // }
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
          margin-bottom: 24rpx;
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
          border-radius: 10rpx;
          line-height: 84rpx;
          font-size: 34rpx;
          margin: 46rpx auto 0 auto;
        }
      }
    }
  }
</style>