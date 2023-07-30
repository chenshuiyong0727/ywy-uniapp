<template>
  <view>
    <nav-bar title='筛查完成'></nav-bar>
    <view class="container">
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
     <!-- <image class="img-1" :src="isPad ? imgPrefix + '/static/operateSteps/portalH5/pages/report-pad-img-2-v3.png' : imgPrefix + '/static/operateSteps/portalH5/pages/report-mobile-img-2-v3.png'"></image> -->
      <image class="img-2" :src="isPad ? imgPrefix + '/static/operateSteps/portalH5/pages/report-pad-img-5-v3.png' : imgPrefix + '/static/operateSteps/portalH5/pages/report-mobile-img-5-v3.png'"></image>
      <image class="img-3" :src="isPad ? imgPrefix + '/static/operateSteps/portalH5/pages/report-pad-img-6-v3.png' : imgPrefix + '/static/operateSteps/portalH5/pages/report-mobile-img-6-v3.png'"></image>
      <image class="img-4" :src="isPad ? imgPrefix + '/static/operateSteps/portalH5/pages/report-pad-img-7-v3.png' : imgPrefix + '/static/operateSteps/portalH5/pages/report-mobile-img-7-v3.png'"></image>
      <view class="btn-unlock">
        <!-- <view class="btn-look-report" v-if="isHuiXiaUser && huiXiaUserData.useTimes > 0" @click="goReportList">查看已有报告</view> -->
        <view @click="unlockReportHandle">{{(isHuiXiaUser && (huiXiaUserData.allTimes - huiXiaUserData.useTimes > 0) || lockStatus == 1) ? '查看报告' : '解锁报告'}}</view>
        
      </view>
      <!--惠夏宝兑换提示-->
      <view class="img-tip" v-if="isHuiXiaUser">
        <image v-if="huiXiaUserData.useTimes > 0" :src="imgPrefix + '/static/operateSteps/portalH5/pages/hxb-img-2.png?v=1'"></image>
        <image v-else :src="imgPrefix + '/static/operateSteps/portalH5/pages/hxb-img-1.png?v=1'"></image>
      </view>
      <!---->
      <!--begin 客服弹窗-->
      <view class="kf-box" v-if="isShowKfBox">
        <view :class="['box-content', isPad ? '' : 'box-content-mobile', isShowContent ? 'box-content-pad' : '']">
          <image class="title" :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-title.png'"></image>
          <view class="close" @click="closeKfBox"><image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-close.png'"></image></view>
          <view class="detail">
            <image class="ewm" show-menu-by-longpress :src="imgPrefix + '/static/operateSteps/portalH5/pages/hxb-ewm.jpeg'"></image>
            <view class="detail-right">
              <view class="_view1">
                <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-num-1.png'"></image>
                <view>
                  <text>获取兑换码</text>
                </view>
                <view class="tip">
                  <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-guestor.png'"></image>
                  <text>长按{{isPad ? '左方' : '上方'}}二维码，添加微信</text>
                </view>
              </view>
              <view class="_view2">
                <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-arrow.png'"></image>
              </view>
              <view class="_view3">
                <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-num-2.png'"></image>
                <view>
                  <text>已有兑换码</text>
                </view>
                <view class="tip">
                  <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-guestor.png'"></image>
                  <view class="btn-dh" @click="goDuiHuan">立即兑换</view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <!--end 客服弹窗-->
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
        lockStatus: -1,
        fastSieveNum: 0,
        isShowKfBox: false,
        isShowContent: false,
        // 是否惠夏宝用户
        isHuiXiaUser: false,
        // 惠夏宝用户数据
        huiXiaUserData: {},
        evaluationData: {}
      }
    },
    onLoad(options) {
      this.payOrderId = options.payOrderId ? options.payOrderId : ''
      this.isShowKfBox = options.autoShowBox ? true : false
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
      this.queryFastSieveNum()
      // 查询免单状态
      this.checkFastSieveLock()
      // 是否惠夏宝用户
      this.queryHuiXiaScreening()
      
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
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      queryHuiXiaScreening() {
        this.$request({
          url: '/gw/h5/v1/front/user/huiXiaScreeningReportStatus',
          method: 'get',
          data: {
            token: this.userInfo.token
          }
        }, false).then(res => {
          if (res.status === 1000) {
            if (res.data.isHuiXiaUser == 1) {
              this.isHuiXiaUser = true
              this.huiXiaUserData = res.data
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
      closeKfBox() {
        this.isShowContent = false
        setTimeout(() => {
          this.isShowKfBox = false
        }, 200)
        
      },
      goDuiHuan() {
        navigateTo('/pages/pre-pay/index?payOrderId='+this.payOrderId+'&huiXiaUser='+this.huiXiaUserData.isHuiXiaUser)
        this.closeKfBox()
      },
      goReportList() {
        this.$request({
          url: '/gw/h5/v1/front/order/fastSieveOrder',
          method: 'post',
          data: {
            token: this.userInfo.token,
            userId: this.userInfo.userId,
            pageSize: 100,
            pageNum: 1
          }
        }, false).then(res => {
          if (res.status === 1000) {
            let reportList = []
            reportList = res.data.list.length ? res.data.list.filter(item => item.orderStatus == 60) : []
            if (reportList.length == 1) {
              // 只有一个可查看的报告，跳转至研一
              if (this.userInfo.info && this.userInfo.info.birthYear && this.userInfo.info.birthYear > 0 && this.userInfo.info.education) {
                getApp().goEvalution({
                  token: this.userInfo.token,
                  requestType: 2,
                  payOrderId: reportList[0].payOrderId,
                  backType: 2
                })
              } else {
                navigateTo('/pages/evaluation/sort?payOrderId='+reportList[0].payOrderId)
              }
            } else {
              navigateTo('/pages/evaluation/evaluation-list')
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
      unlockReportHandle() {
        if (this.lockStatus == 1) {
          // 报告已解锁，直接跳转至报告页
          // 查看报告详情 跳转研一系统
          if (this.userInfo.info && this.userInfo.info.birthYear && this.userInfo.info.birthYear > 0 && this.userInfo.info.education) {
            getApp().goEvalution({
              token: this.userInfo.token,
              requestType: 2,
              payOrderId: this.payOrderId,
              backType: 2
            })
          } else {
            navigateTo('/pages/evaluation/sort?payOrderId='+this.payOrderId)
          }
        } else {
          // 未解锁报告
          if (this.isHuiXiaUser && (this.huiXiaUserData.allTimes - this.huiXiaUserData.useTimes > 0)) {
            // 惠夏宝用户，并且有兑换次数
            if (this.huiXiaUserData.useTimes <= 0) {
              // 首次兑换，添加客服弹窗
              this.$request({
                url: '/gw/h5/v1/front/user/userToSeeRecord',
                method: 'get',
                data: {
                  token: this.userInfo.token,
                  type: 1
                }
              }, false).then(res => {
                if (res.status === 1000) {
                  this.isShowKfBox = true
                  setTimeout(() => {
                    this.isShowContent = true
                  }, 200)
                } else {
                  uni.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 2000
                  })
                }
              })
            } else {
              // 非首次进入
              navigateTo('/pages/pre-pay/index?payOrderId='+this.payOrderId)
            }
          } else {
            // 普通用户
            // 未解锁，跳转至支付选择页进行支付解锁
            navigateTo('/pages/pre-pay/index?payOrderId='+this.payOrderId)
          }
        } 
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
    background-color: #F3F9FF;
    padding-bottom: 90rpx;
    .top {
      width: 750rpx;
      height: 128.75rpx;
      padding: 11.25rpx 50rpx;
      background: url('https://natt.yimed.cn:11902/static/operateSteps/portalH5/pages/report-pad-img-1-v3.png') no-repeat;
      background-size: 750rpx 128.75rpx;
      display: flex;
      align-items: center;
      box-sizing: border-box;
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
    // .img-1 {
    //   width: 695rpx;
    //   height: 66.25rpx;
    //   margin: 15rpx auto 10rpx auto;
    //   display: block;
    // }
    .img-2 {
      width: 695rpx;
      height: 1223.75rpx;
      margin: 15rpx auto 10rpx auto;
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
    .img-tip {
      width: 487.5rpx;
      height: 157.5rpx;
      position: fixed;
      bottom: 72rpx;
      left: 50%;
      transform: translateX(-50%);
      image {
        width: 100%;
        height: 100%;
      }
    }
    .btn-unlock {
      display: flex;
      align-items: center;
      justify-content: center;
      position: fixed;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 750rpx;
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
      .btn-look-report {
        width: 147.5rpx;
        border: 1px solid #43C9A7;
        background-color: #fff;
        color: #43C9A7;
        margin: 15rpx 5rpx 16.25rpx 0;
      }
      .btn-unlock-small {
        width: 315rpx;
        margin: 15rpx 0 16.25rpx 0;
      }
    }
    .kf-box {
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.3);
      position: fixed;
      top: 0;
      left: 0;
      z-index: 99;
      .box-content {
        position: fixed;
        height: 0;
        background: #fff;
        width: 750rpx;
        overflow: hidden;
        border-radius: 25rpx 25rpx 0rpx 0rpx; 
        padding: 0 0 0 55rpx;
        box-sizing: border-box;
        animation: height 0.2s;
        .title {
          width: 251.25rpx;
          height: 45rpx;
          display: block;
          margin: 0 auto;
        }
        .close {
          padding: 12.5rpx;
          position: absolute;
          top: 0rpx;
          right: 0rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          image {
            width: 45rpx;
            height: 45rpx;
          }
        }
        .detail {
          display: flex;
          margin-top: 43.75rpx;
          .ewm {
            width: 162.5rpx;
            height: 162.5rpx;
          }
          .detail-right {
            margin-left: 42.5rpx;
            display: flex;
            flex-direction: column;
            flex: 1;
            ._view1, ._view3 {
              font-size: 22.5rpx;
              color: #30B08F;
              display: flex;
              align-items: center;
              position: relative;
              flex: 1;
              image {
                width: 36.25rpx;
                height: 36.25rpx;
                margin-right: 11.25rpx;
              }
              .tip {
                display: flex;
                align-items: center;
                font-size: 25rpx;
                font-weight: bold;
                color: #333;
                image {
                  width: 37.5rpx;
                  height: 21.25rpx;
                }
              }
            }
            ._view1 {
              .tip {
                position: absolute;
                top: 52.5rpx;
                left: 50rpx;
              }
            }
            ._view3 {
              .tip {
                margin-left: 10rpx;
                .btn-dh {
                  width: 157.5rpx;
                  height: 50rpx;
                  border: 1px solid #43C9A7;
                  border-radius: 5rpx;
                  font-size: 22.5rpx;
                  color: #30B08F;
                  text-align: center;
                  line-height: 50rpx;
                }
              }
            }
            ._view2 {
              margin-left: 11.25rpx;
              image {
                width: 12.5rpx;
                height: 70rpx;
              }
            }
          }
        }
      }
      .box-content-pad {
        height: 306.25rpx;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
  @media screen and (max-width: 500px) {
    .container {
      padding-bottom: 150rpx;
      .top {
        width: 750rpx;
        height: 206rpx;
        padding: 18rpx 26rpx;
        background: url('https://natt.yimed.cn:11902/static/operateSteps/portalH5/pages/report-mobile-img-1-v3.png') no-repeat;
        background-size: 750rpx 206rpx;
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
      // .img-1 {
      //   width: 698rpx;
      //   height: 106rpx;
      //   margin: 32rpx auto 16rpx auto;
      // }
      .img-2 {
        width: 698rpx;
        height: 1958rpx;
        margin-top: 32rpx;
      }
      .img-3 {
        width: 698rpx;
        height: 754rpx;
      }
      .img-4 {
        width: 698rpx;
        height: 2044rpx;
      }
      .img-tip {
        width: 780rpx;
        height: 252rpx;
        bottom: 100rpx;
      }
      .btn-unlock {
        width: 750rpx;
        height: 116rpx;
        position: fixed;
        bottom: 0;
        background-color: #fff;
        &>view {
          width: 726rpx;
          height: 88rpx;
          border-radius: 44rpx;
          line-height: 88rpx;
          font-size: 36rpx;
        }
        .btn-look-report {
          width: 238rpx;
        }
        .btn-unlock-small {
          width: 484rpx;
        }
      }
      .kf-box {
        .box-content {
          width: 686rpx;
          border-radius: 25rpx; 
          padding: 0 0 0 0rpx;
          .title {
            width: 402rpx;
            height: 72rpx;
          }
          .close {
            padding: 10rpx;
            image {
              width: 72rpx;
              height: 72rpx;
            }
          }
          .detail {
            margin-top: 44rpx;
            flex-direction: column;
            align-items: center;
            .ewm {
              width: 260rpx;
              height: 260rpx;
            }
            .detail-right {
              margin-left: 0;
              margin-top: 40rpx;
              ._view1, ._view3 {
                font-size: 36rpx;
                image {
                  width: 58rpx;
                  height: 58rpx;
                  margin-right: 18rpx;
                }
                .tip {
                  font-size: 36rpx;
                  image {
                    width: 60rpx;
                    height: 34rpx;
                  }
                }
              }
              ._view1 {
                .tip {
                  position: absolute;
                  top: 64rpx;
                  left: 75rpx;
                }
              }
              ._view3 {
                .tip {
                  margin-left: 10rpx;
                  .btn-dh {
                    width: 252rpx;
                    height: 80rpx;
                    border-radius: 8rpx;
                    font-size: 36rpx;
                    line-height: 80rpx;
                  }
                }
              }
              ._view2 {
                margin-left: 18rpx;
                image {
                  width: 20rpx;
                  height: 112rpx;
                }
              }
            }
          }
        }
        .box-content-mobile {
          height: 732rpx;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
  }
</style>