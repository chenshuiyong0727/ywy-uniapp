<template>
  <view>
    <view class="content">
      <view class="rich-text"><slot></slot></view>
    </view>
    <view class="bottom">
      <view class="kf" @click="showKfCode">
        <image src="../../static/images/applet/icon_kefu.png"></image>
        <view>客服咨询</view>
      </view>
      <view class="btm-right">
        <block v-if="detail.businessType == '2210081722313010031' || detail.businessType == '2210081722147310027'">
          <view v-if="detail.businessType == '2210081722147310027'">
            <view v-if="!paySuccess && (!detail.payStatus || detail.payStatus == 0)">
              <payment @nextHandle="nextHandle" @closePayResultHandle="closePayResultHandle" :price="detail.amount" :goodsId="detail.goodsId" :addressFlag="+detail.addressFlag" btnText="训练" buyType="5">
                <view class="btn-buy">
                  <text>立即购买</text>
                  <text class="price-1" v-if="!paySuccess && (!detail.payStatus || detail.payStatus == 0)">{{detail.amount / 100 > 0 ? '¥' + detail.amount / 100 : '限时免费'}}</text>
                  <text class="price-2">¥{{detail.originalAmount / 100}}</text>
                  
                </view>
              </payment>
            </view>
            <view class="btn-buy" @click="goEvaluation" v-else>立即训练</view>
          </view>
          <view v-else :class="[!paySuccess && (!detail.payStatus || detail.payStatus == 0) ? '' : 'btn-pg-group']">
            <view v-if="!(!paySuccess && (!detail.payStatus || detail.payStatus == 0))" :class="[!paySuccess && (!detail.payStatus || detail.payStatus == 0) ? 'btn-buy' : 'btn-buy-get']" @click="goEvaluation">立即评估</view>
            <view>
              <payment @nextHandle="nextHandle" @closePayResultHandle="closePayResultHandle" :price="detail.amount" :goodsId="detail.goodsId" :addressFlag="+detail.addressFlag" btnText="评估" buyType="1">
                <view :class="[!paySuccess && (!detail.payStatus || detail.payStatus == 0) ? 'btn-buy' : 'btn-buy-get']">
                  <text>立即购买</text>
                  <view>
                    <text class="price-1">{{detail.amount / 100 > 0 ? '¥' + detail.amount / 100 : '限时免费'}}</text>
                    <text class="price-2">¥{{detail.originalAmount / 100}}</text>
                  </view>
                </view>
              </payment>
            </view>
          </view>
        </block>
        <block v-else>
          <view class="btn-buy" v-if="!paySuccess && (!detail.payStatus || detail.payStatus == 0)" @click="appointmentHandle(detail)">立即预约</view>
          <view class="btn-buy" v-else @click="goAppointmentDetail(detail.payOrderId)">查看预约</view>
        </block>
      </view>
    </view>
    <pay-result v-if="isShowPayResult" @closeHandle="closeHandle" @goNextHandle="goNextHandle" :payReturnMsg="payReturnMsg" :btnText="detail.businessType == '2210081722147310027' ? '训练' : '评估'">
    </pay-result>
    <kf-code v-if="isShowKfCode" @closeKfHandle="closeKfHandle" :ewmName="ewmName"></kf-code>
  </view>
</template>

<script>
  import payment from '@/components/payment'
  import payResult from '@/components/pay-result'
  import kfCode from '@/components/kf-code'
  import { navigateTo, getQueryString } from '@/utils/util'
  export default {
    props: {
      detail: {
        type: Object,
        default: () => {
          return {}
        }
      },
      pageType: {
        type: String,
        default: '1' // 1=>认知障碍筛查 2=>认知症数字疗法
      },
      ewmName: {
        type: String,
        default: '' // 客服对应二维码的图片名字
      }
    },
    components: {
      payment,
      payResult,
      kfCode
    },
    data() {
      return {
        userInfo: {},
        payOrderId: '',
        isShowPayResult: false,
        // payMsg: '',
        paySuccess: false,
        isShowKfCode: false,
        payReturnMsg: {},
        isWechat: this.$isWechat
      }
    },
    mounted() {
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
      // #ifdef H5 || APP-PLUS
      if (!this.$pad) {
        let routes = getCurrentPages()
        let curRoute = routes[routes.length - 1].route
        let curParam = routes[routes.length - 1].options || routes[routes.length - 1].$route.query
        let payStatus = curParam.status
        let payOrderId = curParam.payOrderId
        if (payStatus) {
          //payStatus存在 => 支付页面回来的
          if (payStatus == 2) {
            // 2 => 支付成功
            
            this.payReturnMsg = {
              payRes: true,
              payOrderId
            }
            
            
          } else {
            this.payReturnMsg = {
              payRes: false,
              payOrderId
            }
          }
          this.isShowPayResult = true
        }
      }
      // #endif
    },
    methods: {
      nextHandle(res) {
        this.payOrderId = res.payOrderId
        //  v1.3跳转信息填写页面
        if (this.pageType == 1) {
          navigateTo('/pages/evaluation/sort?payOrderId='+res.payOrderId)
        } else {
          this.goEvaluation()
        }
        
      },
      closePayResultHandle(res) {
        console.log(res)
        this.paySuccess = res.payRes
        this.payOrderId = res.payOrderId
      },
      goEvaluation() {
        if (this.detail.businessType == '2210081722147310027') {
          // 跳转研一训练
          getApp().goCognitiveTraining({
            token: this.userInfo.token,
            isNeedLandscape: 'yes',
            payOrderId: this.payOrderId ? this.payOrderId : this.detail.payOrderId
          })
        } else {
          // 跳转研一测评
          getApp().goEvalution({
            token: this.userInfo.token,
            requestType: 1,
            payOrderId: this.payOrderId ? this.payOrderId : this.detail.payOrderId,
            backType: 2
          })
        }
        
      },
      appointmentHandle(item) {
        navigateTo(`/pages/evaluation/artificial?goodsId=${item.goodsId}&amount=${item.amount}&originalAmount=${item.originalAmount}&addressFlag=${item.addressFlag}`)
      },
      goAppointmentDetail(payOrderId) {
        getApp().goHealthConsulting({
          payOrderId: payOrderId,
          token: this.userInfo.token,
          type: 2
        })
      },
      closeKfHandle() {
        // this.isShowPayResult = false
        this.isShowKfCode = false
      },
      showKfCode() {
        this.isShowKfCode = true
      },
      goNextHandle() {
        this.isShowPayResult = false
        
        //  v1.3跳转信息填写页面
        if (this.pageType == 1) {
          navigateTo('/pages/evaluation/sort?payOrderId='+this.payReturnMsg.payOrderId)
        } else {
          this.goEvaluation(this.payReturnMsg.payOrderId)
        }
        
      },
      closeHandle() {
        this.isShowPayResult = false
        let routes = getCurrentPages()
        let curRoute = routes[routes.length - 1].route
        let curParam = routes[routes.length - 1].options || routes[routes.length - 1].$route.query
        let param = ''
        for (let key in  curParam) {
          if (key != 'payOrderId' && key != 'status' && key != 'mchOrderNo') {
            param += '&' + key + '=' + curParam[key]
          }
        }
        let url = ''
        // #ifdef H5
        if (param) {
          url = `${location.href.split('?')[0]}?${param}`
        } else {
          url = `${location.href.split('?')[0]}`
        }
        // 替换浏览器的url值，防止刷新页面后出现支付结果弹窗
        window.history.replaceState(null, null, url)
        // #endif
        
        // #ifdef APP-PLUS
        if (param) {
          url = `/${curRoute}?${param}&backdelta=2`
        } else {
          url = `/${curRoute}?backdelta=2`
        }
        // 重定向url值，防止刷新页面后出现支付结果弹窗
        uni.redirectTo({
          url
        })
        // #endif
      }
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    // padding: 21.97rpx 21.97rpx 73.24rpx 21.97rpx;
    padding: 0rpx 0rpx 73.24rpx 0rpx;
  }
  .rich-text {
    img {
      width: 100%;
    }
  }
  .bottom {
    width: 750.02rpx;
    max-width: 750.02rpx;
    height: 64.45rpx;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    bottom: 0;
    left: 50%;
    margin-left: -375.01rpx;
    .kf {
      margin-left: 32.23rpx;

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
      display: flex;
      align-items: center;

      .btn-buy, .btn-buy-get {
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        background-color: #43C9A7;
        height: 55.68rpx;
        color: #fff;
        font-size: 21.98rpx;
        font-weight: bold;
        border-radius: 7.33rpx;
        margin-right: 14.65rpx;
        .price-1 {
          padding-left: 21.98rpx;
          font-size: 23.44rpx;
        }
        .price-2 {
          font-size: 13.19rpx;
          color: #fff;
          padding-left: 7.33rpx;
          text-decoration: line-through;
        }
      }
      .btn-buy {
        width: 629.3rpx;
        margin-right: 21.98rpx;
        
      }
      .btn-buy-get {
        width: 307.69rpx;
      }
      .btn-pg-group {
        display: flex;
        align-items: center;
        &>view:nth-child(1) {
          background-color: #fff;
          border: 1px solid #43C9A7;
          color: #43C9A7;
          box-sizing: border-box;
          margin-right: 7.33rpx;
          position: relative;
          &::after {
            content: '您已购买';
            width: 80.59rpx;
            height: 31.5rpx;
            line-height: 31.5rpx;
            display: block;
            background-color: #FC6666;
            border-radius: 12.45rpx 12.45rpx 0px 12.45rpx;
            font-size: 13.19rpx;
            color: #fff;
            font-weight: bold;
            position: absolute;
            top: -16.85rpx;
            left: 43.96rpx;
            text-align: center;
          }
        }
      }
    }
  }
  @media screen and (max-width: 500px) {
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
        .btn-buy, .btn-buy-get {
          
          height: 92rpx;
          font-size: 34rpx;
          .price-1 {
            padding-left: 21.98rpx;
            font-size: 44rpx;
          }
          .price-2 {
            font-size: 24rpx;
            color: #fff;
            padding-left: 10rpx;
            text-decoration: line-through;
          }
        }
        .btn-buy-get {
          flex-direction: column-reverse;
          .price-1, .price-2 {
            font-size: 26rpx;
          }
        }
        .btn-buy {
          width: 600rpx;
        }
        .btn-buy-get {
          width: 305rpx;
        }
        .btn-pg-group {
          &>view:nth-child(1) {
            margin-right: 10rpx;
            position: relative;
            &::after {
              width: 115rpx;
              height: 36rpx;
              line-height: 36rpx;
              border-radius: 18px 18px 2px 18px;
              font-size: 24rpx;
              top: -18rpx;
              left: -10rpx;
            }
          }
        }
      }
    }
  }
</style>
