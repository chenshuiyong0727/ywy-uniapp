<template>
  <view>
    <nav-bar title='订单详情' :refreshPage="false"></nav-bar>
    <view class="container">
      <view class="title">
        <text>{{detailData.orderStatus | dictToDesc('ORDERSTATUS')}}</text>
      </view>
      <view class="top">
        <view class="top-left">
          <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/report-img-4-v3.png'"></image>
        </view>
        <view class="top-right">
          <view class="tip">
            <view class="p1">您的筛查报告已生成</view>
            <view class="p2"><text>{{fastSieveNum}}</text><text>解锁了报告</text></view>
          </view>
          <view class="button">
            <view class="p3">{{lockStatus == 1 ? '解锁报告' : '完成支付，解锁报告'}}</view>
            <view class="p4" @click="unlockReportHandle"><image :src="imgPrefix + '/static/operateSteps/portalH5/pages/report-img-3-v3.png'"></image></view>
          </view>
        </view>
      </view>
      <view class="box-common">
        <view class="_t">筛查明细</view>
        <view class="box-flex">
          <view class="flex-left">筛查编号</view>
          <view class="flex-right"><text class="txt text-ellipsis">{{detailData.payOrderId || '--'}}</text><text class="copy" @click="copyHandle(detailData.payOrderId)">复制</text></view>
        </view>
        <view class="box-flex" v-if="detailData.businessType == '2210081722313010031'">
          <view class="flex-left">开始时间:</view>
          <view class="flex-right"><text>{{detailData.startTime || '--'}}</text></view>
        </view>
        <view class="box-flex" v-if="detailData.businessType == '2210081722313010031'">
          <view class="flex-left">完成时间:</view>
          <view class="flex-right"><text>{{detailData.completeTime || '--'}}</text></view>
        </view>
        <view class="box-flex" v-if="detailData.businessType != '2210081722313010031'">
          <view class="flex-left">下单时间:</view>
          <view class="flex-right"><text>{{detailData.portalCreateTime || '--'}}</text></view>
        </view>
      </view>
      <view class="img-box">
        <!-- <image class="img-1" :src="isPad ? imgPrefix + '/static/operateSteps/portalH5/pages/report-pad-img-2-v3.png' : imgPrefix + '/static/operateSteps/portalH5/pages/report-mobile-img-2-v3.png'"></image> -->
        <image class="img-2" :src="isPad ? imgPrefix + '/static/operateSteps/portalH5/pages/report-pad-img-5-v3.png' : imgPrefix + '/static/operateSteps/portalH5/pages/report-mobile-img-5-v3.png'"></image>
        <image class="img-3" :src="isPad ? imgPrefix + '/static/operateSteps/portalH5/pages/report-pad-img-6-v3.png' : imgPrefix + '/static/operateSteps/portalH5/pages/report-mobile-img-6-v3.png'"></image>
        <image class="img-4" :src="isPad ? imgPrefix + '/static/operateSteps/portalH5/pages/report-pad-img-7-v3.png' : imgPrefix + '/static/operateSteps/portalH5/pages/report-mobile-img-7-v3.png'"></image>
        <!-- <image class="img-5" :src="isPad ? imgPrefix + '/static/operateSteps/portalH5/pages/detail-pad-img-8-v3.png' : imgPrefix + '/static/operateSteps/portalH5/pages/detail-mobile-img-8-v3.png'"></image> -->
      </view>
      
      <view class="btn-unlock" @click="unlockReportHandle">
        <view>立即解锁</view>
      </view>
    </view>
  </view>
</template>

<script>
  import navBar from '@/components/nav-bar'
  import { navigateTo } from '@/utils/util'
  export default {
    components: {
      navBar
    },
    data() {
      return {
        imgPrefix: this.$imgPrefix,
        isPad: this.$pad,
        currentIndex: 0,
        userInfo: {},
        payOrderId: '',
        // orderId: '',
        detailData: {},
        lockStatus: -1,
        fastSieveNum: 0
      }
    },
    onLoad(options) {
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
      this.payOrderId = options.payOrderId ? options.payOrderId : ''
      // this.orderId = options.orderId ? options.orderId : ''
      this.getOrderDetail()
      this.queryFastSieveNum()
      // 查询免单状态
      this.checkFastSieveLock()
    },
    methods: {
      checkFastSieveLock() {
        this.$request({
          url: '/gw/h5/v1/fastsieve/checkFastSieveLock',
          method: 'get',
          data: {
            token: this.userInfo.token,
            orderId: this.payOrderId
          }
        }).then(res => {
          if (res.status === 1000) {
            this.lockStatus = res.data
          }
        })
      },
      queryFastSieveNum() {
        this.$request({
          url: '/gw/h5/v1/front/fastSieveNum',
          method: 'get'
        }, false).then(res => {
          if (res.status === 1000) {
            this.fastSieveNum = res.data ? res.data : 0
          }
        })
      },
      unlockReportHandle() {
        if (this.lockStatus == 1) {
          // 报告已解锁，直接跳转至报告页
          // 查看报告详情 跳转研一系统
          if (this.userInfo.info && this.userInfo.info.birthYear && this.userInfo.info.birthYear > 0 && this.userInfo.info.education) {
            getApp().goEvalution({
              token: this.userInfo.token,
              requestType: 2,
              payOrderId: item.payOrderId,
              backType: 2
            })
          } else {
            navigateTo('/pages/evaluation/sort?payOrderId='+this.payOrderId)
          }
        } else {
          // 未解锁，跳转至支付选择页进行支付解锁
          navigateTo('/pages/pre-pay/index?payOrderId='+this.payOrderId)
        }
      },
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
    width: 100%;
    max-width: 750rpx;
    box-sizing: border-box;
    font-size: 21.97rpx;
    color: #333;
    overflow: hidden;
    margin: 0 auto;
    padding: 20rpx 16.25rpx 110rpx 16.25rpx;
    .title {
      color: #30B08F;
      font-size: 27.5rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
    }
    .box-common {
      padding: 25rpx;
      box-sizing: border-box;
      background-color: #fff;
      border-radius: 12.5rpx;
      margin-bottom: 10rpx;
      ._t {
        font-size: 22.5rpx;
        font-weight: bold;
        color: #1A1A1A;
        margin-bottom: 16.25rpx;
      }
      .box-flex {
        display: flex;
        font-size: 20rpx;
        align-items: center;
        padding-bottom: 16.25rpx;
        .flex-left {
          width: 93.75rpx;
          color: #6B6B6B;
          image {
            width: 75rpx;
            height: 75rpx;
            border-radius: 15rpx;
            flex: 0 0 75rpx;
          }
        }
        .flex-right {
          flex: 1;
          color: #1A1A1A;
          margin-left: 43.75rpx;
          text {
            vertical-align: middle;
          }
          .copy {
            font-size: 20rpx;
            color: #181818;
            padding: 5rpx 10rpx;
            background-color: #EBEEF0;
            border-radius: 15rpx;
            margin-left: 12.5rpx;
            font-weight: normal;
          }
          .txt {
            display: inline-block;
            max-width: 400rpx;
          }
        }
      }
      .box-flex:last-child {
        padding-bottom: 0;
      }
    }
    .top {
      width: 717.5rpx;
      height: 128.75rpx;
      padding: 11.25rpx 50rpx;
      background: url('https://natt.yimed.cn:11902/static/operateSteps/portalH5/pages/report-pad-img-1-v3.png') no-repeat;
      background-size: 750rpx 128.75rpx;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      margin-bottom: 12.5rpx;
      border-radius: 12.5rpx;
      .top-left {
        width: 107.5rpx;
        height: 107.5rpx;
        margin-right: 13.75rpx;
        image {
          width: 100%;
          height: 100%;
        }
      }
      .tip {
        display: flex;
        align-items: center;
        color: #0D72FF;
        .p1 {
          font-weight: bold;
          
          font-size: 25rpx;
        }
        .p2 {
          font-size: 20rpx;
          padding-left: 21.25rpx;
          &>text:nth-child(1) {
            font-weight: bold;
            padding-right: 6.25rpx;
          }
        }
      }
      .button {
        margin-top: 17.5rpx;
        display: flex;
        align-items: center;
        .p3 {
          font-size: 20rpx;
          margin-right: 10rpx;
        }
        .p4 {
          width: 96.25rpx;
          height: 30rpx;
          image {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .img-box {
      padding: 20rpx 0 10rpx 0;
      box-sizing: border-box;
      background-color: #fff;
      border-radius: 12.5rpx;
    }
    // .img-1 {
    //   width: 695rpx;
    //   height: 66.25rpx;
    //   display: block;
    //   margin: 0 auto 10rpx auto;
    // }
    .img-2 {
      width: 695rpx;
      height: 1223.75rpx;
      margin: 0 auto 10rpx auto;
      display: block;
    }
    .img-3 {
      width: 695rpx;
      height: 471.25rpx;
      margin: 0 auto;
      display: block;
    }
    .img-4 {
      width: 695rpx;
      height: 1111.25rpx;
      margin: 0 auto;
      display: block;
    }
    // .img-5 {
    //   width: 717.5rpx;
    //   height: 342.5rpx;
    //   margin: 0 auto;
    //   display: block;
    // }
    .btn-unlock {
      display: flex;
      align-items: center;
      justify-content: center;
      position: fixed;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      &>view {
        width: 388.75rpx;
        height: 62.5rpx;
        background-color: #43C9A7;
        border-radius: 31.25rpx;
        text-align: center;
        line-height: 62.5rpx;
        color: #fff;
        font-size: 22.5rpx;
        font-weight: bold;
        margin: 15rpx auto 16.25rpx auto;
      }
      
    }
  }
  @media screen and (max-width: 500px) {
    .container {
      padding: 36rpx 14rpx 150rpx 14rpx;
      box-sizing: border-box;
      .title {
        font-size: 40rpx;
        margin-bottom: 36rpx;
        padding-left: 26rpx;
      }
      .box-common {
        padding: 40rpx 25rpx;
        border-radius: 20rpx;
        margin-bottom: 16rpx;
        ._t {
          font-size: 36rpx;
          margin-bottom: 32rpx;
        }
        .box-flex {
          font-size: 32rpx;
          padding-bottom: 26rpx;
          align-items: center;
          .flex-left {
            width: 150rpx;
            image {
              width: 120rpx;
              height: 120rpx;
              border-radius: 20rpx;
              flex: 0 0 120rpx;
            }
          }
          .flex-right {
            margin-left: 15rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .copy {
              font-size: 32rpx;
              padding: 5rpx 15rpx;
              border-radius: 35rpx;
              margin-left: 10rpx;
              flex: 0 0 70rpx;
            }
            
            .txt {
              max-width: 410rpx;
              // max-width: auto;
            }
          }
        }
        
      }
      .top {
        width: 722rpx;
        height: 206rpx;
        padding: 18rpx 26rpx;
        background: url('https://natt.yimed.cn:11902/static/operateSteps/portalH5/pages/report-mobile-img-1-v3.png') no-repeat;
        background-size: 750rpx 206rpx;
        margin-bottom: 16rpx;
        border-radius: 20rpx;
        .top-left {
          width: 172rpx;
          height: 172rpx;
          margin-right: 22rpx;
        }
        .tip {
          flex-direction: column;
          align-items: flex-start;
          .p1 {
            font-size: 40rpx;
          }
          .p2 {
            font-size: 32rpx;
            padding-left: 0rpx;
            padding-top: 12rpx;
            &>text:nth-child(1) {
              padding-right: 12rpx;
            }
          }
        }
        .button {
          margin-top: 12rpx;
          .p3 {
            font-size: 32rpx;
            margin-right: 16rpx;
          }
          .p4 {
            width: 154rpx;
            height: 48rpx;
          }
        }
      }
      .img-box {
        padding: 32rpx 0 14rpx 0;
        border-radius: 20rpx;
      }
      // .img-1 {
      //   width: 698rpx;
      //   height: 106rpx;
      //   margin: 0 auto 20rpx auto;
      // }
      .img-2 {
        width: 698rpx;
        height: 1958rpx;
        margin: 0 auto 20rpx auto;
      }
      .img-3 {
        width: 698rpx;
        height: 754rpx;
      }
      .img-4 {
        width: 698rpx;
        height: 2044rpx;
      }
      // .img-5 {
      //   width: 722rpx;
      //   height: 548rpx;
      // }
      .btn-unlock {
        width: 750rpx;
        height: 116rpx;
        position: fixed;
        bottom: 0;
        background-color: #fff;
        border-top: 1px solid #F3F4F5;
        &>view {
          width: 726rpx;
          height: 88rpx;
          border-radius: 44rpx;
          line-height: 88rpx;
          font-size: 36rpx;
        }
      }
    }
  }
</style>