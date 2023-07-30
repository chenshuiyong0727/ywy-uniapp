<template>
  <view>
    <nav-bar title='收银台'></nav-bar>
    <view class="container">
      <view class="sub-title">{{title}}</view>
      <view class="price">
        <view class="price-top">
          <view class="item" v-for="(item, index) in orderDetail.originAmountDetail" :key="index">
            <view>{{item.name}}</view>
            <view><text>￥</text><text>{{item.amount ? item.amount / 100 : ''}}</text></view>
          </view>
          <view class="item">
            <view>专属优惠</view>
            <view class="discount" v-if="orderDetail.originAmount"><text>-￥</text><text>{{(orderDetail.originAmount - orderDetail.amount) / 100}}</text></view>
          </view>
        </view>
        <view class="price-bottom">
          <view class="discount" v-if="orderDetail.originAmount">已优惠¥{{(orderDetail.originAmount - orderDetail.amount) / 100}}</view>
          <view class="count">
            <view>合计</view>
            <view v-if="orderDetail.amount"><text>¥</text><text>{{orderDetail.amount / 100}}</text></view>
          </view>
        </view>
      </view>
      <view class="pay-type">
        <view 
          :class="['item', item.value == 4 && exchangeCodeStatus == 2 ? 'item-disabled' : '']" 
          v-for="(item, index) in payType" 
          :key="index" 
          @click="choosePayType(item, index)">
            <image class="item-icon" :src="item.icon"></image>
            <view class="item-right">
              <view>
                <text>{{item.name}}</text>
                <text class="sort" v-if="item.value == 1">（微信、支付宝）</text>
                <text class="sort" v-if="item.value == 4 && exchangeCodeStatus == 2">（暂不可用）</text>
              </view>
              <view>
                <image v-if="exchangeCodeStatus == 1 || (exchangeCodeStatus == 2 && item.value != 4)" :src="currentTypeIndex == index ? imgPrefix + '/static/operateSteps/portalH5/pages/pre-pay-img-2-v3.png' : imgPrefix + '/static/operateSteps/portalH5/pages/pre-pay-img-1-v3.png'"></image>
                <image v-else :src="imgPrefix + '/static/operateSteps/portalH5/pages/pre-pay-img-1-disabled-v3.png'"></image>
              </view>
            </view>
        </view>
      </view>
      <view class="exchange-code" v-if="currentTypeValue.value == 4">
        <view>
          <text>请输入您的兑换码</text>
          <text @click="showGifBox">兑换码使用说明</text>
        </view>
        <view>
          <view class="input-box">
            <input class="input" v-model="codeValue" placeholder="请输入兑换码，验证通过即可解锁报告"/>
          </view>
          <view v-if="codeValue" class="delete" @click="deleteCodeValue"><image :src="imgPrefix + '/static/operateSteps/portalH5/pages/pre-pay-img-8-v3.png'"></image></view>
        </view>
        <view v-if="isShowErrorTip" class="error-tip"><image :src="imgPrefix + '/static/operateSteps/portalH5/pages/pre-pay-img-7-v3.png'"></image><text>{{errorTip}}</text></view>
      </view>
      <view class="btn" @click="exchangePayHandle" v-if="currentTypeValue.value == 4"><text class="_text">立即兑换</text></view>
      <view v-else class="btn">
        <!--免单 无需支付-->
        <view v-if="orderType == 2" @click="payFreeHandle">
          <text class="_text">立即支付</text>
        </view>
        <view v-else>
          <payment v-if="orderDetail && JSON.stringify(orderDetail) != '{}'" @nextHandle="nextHandle" :buyType="buyType" @goBack="goBack" :price="orderDetail.amount" :isContinuePay="true" :continuePayParam="{orderId: orderDetail.payOrderId, createChannelType: openType}" :btnText="payResultText" :yjmchReturnUrl="yjmchReturnUrl">
            <text class="_text">立即支付</text>
          </payment>
        </view>
      </view>
      <!--兑换码使用说明-->
      <view class="dhm-box" v-if="isShowGifBox">
        <view class="box-content">
          <view class="close" @click="closeDhmBox"><image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-close.png'"></image></view>
          <view class="title">兑换码使用说明</view>
          <image class="img-gif" :src="imgPrefix + '/static/operateSteps/portalH5/pages/dhm.gif'"></image>
          <view class="btn-close" @click="closeDhmBox">我懂了</view>
        </view>
      </view>
      <!--end-->
    </view>
    <pay-result v-if="isShowPayResult" @closeHandle="closeHandle" @goNextHandle="nextHandle" @goBack="goBack" :payReturnMsg="payReturnMsg" :btnText="payResultText" :buyType="buyType" :appointmentTime="appointmentTime">
    </pay-result>
    
  </view>
</template>

<script>
  import { navigateTo, debounce } from '@/utils/util'
  import navBar from '@/components/nav-bar'
  import payment from '@/components/payment'
  import payResult from '@/components/pay-result'
  export default {
    components: {
      navBar,
      payment,
      payResult
    },
    data() {
      return {
        title: '解锁报告',
        imgPrefix: this.$imgPrefix,
        isPad: this.$pad,
        currentTypeIndex: 0,
        currentTypeValue: {},
        platform: this.$openType,
        payType: [],
        isShowErrorTip: false,
        errorTip: '',
        codeValue: '',
        // orderId: '',
        payOrderId: '',
        userInfo: {},
        orderDetail: {},
        openType: this.$openType,
        yjmchReturnUrl: '/pages/pre-pay/index',
        payResultText: '训练',
        exchangeCodeStatus: 1,
        orderType: '', // 2=>免单支付
        isShowPayResult: false,
        payReturnMsg: {},
        appointmentTime: '',
        buyType: '',
        isHuiXiaUser: false,
        isShowGifBox: false
      }
    },
    onLoad(options) {
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
      // this.orderId = options.id ? options.id : ''
      this.orderType = options.orderType ? options.orderType : ''
      this.payOrderId = options.payOrderId ? options.payOrderId : ''
      this.isHuiXiaUser = options.huiXiaUser ? true : false
      if (this.isHuiXiaUser) {
        this.isShowGifBox = true
      }
      this.getOrderDetail()
      this.queryExchangeCodeStatus()
    },
    mounted() {
      this.initPayType()
    },
    onShow() {
      getApp().globalData.canMounted = true
    },
    methods: {
      initPayType() {
        // 判断当前环境
        let payType = []
        if (this.isPad) {
          // pc跟pad
          // this.payType[0].isShow = false
          payType = [
            {
              icon: this.$imgPrefix + '/static/operateSteps/portalH5/pages/pre-pay-img-4-v3.png',
              name: '微信支付',
              value: 2
            },
            {
              icon: this.$imgPrefix + '/static/operateSteps/portalH5/pages/pre-pay-img-5-v3.png',
              name: '支付宝支付',
              value: 3
            }
          ]
        } else {
          if (this.platform == 'H5') {
            //this.payType[2].isShow = false
            if (this.$isWechat) {
              // this.payType[0].isShow = false
              payType = [
                {
                  icon: this.$imgPrefix + '/static/operateSteps/portalH5/pages/pre-pay-img-4-v3.png',
                  name: '微信支付',
                  value: 2
                }
              ]
            } else {
              // this.payType[1].isShow = false
              payType = [
                {
                  icon: this.$imgPrefix + '/static/operateSteps/portalH5/pages/pre-pay-img-6-v3.png',
                  name: '普通支付',
                  value: 1
                }
              ]
            }
          } else if (this.platform == 'APPLET') {
            payType = [
              {
                icon: this.$imgPrefix + '/static/operateSteps/portalH5/pages/pre-pay-img-4-v3.png',
                name: '微信支付',
                value: 2
              }
            ]
          } else if (this.platform == 'APP') {
            payType = [
              {
                icon: this.$imgPrefix + '/static/operateSteps/portalH5/pages/pre-pay-img-6-v3.png',
                name: '普通支付',
                value: 1
              }
            ]
          }
        }
        payType.push({
          icon: this.$imgPrefix + '/static/operateSteps/portalH5/pages/pre-pay-img-3-v3.png',
          name: '兑换码',
          value: 4
        })
        this.payType = payType
        this.currentTypeValue = this.payType[this.currentTypeIndex]
      },
      getOrderDetail() {
        this.$request({
          url: '/gw/h5/v1/front/order/detail',
          method: 'get',
          data: {
            token: this.userInfo.token,
            payOrderId: this.payOrderId
          }
        }).then(res => {
          if (res.status === 1000) {
            this.orderDetail = res.data ? res.data : {}
            switch(res.data.businessType) {
              case '2209231329175690029': 
                this.payResultText = '咨询'
                this.buyType = '3'
                this.title = '咨询专家'
                break
              case '2210081722147310027':
                this.payResultText = '训练'
                this.buyType = '5'
                this.title = res.data.subject
                break
              case '2210081722239380029':
                this.payResultText = '评估'
                this.buyType = '2'
                this.title = '认知评估'
                break
              case '2210081722313010031':
                this.payResultText = '测评'
                this.buyType = '1'
                this.title = '解锁报告'
                break
              case '2210130902390810060':
                this.title = '健脑运动年度会员'
                this.buyType = '4'
                this.payResultText = '锻炼'
                break
              case '2210130902263070058':
                this.title = '趣味运动年度会员'
                this.buyType = '6'
                this.payResultText = '锻炼'
                break
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
      nextHandle() {
        switch(this.orderDetail.businessType) {
          case '2209231329175690029':
            // 咨询专家
            this.goHealthConsulting(this.orderDetail.payOrderId)
            break
          case '2210081722147310027':
            // 数字疗法
            this.goCognitiveTraining(this.orderDetail)
            break
          case '2210081722239380029':
            // 认知评估（人工评估）
            this.goAppointmentDetail()
            break
          case '2210081722313010031':
            // 认知障碍筛查
            this.goEvalution(this.orderDetail.payOrderId)
            break
        }
      },
      closeHandle() {
        // 返回首页
        uni.switchTab({
          url: '/pages/index/index'
        })
      },
      closeDialog() {
        this.isShowPayResult = false
      },
      goBack() {
        // 健脑运动|趣味锻炼
        if (this.orderDetail.businessType == '2210130902263070058') {
          uni.redirectTo({
            url: '/pages/exercise/list'
          })
        } else {
          uni.redirectTo({
            url: '/pages/micromotion/list'
          })
        }
        
      },
      payFreeHandle() {
        // 免单，无需重新支付
        // 兑换成功
        this.isShowPayResult = true
        this.payReturnMsg = {
          payRes: true,
          payOrderId: this.orderDetail.payOrderId
        }
        if (this.orderDetail.businessType == '2209231329175690029' || this.orderDetail.businessType == '2210081722239380029') {
          let appointTime = JSON.stringify(this.businessParams)
          this.appointmentTime = `${appointTime.dayStr} ${appointTime.scheduleStartTime}`
          uni.setStorageSync('reAppointmentTime', this.appointmentTime)
        }
      },
      exchangePayHandle: debounce(function() {
        // 兑换码支付
        let isMobile = ''
        let exchangePlatform = '2'
        // #ifdef H5
        isMobile = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch
        if (isMobile) {
          exchangePlatform = this.$pad ? '4' : '2'
        } else {
          exchangePlatform = '5'
        }
        // #endif
        // #ifdef MP
        exchangePlatform = this.$pad ? '3' : '1'
        // #endif
        // #ifdef APP-PLUS
        uni.getSystemInfo({
          success: (res) => {
            if (res.platform == 'ios') {
              exchangePlatform = '7'
            } else {
              exchangePlatform = '6'
            }
          }
        })
        // #endif
        if (!this.codeValue) {
          this.isShowErrorTip = true
          this.errorTip = '兑换码不能为空'
          return
        }
        this.$request({
          url: '/gw/h5/v1/front/exchangeCode/submitExchange',
          method: 'post',
          data: {
            token: this.userInfo.token,
            exchangeCode: this.codeValue,
            exchangePlatform,
            payOrderId: this.orderDetail.payOrderId
          }
        }).then(res => {
          console.log(res)
          if (res.status === 1000) {
            // 兑换成功
            this.isShowPayResult = true
            this.payReturnMsg = {
              payRes: true,
              payOrderId: this.orderDetail.payOrderId
            }
            if (this.orderDetail.businessType == '2209231329175690029' || this.orderDetail.businessType == '2210081722239380029') {
              let appointTime = JSON.stringify(this.businessParams)
              this.appointmentTime = `${appointTime.dayStr} ${appointTime.scheduleStartTime}`
              uni.setStorageSync('reAppointmentTime', this.appointmentTime)
            }
            // this.nextHandle()
          } else if (res.status === 80001 || res.status === 80006) {
            // 兑换码置为不可用状态
            this.exchangeCodeStatus = 2
            this.errorTip = res.msg
            this.isShowErrorTip = true
          } else {
            this.errorTip = res.msg
            this.isShowErrorTip = true
          }
        })
      }, 1000, true),
      // 跳转研一训练
      goCognitiveTraining(payOrderId) {
        let routes = getCurrentPages() //获取加载的页面
        let curRoute = routes[routes.length - 1].route //获取当前页面的对象
        let backUrl = encodeURIComponent(`/${curRoute}?specailBack=1`)
        getApp().goCognitiveTraining({
          token: this.userInfo.token,
          isNeedLandscape: 'yes',
          redirectUrl: backUrl,
          payOrderId,
        })
      },
      // 跳转研一测评
      goEvalution(payOrderId) {
        if (this.userInfo.info.birthYear && this.userInfo.info.education) {
          // 继续评估，不用再去填写资料
          getApp().goEvalution({
            token: this.userInfo.token,
            requestType: 2,
            payOrderId,
            backType: 2
          })
        } else {
          // 未填写资料，先填写资料
          navigateTo('/pages/evaluation/sort?payOrderId='+payOrderId)
        }
      },
      // 跳转研二健康咨询
      goHealthConsulting(payOrderId) {
        getApp().goHealthConsulting({
          payOrderId,
          token: this.userInfo.token,
          type: 1
        })
      },
      // 跳转研二人工评估
      goAppointmentDetail() {
        getApp().goAppointmentDetail({
          token: this.userInfo.token,
          type: 2,
          cameraPermission: true
        })
      },
      choosePayType(item, index) {
        if (item.value == 4 && this.exchangeCodeStatus == 2) {
          return
        }
        this.currentTypeIndex = index
        this.currentTypeValue = item
        this.deleteCodeValue()
        this.isShowErrorTip = false
      },
      deleteCodeValue() {
        this.codeValue = ''
      },
      queryExchangeCodeStatus() {
        this.$request({
          url: '/gw/h5/v1/front/exchangeCode/exchangeCodeStatus',
          method: 'get',
          data: {
            token: this.userInfo.token
          }
        }, false).then(res => {
          if (res.status === 1000) {
            this.exchangeCodeStatus = res.data.status
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }) 
      },
      closeDhmBox() {
        this.isShowGifBox = false
      },
      showGifBox() {
        this.isShowGifBox = true
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
    padding: 0 13.75rpx 18.75rpx 13.75rpx;
    background-color: #F3F4F5;
    min-height: calc(100vh - 47rpx);
    .sub-title {
      font-size: 28.75rpx;
      font-weight: bold;
      color: rgba(0,0,0,0.86);
      padding: 20rpx 0;
      text-align: center;
    }
    .price {
      padding: 0rpx 35rpx 22.5rpx 35rpx;
      box-sizing: border-box;
      background-color: #fff;
      border-radius: 12.5rpx;
      .price-top {
        border-bottom: 1px solid #E5E5E5;
        .item {
          padding: 22.5rpx 0 21.25rpx 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          &>view:nth-child(1) {
            font-size: 22.5rpx;
          }
          &>view:nth-child(2) {
            font-weight: bold;
            &>text:nth-child(1) {
              font-size: 17.5rpx;
            }
            &>text:nth-child(2) {
              font-size: 22.5rpx;
            }
            
          }
          .discount {
            color: #F9411B;
          }
        }
        
      }
      .price-bottom {
        padding-top: 23.75rpx;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 20rpx;
        .discount {
          padding-right: 15rpx;
        }
        .count {
          display: flex;
          align-items: center;
          &>view:nth-child(2) {
            font-size: 30rpx;
            font-weight: 600;
            padding-left: 6.25rpx;
            &>text:nth-child(1) {
              font-size: 22.5rpx;
            }
          }
        }
      }
    }
    .pay-type {
      background-color: #fff;
      border-radius: 12.5rpx;
      margin-top: 13.75rpx;
      .item {
        display: flex;
        
        justify-content: space-between;
        align-items: center;
        .item-icon {
          width: 32.5rpx;
          height: 32.5rpx;
          flex: 0 0 32.5rpx;
          padding-left: 35rpx;
        }
        .item-right {
          display: flex;
          padding: 26.25rpx 35rpx 26.25rpx 0;
          flex: 1;
          justify-content: space-between;
          align-items: center;
          font-size: 22.5rpx;
          border-bottom: 1px solid #E5E5E5;
          &>view:nth-child(1) {
            padding-left: 18.75rpx;
            font-size: 22.5rpx;
            .sort {
              color: #666;
              font-size: 17.5rpx;
            }
          }
          image {
            width: 25rpx;
            height: 25rpx;
          }
          
        }
      }
      .item:last-child {
        .item-right {
          border-bottom: none;
        }
      }
      .item-disabled {
        .item-icon {
          -webkit-filter: grayscale(100%);
          -moz-filter: grayscale(100%);
          -ms-filter: grayscale(100%);
          -o-filter: grayscale(100%);
          filter: grayscale(100%);
          filter: gray;
        }
        .item-right {
          color: #ccc;
          &>view:nth-child(1) {
            .sort {
              color: #ccc;
            }
          }
        }
      }
    }
    .exchange-code {
      margin-top: 20rpx;
      &>view:nth-child(1) {
        font-size: 20rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        &>text:nth-child(2) {
          font-size: 17.5rpx;
          color: #30B08F;
          text-decoration: underline;
        }
      }
      &>view:nth-child(2) {
        margin-top: 10rpx;
        position: relative;
        .input-box {
          width: 100%;
          background-color: #fff;
          border-radius: 12.5rpx;
        }
        .input {
          padding: 0rpx 0rpx 0rpx 17.5rpx;
          width: 85%;
          height: 67.5rpx;
          font-size: 30rpx;
          line-height: 67.5rpx;
          box-sizing: border-box;
          font-weight: bold;
        }
        .uni-input-placeholder {
          font-size: 22.5rpx;
          font-weight: normal;
          color: #ccc;
        }
        .delete {
          padding: 15rpx;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: 15rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
          image {
            width: 37.5rpx;
            height: 37.5rpx;
          }
        }
      }
      .error-tip {
        display: flex;
        align-items: center;
        color: #E22525;
        font-size: 20rpx;
        margin-top: 15rpx;
        image {
          width: 25rpx;
          height: 25rpx;
          margin-right: 10rpx;
        }
      }
    }
    .btn {
      font-size: 22.5rpx;
      
      font-weight: bold;
      width: 441.25rpx;
      height: 62.5rpx;
      
      text-align: center;
      border-radius: 31.25rpx;
      margin: 37.5rpx auto 0 auto;
      background-color: #43C9A7;
      ._text {
        display: block;
        width: 100%;
        height: 62.5rpx;
        line-height: 62.5rpx;
        color: #fff;
      }
    }
    .dhm-box {
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.3);
      position: fixed;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99;
      .box-content {
        width: 376.25rpx;
        height: 365rpx;
        background-color: #fff;
        border-radius: 12.5rpx;
        position: relative;
        .close {
          padding: 12.5rpx;
          position: absolute;
          top: 0;
          right: 0;
          image {
            width: 37.5rpx;
            height: 37.5rpx;
          }
        }
        .title {
          font-size: 25rpx;
          font-weight: bold;
          text-align: center;
          padding: 30rpx 0 25rpx 0;
        }
        .img-gif {
          width: 306.25rpx;
          height: 178.75rpx;
          display: block;
          margin: 0 auto;
        }
        .btn-close {
          width: 158.75rpx;
          height: 52.5rpx;
          border-radius: 26.25rpx;
          border: 1px solid #C9C9C9;
          text-align: center;
          line-height: 52.5rpx;
          font-size: 21.25rpx;
          color: #333;
          margin: 25rpx auto 0 auto;
        }
      }
    }
  }
  
  @media screen and (max-width: 500px) {
    .container {
      padding: 0rpx 22rpx 30rpx 22rpx;
      min-height: calc(100vh - 46px);
      .sub-title {
        font-size: 46rpx;
        font-weight: bold;
        padding: 40rpx 0;
      }
      .price {
        padding: 0rpx 36rpx 36rpx 36rpx;
        border-radius: 20rpx;
        .price-top {
          .item {
            padding: 36rpx 0 34rpx 0;
            &>view:nth-child(1) {
              font-size: 36rpx;
              max-width: 469rpx;
            }
            &>view:nth-child(2) {
              &>text:nth-child(1) {
                font-size: 28rpx;
              }
              &>text:nth-child(2) {
                font-size: 36rpx;
              }
            }
          }
          
        }
        .price-bottom {
          padding-top: 38rpx;
          font-size: 32rpx;
          .discount {
            padding-right: 24rpx;
          }
          .count {
            &>view:nth-child(2) {
              font-size: 48rpx;
              font-weight: bold;
              padding-left: 6rpx;
              &>text:nth-child(1) {
                font-size: 36rpx;
              }
            }
          }
        }
      }
      .pay-type {
        border-radius: 20rpx;
        margin-top: 22rpx;
        .item {
          .item-icon {
            width: 52rpx;
            height: 52rpx;
            flex: 0 0 52rpx;
            padding-left: 36rpx;
          }
          .item-right {
            padding: 44rpx 36rpx 42rpx 0;
            &>view:nth-child(1) {
              padding-left: 18.75rpx;
              font-size: 36rpx;
              .sort {
                font-size: 32rpx;
              }
            }
            image {
              width: 40rpx;
              height: 40rpx;
            }
            
          }
        }
      }
      .exchange-code {
        margin-top: 22rpx;
        &>view:nth-child(1) {
          font-size: 32rpx;
          &>text:nth-child(2) {
            font-size: 28rpx;
          }
        }
        &>view:nth-child(2) {
          margin-top: 16rpx;
          .input-box {
            
          }
          .input {
            width: 100%;
            padding: 0rpx 0rpx 0rpx 30rpx;
            height: 108rpx;
            line-height: 108rpx;
            font-size: 48rpx;
            border-radius: 20rpx;
            
          }
          .uni-input-placeholder {
            font-size: 34rpx;
            font-weight: normal;
          }
          .delete {
            padding: 15rpx;
            right: 10rpx;
            image {
              width: 38rpx;
              height: 38rpx;
            }
          }
        }
        .error-tip {
          font-size: 30rpx;
          margin-top: 12rpx;
          image {
            width: 32rpx;
            height: 32rpx;
            margin-right: 8rpx;
          }
        }
      }
      .btn {
        font-size: 36rpx;
        width: 706rpx;
        height: 100rpx;
        border-radius: 50rpx;
        margin: 54rpx auto 0 auto;
        ._text {
          height: 100rpx;
          line-height: 100rpx;
        }
      }
      .dhm-box {
        .box-content {
          width: 602rpx;
          height: 584rpx;
          border-radius: 20rpx;
          .close {
            padding: 10rpx;
            image {
              width: 60rpx;
              height: 60rpx;
            }
          }
          .title {
            font-size: 40rpx;
            padding: 48rpx 0 42rpx 0;
          }
          .img-gif {
            width: 490rpx;
            height: 286rpx;
          }
          .btn-close {
            width: 254rpx;
            height: 84rpx;
            border-radius: 42rpx;
            line-height: 84rpx;
            font-size: 34rpx;
            margin: 40rpx auto 0 auto;
          }
        }
      }
    }
  }
</style>