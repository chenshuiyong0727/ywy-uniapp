<template>
  <view>
    <nav-bar title='填写物流信息'></nav-bar>
    <view class="container">
      <view class="box-common">
        <view class="title">寄还地址</view>
        <view class="flex-box">
          <view class="flex-left">物流状态:</view>
          <view class="flex-right text-weight"><text>{{detailData.recycleStatus | dictToDesc('RECYCLESTATUS')}}</text></view>
        </view>
        <view class="flex-box flex-box-auto">
          <view class="flex-left">收件人:</view>
          <view class="flex-right" v-if="detailData.returnLogisticsMsg"><text>{{detailData.returnLogisticsMsg.name ? detailData.returnLogisticsMsg.name : '--'}}</text><text class="copy" @click="copyHandle(detailData.returnLogisticsMsg.name)">复制</text></view>
        </view>
        <view class="flex-box">
          <view class="flex-left">收货地址:</view>
          <view class="flex-right" v-if="detailData.returnLogisticsMsg"><text>{{detailData.returnLogisticsMsg.address ? detailData.returnLogisticsMsg.address : '--'}}</text><text class="copy" @click="copyHandle(detailData.returnLogisticsMsg.address)">复制</text></view>
        </view>
        <view class="flex-box flex-box-auto">
          <view class="flex-left">联系电话:</view>
          <view class="flex-right" v-if="detailData.returnLogisticsMsg"><text>{{detailData.returnLogisticsMsg.phone ? detailData.returnLogisticsMsg.phone : '--'}}</text><text class="copy" @click="copyHandle(detailData.returnLogisticsMsg.phone)">复制</text></view>
        </view>
      </view>
      <view class="explain-container">
        <image v-if="isPad" :src="imgPrefix + '/static/operateSteps/portalH5/send-back-explain-img-1.png'"></image>
        <image v-else :src="imgPrefix + '/static/operateSteps/portalH5/send-back-explain-img-2.png'"></image>
      </view>
      <view class="btn-container">
        <view @click="returnBack">返回</view>
        <view @click="showLogisticsPopover">{{detailData.recycleStatus == 1 ? '填写' : '修改'}}物流单号</view>
      </view>
    </view>
    <logistics-popover v-if="isShowLogisticsPopover" :payOrderId="detailData.payOrderId" :logisticsParam="{logisticsSupplier: detailData.returnLogisticsSupplier, logisticsNumber: detailData.returnLogisticsNumber}" @closeLogisticsPop="closeLogisticsPop" @updateLogisticsSuccess="updateLogisticsSuccess"></logistics-popover>
  </view>
</template>

<script>
  import navBar from '@/components/nav-bar'
  import logisticsPopover from '@/components/order/logistics-popover'
  export default {
    components: {
      navBar,
      logisticsPopover
    },
    data() {
      return {
        isShowLogisticsPopover: false,
        detailData: {},
        imgPrefix: this.$imgPrefix,
        isPad: this.$pad
      }
    },
    onLoad(options) {
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
      this.payOrderId = options.payOrderId ? options.payOrderId : ''
      this.getOrderDetail()
    },
    methods: {
      getOrderDetail() {
        this.$request({
          url: '/gw/h5/v1/front/order/detail',
          method: 'get',
          data: {
            token: this.userInfo.token,
            payOrderId: this.payOrderId,
          }
        }).then(res => {
          if (res.status === 1000) {
            this.detailData = res.data
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      closeLogisticsPop() {
        this.isShowLogisticsPopover = false
      },
      showLogisticsPopover() {
        this.isShowLogisticsPopover = true
      },
      returnBack() {
        const pages = getCurrentPages()
        let prevPage = pages[pages.length - 2]
        if (pages.length === 1) { //如果只有一个调用原生js
          // #ifdef H5
          history.back()
          // #endif
        } else {
          uni.navigateBack({
            delta: 1,
            success: () => {
              if (prevPage.$vm.getOrderDetail) {
                prevPage.$vm.getOrderDetail()
              } else if (prevPage.$vm.getOrderList) {
                prevPage.$vm.resetPage()
                prevPage.$vm.getOrderList()
              }
            }
          })
        }
      },
      // 物流更新成功
      updateLogisticsSuccess() {
        this.isShowLogisticsPopover = false
        this.getOrderDetail()
      },
      copyHandle(data) {
        uni.setClipboardData({
          data,
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
  .container {
    width: 750rpx;
    max-width: 750rpx;
    box-sizing: border-box;
    font-size: 20rpx;
    color: #333;
    padding: 17.5rpx 16.25rpx;
    margin: 0 auto;
    .box-common {
      padding: 25rpx;
      background-color: #fff;
      border-radius: 12.5rpx;
      margin-bottom: 10rpx;
      .title {
        color: #1A1A1A;
        font-size: 22.5rpx;
        padding-bottom: 20rpx;
        font-weight: bold;
      }
      .flex-box {
        display: flex;
        margin-bottom: 16.25rpx;
        .flex-left {
          width: 100rpx;
          color: #6B6B6B;
        }
        .flex-right {
          
          margin-left: 31.25rpx;
          font-size: 23.75rpx;
          color: #333333;
          font-weight: 600;
          text {
            display: inline-block;
            vertical-align: middle;
          }
          text:nth-child(1) {
            width: 437.5rpx;
          }
          .copy {
            font-size: 20rpx;
            color: #181818;
            padding: 5rpx 10rpx;
            background-color: #EBEEF0;
            border-radius: 15rpx;
            margin-left: 12.5rpx;
            font-weight: 400;
          }
        }
        .text-weight {
          font-weight: 400;
        }
      }
      .flex-box-auto {
        .flex-right {
          text:nth-child(1) {
            width: auto;
          }
        }
      }
    }
    .explain-container {
      image {
        width: 717.5rpx;
        height: 548.75rpx;
      }
    }
    .btn-container {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 25rpx;
      &>view {
        width: 237.5rpx;
        height: 57.5rpx;
        line-height: 57.5rpx;
        background-color: #F7F7F7;
        border: 1px solid #DBE1E4;
        text-align: center;
        border-radius: 7.5rpx;
        font-size: 21.25rpx;
      }
      &>view:nth-child(2) {
        background-color: #43C9A7;
        border-color: #43C9A7;
        width: 325rpx;
        margin-left: 12.5rpx;
        color: #fff;
        font-size: 25rpx;
        font-weight: 600;
      }
    }
  }
  @media screen and (max-width: 500px) {
    .container {
      font-size: 32rpx;
      padding: 24rpx 14rpx;
      .box-common {
        padding: 32rpx 26rpx;
        border-radius: 20rpx;
        margin-bottom: 16rpx;
        .title {
          font-size: 36rpx;
          padding-bottom: 32rpx;
        }
        .flex-box {
          margin-bottom: 28rpx;
          .flex-left {
            width: 150rpx;
          }
          .flex-right {
            margin-left: 20rpx;
            font-size: 36rpx;
            text:nth-child(1) {
              width:390rpx;
            }
            .copy {
              font-size: 32rpx;
              padding: 5rpx 15rpx;
              border-radius: 40rpx;
              margin-left: 15rpx;
            }
          }
        }
        .flex-box-auto {
          .flex-right {
            text:nth-child(1) {
              width: auto;
            }
          }
        }
      }
      .explain-container {
        image {
          width: 722rpx;
          height: 940rpx;
        }
      }
      .btn-container {
        margin-top: 25rpx;
        &>view {
          width: 292rpx;
          height: 88rpx;
          line-height: 88rpx;
          border-radius: 44rpx;
          font-size: 34rpx;
        }
        &>view:nth-child(2) {
          width: 420rpx;
          margin-left: 10rpx;
          font-size: 32rpx;
        }
      }
    }
  }
</style>