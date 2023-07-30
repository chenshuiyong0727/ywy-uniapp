<template>
  <view>
   
    <nav-bar title='咨询专家' :backUrl="'/pages/index/index'"></nav-bar>
   
    <view class="container">
      <view class="title">健康咨询</view>
      <view class="doctor" v-for="item in doctorList" :key="item.goodsId">
        <view class="doctor-top" v-if="isPad">
          <view class="tx-msg">
            <image :src="isPad ? imgPrefix + item.imgUrl : imgPrefix + item.appImgUrl"></image>
            <!-- <view>{{item.title}}</view> -->
          </view>
          <view class="middle">
            <view class="_h6">健康咨询师</view>
            <view class="desc">{{item.detail}}</view>
            <view class="_label" v-if="item.labelList && item.labelList.length">
              <text v-for="label in item.labelList" :key="label">{{label}}</text>
            </view>
          </view>
          <view class="right">
            <!-- <view class="price" v-if="item.amount / 100 > 0">¥ <text>{{item.amount / 100}}</text>元/{{item.subTitle}}分钟</view>
            <view class="price" v-else><text>限时免费</text>/{{item.subTitle}}分钟</view> -->
            <view class="btn-wrap" @click="goToPage(item)">
              <view class="btn">立即咨询</view>
              <view class="tip">视频咨询</view>
            </view>
          </view>
        </view>
        <view class="doctor-top" v-else>
          <view class="mobile-tx-msg">
            <image :src="isPad ? imgPrefix + item.imgUrl : imgPrefix + item.appImgUrl"></image>
            <view class="mobile-tx-msg-right">
              <view><!-- <text>{{item.title}}</text> --><text>健康咨询师</text></view>
              <view class="_label" v-if="item.labelList && item.labelList.length">
                <text v-for="label in item.labelList" :key="label">{{label}}</text>
              </view>
            </view>
          </view>
          <view class="mobile-desc">{{item.detail}}</view>
          <!-- <view class="mobile-price">¥ <text>{{item.amount / 100}}</text>元/{{item.subTitle}}分钟</view> -->
          <view class="mobile-btn-wrap" @click="goToPage(item)">
            <view class="btn">立即咨询</view>
            <view class="tip">视频咨询</view>
          </view>
        </view>
        <view class="doctor-bottom" v-if="item.payStatus == 1">
          <view>
            <uni-icons type="checkbox" size="20" color="#43C9A7" click="icon"></uni-icons>
            <text>已购买</text>
          </view>
          <view>预约时间：{{item.appointmentTime}}</view>
        </view>
      </view>
      <view class="title"><text>其他咨询</text> <view class="tip2">免费</view></view>
      <view class="list">
        <view @click="showKfCode('fwzx-znpg')">认知障碍筛查咨询</view>
        <view @click="showKfCode('fwzx-ddzx')">订单咨询</view>
        <view @click="showKfCode('fwzx-rgpgzx')">认知评估咨询</view>
        <view @click="showKfCode('fwzx-sycz')">使用操作咨询</view>
        <view @click="showKfCode('fwzx-szlf')">认知症数字疗法咨询</view>
        <view @click="showKfCode('fwzx-sh')">售后咨询</view>
        
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
  import kfCode from '@/components/kf-code'
  import { navigateTo } from '@/utils/util'
  import {mixin} from '@/mixin/mixin'
  export default {
    mixins:[mixin],
    components: {
      navBar,
      kfCode,
      fab
    },
    onShow() {
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
      this.getGoodsList()
    },
    onLoad(options) {
      // this.guidType = options.guidType ? options.guidType : -1
    },
    data() {
      return {
        isWechat: this.$isWechat,
        doctorList: [],
        imgPrefix: this.$imgPrefix,
        isPad: this.$pad,
        isShowKfCode: false,
      }
    },
    methods: {
      getGoodsList() {
        this.$request({
          url: '/gw/h5/v1/front/goods/goodsList',
          method: 'post',
          data: {
            token: this.userInfo.token,
            type: 3,
            userId: this.userInfo.userId
          }
        }).then(res => {
          if (res.status === 1000) {
            this.doctorList = res.data ? res.data : []
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      showKfCode() {
        this.isShowKfCode = true
      },
      closeKfHandle() {
        this.isShowKfCode = false
      },
      goToPage(item) {
        if (item.payStatus != 1) {
          // 未付款
          navigateTo(`/pages/consulting-service/appointment?goodsId=${item.goodsId}&amount=${item.amount}&originalAmount=${item.originalAmount}&mouldId=${item.mouldId}&addressFlag=${item.addressFlag}`)
        } else {
          // 已付款，跳转研二
          getApp().goHealthConsulting({
            payOrderId: item.payOrderId,
            token: this.userInfo.token,
            type: 1
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    width: 750.02rpx;
    max-width: 750.02rpx;
    box-sizing: border-box;
    font-size: 21.97rpx;
    color: #333;
    padding: 0rpx 11.72rpx 16.11rpx 11.72rpx;
    overflow: hidden;
    margin: 0 auto;
    .title {
      font-size: 17.58rpx;
      margin: 17.58rpx 0 8.79rpx 0;
      text {
        vertical-align: middle;
      }
    }
    .doctor {
      background-color: #fff;
      border-radius: 14.65rpx;
      margin-bottom: 14.65rpx;
      .doctor-top {
        padding: 20.51rpx 23.44rpx;
        display: flex;
      }
      .tx-msg {
        display: flex;
        flex-direction: column;
        align-items: center;
        image {
          width: 80.57rpx;
          height: 80.57rpx;
          border-radius: 50%;
          margin-bottom: 18.31rpx;
        }
        &>view {
          font-size: 17.58rpx;
        }
      }
      .middle {
        flex: 0 0 366.22rpx;
        margin-left: 21.97rpx;
        font-size: 14.65rpx;
        ._h6 {
          font-size: 17.58rpx;
          padding-bottom: 7.32rpx;
        }
        .desc {
          color: #999;
          line-height: 23.44rpx;
          margin-bottom: 7.32rpx;
        }
        ._label {
          &>text {
            padding: 3.66rpx 8.79rpx;
            background-color: #EEFFFB;
            font-size: 13.18rpx;
            color: #43C9A7;
            display: inline-block;
            margin-right: 5.86rpx;
            border-radius: 2.93rpx;
          }
        }
      }
      .right {
        width: 164.8rpx;
        flex: 0 0 164.8rpx;
        text-align: right;
        margin-left: 36.62rpx;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        
        .price {
          color: #DF5C1D;
          font-size: 14.65rpx;
          font-weight: bold;
          &>text {
            font-size: 24.9rpx;
          }
        }
        .btn-wrap {
          position: relative;
          margin-top: 80rpx;
          .btn {
            width: 164.8rpx;
            height: 45.41rpx;
            font-size: 17.58rpx;
            color: #fff;
            text-align: center;
            line-height: 45.41rpx;
            background-color: #43C9A7;
            border-radius: 7.32rpx;
          }
        }
      }
      .doctor-bottom {
        display: flex;
        background-color: #43C9A7;
        height: 24.9rpx;
        border-bottom-left-radius: 14.65rpx;
        border-bottom-right-radius: 14.65rpx;
        justify-content: center;
        align-items: center;
        font-size: 13.18rpx;
        color: #fff;
        &>view:nth-child(1) {
          margin-right: 11.72rpx;
          text {
            vertical-align: middle;
            padding-left: 5.86rpx;
          }
        }
      }
    }
    .list {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      &>view {
        width: 358.9rpx;
        height: 64.45rpx;
        line-height: 64.45rpx;
        text-align: center;
        background-color: #fff;
        font-size: 17.58rpx;
        color: #43C9A7;
        border-radius: 10.25rpx;
        margin-bottom: 8.79rpx;
      }
    }
    .tip, .tip2 {
      padding: 0rpx 6.59rpx;
      height: 23.44rpx;
      line-height: 23.44rpx;
      position: absolute;
      top: -14.65rpx;
      background-color: #DF5C1D;
      font-size: 11.72rpx;
      color: #fff;
      
    }
    .tip {
      left: -21.97rpx;
      border-top-right-radius: 11.72rpx;
      border-top-left-radius: 11.72rpx;
      border-bottom-left-radius: 11.72rpx;
    }
    .tip2 {
      position: relative;
      display: inline-block;
      top: 0;
      right: 0;
      vertical-align: middle;
      margin-left: 7.32rpx;
      border-top-left-radius: 11.72rpx;
      border-top-right-radius: 11.72rpx;
      border-bottom-right-radius: 11.72rpx;
    }
  }
  @media screen and (max-width: 500px) {
    .container {
      width: 750rpx;
      max-width: 750rpx;
      padding: 0rpx 26rpx 30rpx 26rpx;
      .title {
        font-size: 34rpx;
        margin: 32rpx 0 20rpx 0;
      }
      .doctor {
        border-radius: 20rpx;
        margin-bottom: 30rpx;
        .doctor-top {
          padding: 32rpx;
          flex-direction: column;
        }
        .mobile-tx-msg {
          display: flex;
          image {
            width: 136rpx;
            height: 136rpx;
            border-radius: 68rpx;
            margin-right: 25rpx;
            flex: 0 0 136rpx;
          }
          .mobile-tx-msg-right {
            &>view:nth-child(1) {
              font-size: 32rpx;
              text:nth-child(1) {
                font-size: 40rpx;
                font-weight: bold;
                padding-right: 20rpx;
              }
            }
            ._label {
              margin-top: 20rpx;
              &>text {
                padding: 8rpx 16rpx;
                background-color: #EEFFFB;
                font-size: 28rpx;
                color: #43C9A7;
                display: inline-block;
                margin-right: 16rpx;
                border-radius: 8rpx;
                margin-bottom: 10rpx;
              }
              &>text:nth-child(3) {
                margin-right: 0;
              }
            }
          }
        }
        .mobile-desc {
          font-size: 28rpx;
          padding: 28rpx 0 18rpx 0;
          color: #999;
        }
        .mobile-price {
          color: #DF5C1D;
          font-size: 30rpx;
          font-weight: bold;
          text-align: center;
          &>text {
            font-size: 56rpx;
          }
        }
        .mobile-btn-wrap {
          position: relative;
          margin-top: 22rpx;
          .btn {
            width: 634rpx;
            height: 96rpx;
            font-size: 34rpx;
            color: #fff;
            text-align: center;
            line-height: 96rpx;
            background-color: #43C9A7;
            border-radius: 12rpx;
          }
        }
        .doctor-bottom {
          background-color: #fff;
          padding-bottom: 32rpx;
          height: 40rpx;
          border-bottom-left-radius: 20rpx;
          border-bottom-right-radius: 20rpx;
          font-size: 28rpx;
          color: #8F4E9D;
          &>view:nth-child(1) {
            margin-right: 34rpx;
            text {
              vertical-align: middle;
              padding-left: 12rpx;
            }
          }
        }
      }
      .list {
        &>view {
          width: 340rpx;
          height: 108rpx;
          line-height: 108rpx;
          font-size: 34rpx;
          border-radius: 12rpx;
          margin-bottom: 16rpx;
        }
      }
      .tip, .tip2 {
        padding: 0rpx 16rpx;
        height: 56rpx;
        line-height: 56rpx;
        top: -28rpx;
        
        font-size: 26rpx;
        
      }
      .tip {
        left: -20rpx;
        border-top-right-radius: 28rpx;
        border-top-left-radius: 28rpx;
        border-bottom-left-radius: 28rpx;
      }
      .tip2 {
        position: relative;
        display: inline-block;
        top: -10rpx;
        right: -10rpx;
        vertical-align: middle;
        margin-left: 7.32rpx;
        border-top-left-radius: 28rpx;
        border-top-right-radius: 28rpx;
        border-bottom-right-radius: 28rpx;
      }
    }
  }
</style>