<template>
  <view class="vip-list">
    <block v-if="orderDataList.length">
      <view class="item" v-for="item in orderDataList" :key="item.orderNo">
        <view class="item-top brToHalf">
          <view>
            <image :src="orderType == 1 ? imgPrefix + '/static/operateSteps/portalH5/pages/icon-vip-3.png' : imgPrefix + '/static/operateSteps/portalH5/pages/icon-vip-1.png'"></image>
            <text>{{orderType == 1 ? '趣味健脑' : '健脑运动'}}服务包</text>
          </view>
          <view v-if="isPad" :class="[item.type == 1 ? '' : 'refund']">{{item.type == 1 ? '已付款' : '已退款'}}</view>
        </view>
        <view v-if="!isPad" class="mobile-price">
          <view>实际付款</view>
          <view>¥<text>{{item.amount / 100}}</text></view>
          <view :class="[item.type == 1 ? '' : 'refund']">{{item.type == 1 ? '已付款' : '已退款'}}</view>
        </view>
        <view :class="[isPad ? 'brToHalf' : '', 'item-msg']">
          <view>
            <view class="title">订单号</view>
            <view class="order-style">{{item.orderNo}}</view>
            <view class="copy" @click="copyHandle(item.orderNo)"><image class="img-copy" :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-copy.png'"></image></view>
          </view>
          <view>
            <view class="title">开通时间</view>
            <view>{{item.startTime | formatTime}}</view>
          </view>
          <view>
            <view class="title">有效期至</view>
            <view>{{item.expireDate | formatTime}}</view>
          </view>
          <view>
            <view class="title">开通来源</view>
            <view>{{item.getWayStr}}</view>
          </view>
        </view>
        <view class="item-bottom" v-if="isPad">
          实际付款：¥<text>{{item.amount / 100}}</text>
        </view>
      </view>
    </block>
    <block v-else-if="isDoneRequest && !orderDataList.length">
      <empty-data></empty-data>
    </block>
  </view>
</template>

<script>
  import emptyData from '@/components/empty-data'
  export default {
    props: {
      orderType: {
        type: Number,
        default: 1 // 1=>锻炼 2=>健脑运动
      }
    },
    components: {
      emptyData
    },
    data() {
      return {
        userInfo: {},
        orderDataList: [],
        buyOrigin: [],
        isDoneRequest: false,
        isPad: this.$pad,
        imgPrefix: this.$imgPrefix
      }
    },
    mounted() {
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
      this.getOrder(this.orderType)
    },
    methods: {
      getOrder(type) {
        this.$request({
          url: '/gw/h5/v1/front/ucServicePack/servicePackPage',
          data: {
            token: this.userInfo.token,
            pageSize: 10,
            pageNum: 1,
            type
          }
        }).then(res => {
          if (res.status === 1000) {
            this.orderDataList = res.data ? res.data.list : [],
            this.isDoneRequest = true
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      copyHandle(orderNo) {
        uni.setClipboardData({
          data: orderNo,
          success: (res)  => {
            uni.showToast({
              title: '复制成功',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .vip-list {
    .item {
      padding: 16.11rpx 17.58rpx 11.72rpx 17.58rpx;
      background-color: #fff;
      border-radius: 14.65rpx;
      margin-bottom: 11.72rpx;
      .item-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 9.52rpx;
        &>view:nth-child(1) {
          image {
            width: 35.16rpx;
            height: 35.16rpx;
            display: inline-block;
            vertical-align: middle;
            margin-right: 8.79rpx;
          }
          text {
            vertical-align: middle;
            font-size: 19.04rpx;
          }
        }
        &>view:nth-child(2) {
          color: #43C9A7;
          font-size: 14.65rpx;
        }
        &>view.refund {
          color: #999;
        }
      }
      .item-msg {
        width: 100%;
        display: flex;
        padding: 21.97rpx 0;
        &>view {
          flex: 1;
          font-size: 16.11rpx;
          text-align: center;
          margin-right: 14.65rpx;
          justify-content: space-between;
          position: relative;
          .title {
            font-size: 13.18rpx;
            color: #999;
            padding-bottom: 10.25rpx;
          }
          .order-style {
            max-width: 227.11rpx;
            overflow:hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            -o-text-overflow:ellipsis;
          }
          .copy {
            width: 16.11rpx;
            height: 16.11rpx;
            padding: 7.33rpx;
            position: absolute;
            right: -32.97rpx;
            bottom: 0;
            z-index: 3;
          }
          .img-copy {
            width: 16.11rpx;
            height: 16.11rpx;
            
          }
        }
      }
      .item-bottom {
        text-align: right;
        font-size: 17.58rpx;
        padding-top: 7.32rpx;
        text {
          font-size: 24.9rpx;
          font-weight: bold;
        }
      }
    }
  }
  @media screen and (max-width: 500px) {
    .vip-list {
      .item {
        padding: 22rpx 0rpx 42rpx 0rpx;
        border-radius: 0rpx;
        margin-bottom: 12rpx;
        .item-top {
          padding-bottom: 16rpx;
          &>view:nth-child(1) {
            image {
              width: 60rpx;
              height: 60rpx;
              margin-right: 20rpx;
              margin-left: 34rpx;
            }
            text {
              vertical-align: middle;
              font-size: 32rpx;
            }
          }
        }
        .mobile-price {
          text-align: center;
          &>view:nth-child(1) {
            font-size: 30rpx;
            color: #999;
            padding: 34rpx 0 0rpx 0;
          }
          &>view:nth-child(2) {
            font-size: 32rpx;
            padding-bottom: 12rpx;
            text {
              font-size: 80rpx;
            }
          }
          &>view:nth-child(3) {
            font-size: 30rpx;
            color: #999;
          }
          .refund {
            color: #43C9A7;
          }
        }
        .item-msg {
          width: 100%;
          display: flex;
          flex-direction: column;
          padding: 40rpx 48rpx 0 48rpx;
          box-sizing: border-box;
          &>view {
            display: flex;
            font-size: 32rpx;
            text-align: left;
            margin-right: 0rpx;
            padding-bottom: 20rpx;
            .title {
              font-size: 32rpx;
              padding-bottom: 0rpx;
            }
            .order-style {
              max-width: 350rpx;
              padding-right: 50rpx;
            }
            .copy {
              width: 36rpx;
              height: 36rpx;
              padding: 10rpx;
            
              right: -10rpx;
              bottom: 20rpx;
             
            }
            .img-copy {
              width: 36rpx;
              height: 36rpx;
              
            }
          }
        }
        .item-bottom {
          text-align: right;
          font-size: 17.58rpx;
          padding-top: 7.32rpx;
          text {
            font-size: 24.9rpx;
            font-weight: bold;
          }
        }
      }
    }
  }
</style>