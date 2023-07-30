<template>
  <view class="pay-res-container">
    <view class="content">
      <!-- <view class="close" v-if="!payReturnMsg.payRes && buyType != 4">
        <uni-icons class="icon-close" type="closeempty" size="25" color="#333" @click="closeHandle"></uni-icons>
      </view> -->
      <image class="pay-img" :src="payReturnMsg.payRes ? imgPrefix + '/static/operateSteps/portalH5/pages/pay-success.png' : imgPrefix + '/static/operateSteps/portalH5/pages/icon-pay-fail.png'"></image>
      <view :class="[payReturnMsg.payRes ? 'desc-success' : '','desc']">{{payReturnMsg.payRes ? '支付成功' : '支付失败'}}</view>
      <view class="cutdwon-time" v-if="buyType == 1 && payReturnMsg.payRes">即将打开筛查报告...{{dwonTime}}</view>
      <block v-if="payReturnMsg.payRes">
        <block v-if="buyType == 1 || buyType == 5">
          <view class="btn btn-go" @click="goNextHandle">{{buyType == 1 ? '查看报告' : '立即训练'}}</view>
          <view v-if="buyType == 5" class="btn btn-close" @click="closeHandle">稍后训练</view>
        </block>
        
        <block v-else-if="buyType == 2 || buyType == 3">
          <view class="_color">请在您预约的时间</view>
          <view class="_appoint-time">{{appointmentTime}}</view>
          <view class="_appoint-tip">登录平台，进行人工认知评估</view>
          <view class="btn btn-go" @click="goNextHandle">确认</view>
          <!-- <view class="btn btn-go" @click="returnBack">确认</view> -->
        </block>
        <block v-else>
          <view class="_color2">锻炼项已解锁，开始锻炼吧~</view>
          <view class="btn btn-go" @click="returnBack">确认</view>
        </block>
      </block>
      <block v-else>
        <view class="pay-fail">
          <view class="fail-tip">如您需再次购买，请{{isShowPayAginBtn ? '点击重新支付' : '重新下单支付'}}</view>
          <view @click="payAgainHandle" v-if="isShowPayAginBtn">
            <text class="btn btn-pay-agin">重新支付</text>
          </view>
          <view class="fail-help">
            <view>如需要帮助，请添加客服</view>
            <view @click="showKfCode">
              <image src="../../static/images/applet/icon_kefu.png"></image>
              <text>客服</text>
            </view>
          </view>
        </view>
      </block>
    </view>
    <kf-code v-if="isShowKfCode" @closeKfHandle="closeKfHandle" ewmName="zfsb"></kf-code>
  </view>
</template>

<script>
  import kfCode from '@/components/kf-code'
  export default {
    props: {
      payReturnMsg: {
        type: Object,
        default: () => {}
      },
      btnText: {
        type: String,
        default: '评估'
      },
      buyType: {
        type: String,
        default: '1' // 1=>智能评估购买||训练购买  2=>人工评估购买(需要填写表单预约时间) 3=>服务咨询购买(需要填写表单预约时间) 4=>服务包购买
      },
      appointmentTime: {
        type: String,
        default: ''
      },
      isShowPayAginBtn: {
        type: Boolean,
        default: true
      }
    },
    components: {
      kfCode
    },
    data() {
      return {
        isShowKfCode: false,
        imgPrefix: this.$imgPrefix,
        dwonTime: 3,
        timer: null,
        userInfo: {}
      };
    },
    mounted() {
      console.log('efasfa',this.buyType)
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
      if (this.buyType == 1 && this.payReturnMsg.payRes) {
        // 开始倒计时
        this.timer = setInterval(() => {
          this.dwonTime--
          if (this.dwonTime == 1) {
            clearInterval(this.timer)
            // 跳转至查看快筛报告
            // 查看报告详情 跳转研一系统
            if (this.userInfo.info && this.userInfo.info.birthYear && this.userInfo.info.birthYear > 0 && this.userInfo.info.education) {
              getApp().goEvalution({
                token: this.userInfo.token,
                requestType: 2,
                payOrderId: this.payReturnMsg.payOrderId,
                backType: 2
              })
            } else {
              uni.redirectTo({
                url:'/pages/evaluation/sort?payOrderId='+this.payReturnMsg.payOrderId
              })
            }
            this.$emit('closeDialog')
          }
        }, 1000)
      }
    },
    methods: {
      closeHandle() {
        this.$emit('closeHandle')
      },
      goNextHandle() {
        this.$emit('goNextHandle')
      },
      returnBack() {
        this.$emit('goBack')
      },
      payAgainHandle() {
        this.$emit('payAgainHandle')
      },
      closeKfHandle() {
        this.isShowKfCode = false
      },
      showKfCode() {
        this.isShowKfCode = true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .pay-res-container {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9;

    .content {
      width: 382.42rpx;
      padding: 17.58rpx;
      box-sizing: border-box;
      background-color: #fff;
      border-radius: 7.32rpx;
      position: relative;
      .close {
        text-align: right;

        .icon-close {
          padding: 7.32rpx;
          margin-right: -7.32rpx;
        }
      }
      
      .cutdwon-time {
        text-align: center;
        font-size: 20rpx;
        padding-top: 11.25rpx;
        padding-bottom: 26.25rpx;
        font-weight: 400;
      }

      .pay-img {
        width: 83.52rpx;
        height: 83.52rpx;
        display: block;
        margin: 0rpx auto 7.32rpx auto;
      }

      .desc {
        font-size: 21.98rpx;
        color: #F86D6D;
        font-weight: bold;
        text-align: center;
        padding: 0rpx 0 14.65rpx 0;
      }
      .desc-success {
        color: #333;
      }
      .btn {
        width: 269.6rpx;
        height: 55.68rpx;
        text-align: center;
        line-height: 55.68rpx;
        border-radius: 7.32rpx;
        font-size: 21.98rpx;
        font-weight: bold;
        box-sizing: border-box;
        display: block;
        margin: 0 auto 14.65rpx auto;
        font-weight: normal;
      }

      .btn-go {
        background-color: #43C9A7;
        color: #fff;
      }

      .btn-close {
        border: 1px solid #43C9A7;
        color: #43C9A7;
      }
      ._color {
        color: #333;
        font-size: 17.58rpx;
        padding-bottom: 16.12rpx;
        text-align: center;
      }
      ._appoint-time {
        font-size: 21.98rpx;
        font-weight: bold;
        padding-bottom: 9.52rpx;
        text-align: center;
      }
      ._appoint-tip {
        font-size: 17.58rpx;
        padding-bottom: 17.58rpx;
        text-align: center;
      }
      ._color2 {
        font-size: 13.18rpx;
        padding: 0rpx 0 21.97rpx 0;
        text-align: center;
        color: #333;
      }
      .fail-tip {
        text-align: center;
        font-size: 17.58rpx;
        padding-bottom: 25.64rpx;
      }
      .pay-fail {
        color: #333;
      }
      .btn-pay-agin {
        background-color: #43C9A7;
        color: #fff;
        margin-bottom: 14.65rpx;
      }
      .fail-help {
        width: 382.42rpx;
        height: 56.41rpx;
        padding: 0 14.65rpx;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #F5F5F5;
        border-bottom-left-radius: 14.65rpx;
        border-bottom-right-radius: 14.65rpx;
        font-size: 17.58rpx;
        position: absolute;
        bottom: -50.41rpx;
        left: 0;
        &>view:nth-child(2) {
          display: flex;
          align-items: center;
          margin-left: 21.98rpx;
          image {
            width: 32.23rpx;
            height: 32.23rpx;
          }
          text {
            color: #5796F8;
            font-size: 17.58rpx;
            padding-left: 3.66rpx;
          }
        }
      }
    }
  }
  @media screen and (max-width: 500px) {
    .pay-res-container {
      .content {
        width: 520rpx;
        padding: 30rpx;
        border-radius: 20rpx;
    
        .close {
          .icon-close {
            padding: 10rpx;
            margin-right: -10rpx;
          }
        }
        
        .cutdwon-time {
          font-size: 32rpx;
          padding-top: 8rpx;
          padding-bottom: 42rpx;
        }
    
        .pay-img {
          width: 160rpx;
          height: 160rpx;
          margin: -20rpx auto 14rpx auto;
        }
    
        .desc {
          height: 40rpx;
          line-height: 40rpx;
          font-size: 34rpx;
          padding: 0rpx 0 20rpx 0;
        }
    
        .btn {
          width: 422rpx;
          height: 84rpx;
          line-height: 84rpx;
          border-radius: 12rpx;
          font-size: 34rpx;
        }
    
        .btn-go {
          margin-bottom: 12rpx;
        }
        ._appoint-time {
          font-size: 40rpx;
          padding-bottom: 10rpx;
        }
        ._appoint-tip {
          font-size: 34rpx;
          padding-bottom: 40rpx;
        }
        ._color {
          font-size: 34rpx;
          padding-bottom: 20rpx;
        }
        ._color2 {
          font-size: 34rpx;
          padding: 0rpx 0 20rpx 0;
        }
        .fail-tip {
          text-align: center;
          font-size: 26rpx;
          padding-bottom: 45rpx;
          height: 30rpx;
          line-height: 30rpx;
        }
        .pay-fail {
          color: #333;
          
        }
        .fail-help {
          width: 520rpx;
          height: 80rpx;
          padding: 0 20rpx;
          border-bottom-left-radius: 20rpx;
          border-bottom-right-radius: 20rpx;
          font-size: 26rpx;
          bottom: -65rpx;
          &>view:nth-child(2) {
            margin-left: 14rpx;
            image {
              width: 60rpx;
              height: 60rpx;
            }
            text {
              padding-left: 0rpx;
              font-size: 26rpx;
            }
          }
        }
      }
    }
  }
</style>
