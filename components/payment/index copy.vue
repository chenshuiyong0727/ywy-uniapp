<template>
  <view class="payment-container">
    <view @click="payPreHandle">
      <slot></slot>
    </view>

    <!--付款二维码弹窗-->
    <view class="pay-qrimg" v-if="isShowPayEwm">
      <view class="content">
        <view class="close">
          <uni-icons class="icon-close" type="closeempty" size="25" color="#333" @click="closeCreateOrder"></uni-icons>
        </view>
        <view class="top-msg">
          <view>请使用【微信】或者【支付宝】</view>
          <view>扫描下方付款二维码</view>
          <view class="price">支付金额：{{price / 100}}元</view>
        </view>
        
        <view class="code"><uqrcode ref="uqrcode" canvas-id="qrcode" :auto="ewmConfig.auto" type="2d" sizeUnit="rpx" :value="ewmConfig.val" :size="ewmConfig.size" :options="{ margin: 15 }"></uqrcode></view>
        <view class="desc">如果您已支付，请耐心等待，平台将尽快确认您的支付信息</view>
      </view>
    </view>
    <!--end-->
    
    <pay-result v-if="isShowPayResult" @closeHandle="closeHandle" @goNextHandle="goNextHandle" @payAgainHandle="payAgainHandle" @goBack="goBack" :payReturnMsg="payReturnMsg" :btnText="btnText" :buyType="buyType" :appointmentTime="appointmentTime">
    </pay-result>
    <address-form @touchmove.stop.prevent="preventTouchMove" v-if="isShowAddress" ref="address" :addressFlag="addressFlag" @closeAddressBox="closeAddressBox" @getAddressFormVal="getAddressFormVal"></address-form>
    
  </view>
</template>

<script>
  import { envSetting } from '@/utils/env.js'
  import payResult from '@/components/pay-result'
  // #ifdef MP-WEIXIN
  import { yjpay } from '@/utils/yjpay.js'
  // #endif
  import { navigateTo, pollIntervalManager, getQueryString } from '@/utils/util'
  import addressForm from '@/components/city/address'
  export default {
    components: {
      payResult,
      addressForm
    },
    props: {
      isContinuePay: {
        type: Boolean,
        default: false // 是否继续支付功能
      },
      continuePayParam: {
        type: Object,
        default: () => {}
      },
      price: {
        type: String,
        default: '1'
      },
      goodsId: {
        type: String,
        default: '1'
      },
      addressFlag: {
        type: Number,
        default: -1 // -1=>不需要填写地址 1=>需要填写地址(租赁) 2=>需要填写地址(附带)
      },
      buyType: {
        type: String,
        default: '1'  // 1=>智能评估购买 5=>训练购买  2=>人工评估购买(需要填写表单预约时间) 3=>服务咨询购买(需要填写表单预约时间) 4=>服务包购买
      },
      businessParams: { // buyType为2或3时
        type: Object,
        default: () => {
          return {}
        }
      },
      agreementChecked: { //buyType为4时，判断协议是否勾选
        type: Boolean,
        default: false
      },
      btnText: {
        type: String,
        default: '评估'
      },
      rePayOrderId: {
        type: String,
        default: '' // 订单为重新预约的订单时 传递
      },
      createOrderType: {
        type: String,
        default: '1' // 1=>普通订单 2=>重新预约订单
      },
      yjmchReturnUrl: {
        type: String,
        default: '' // 支付成功后H5移动端回跳地址
      }
    },
    data() {
      return {
        isCanPay: true,
        payOrderId: '',
        isShowPayEwm: false,
        isShowPayResult: false,
        ewmConfig: {
          val: '', // 要生成的二维值 可以跳转一个新界面
          size: 220, // 二维码大小
          auto: false, // 是否数据发生改变自动重绘
          
        },
        payReturnMsg: {},
        appointmentTime: '',
        isPad: this.$pad,
        downTime: 5,
        isShowAddress: false,
        addressId: ''
      }
    },
    mounted() {
      
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {},
      this.payCallback()
    },
    destroyed() {
      console.log('destroyed')
      // 组件销毁时，取消轮询
      if (getApp().globalData.intervalManager) {
        getApp().globalData.intervalManager.stop()
      }
      
    },
    methods: {
      preventTouchMove() {},
      payCallback() {
        if (!this.isPad) {
          
          if (!getApp().globalData.canMounted) return
          getApp().globalData.canMounted = false
          let payStatus = ''
          let payOrderId = ''
          // #ifdef H5
          payStatus = getQueryString(window.location.href, 'status')
          payOrderId = getQueryString(window.location.href, 'payOrderId')
          // #endif
          // #ifdef APP-PLUS
          let routes = getCurrentPages()
          let curRoute = routes[routes.length - 1].route
          let curParam = routes[routes.length - 1].options || routes[routes.length - 1].$route.query
          payStatus = curParam.status
          payOrderId = curParam.payOrderId
          // #endif
          if (payStatus) {
            if (payStatus == 2) {
              // 2 => 支付成功
              this.payReturnMsg = {
                payRes: true,
                payOrderId
              }
              this.isShowPayResult = true
            } else {
              // this.payReturnMsg = {
              //   payRes: false,
              //   payOrderId
              // }
              this.$request({
                url: '/gw/order/pay/checkOrder',
                method: 'get',
                data: {
                  payOrderId,
                  userId: this.userInfo.userId,
                  token: this.userInfo.token
                }
              }, false).then(res => {
                if (res.data == 2) {
                  // 支付成功
                  this.payReturnMsg = {
                    payRes: true,
                    payOrderId
                  }
                  this.isShowPayResult = true
                } else {
                  this.payReturnMsg = {
                    payRes: false,
                    payOrderId
                  }
                  this.isShowPayResult = true
                }
              })
            }
          }
        }
      },
      closeAddressBox() {
        this.isShowAddress = false
        let uniPlatform = uni.getSystemInfoSync().uniPlatform
        if (uniPlatform == 'web') {
          var mo = function(e) {
              e.preventDefault()
          };
          document.body.style.overflow = '' //出现滚动条
          document.removeEventListener("touchmove", mo, false)
        }
      },
      getAddressFormVal(addressFormVal) {
        // 提交地址表单
        this.$request({
          url: '/gw/h5/v1/front/user/address/submit',
          method: 'post',
          data: {
            ...addressFormVal,
            userId: this.userInfo.userId,
            token: this.userInfo.token
          }
        }).then(res => {
          if (res.status == 1000) {
            this.addressId = res.data
            this.createOrder()
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      payPreHandle() {
        getApp().loginStatus().then(() => {
          if (!this.isContinuePay) {
            // 新建订单
            if (this.addressFlag != -1) {
              // 需要先填写地址
              this.isShowAddress = true
              this.$nextTick(() => {
                this.$refs.address.isShowAddressSelect = true
                setTimeout(() => {
                 this.$refs.address.isShowContentFlag = true  
                }, 10)
              })
              let uniPlatform = uni.getSystemInfoSync().uniPlatform
              // H5禁止滚动
              if (uniPlatform == 'web') {
                var mo = function(e) {
                  e.preventDefault()
                }
                document.body.style.overflow = 'hidden'
                document.addEventListener("touchmove", mo, false) //禁止页面滑动
              }
            } else {
              // 不需要填写地址
              this.createOrder()
            }
          } else {
            // 继续支付
            this.continuePayHandle()
          }
          
        })
      },
      createOrder() {
        if (this.buyType == 2 || this.buyType == 3) {
          // 校验信息填写表单
          if (this.buyType == 3 && this.businessParams.visitType == 10008 && !this.businessParams.sid) {
            return uni.showToast({
              title: '请选择认知报告',
              icon: 'none',
              duration: 2000
            })
          }
          if (!this.businessParams.userName) {
            return uni.showToast({
              title: '请填写姓名',
              icon: 'none',
              duration: 2000
            })
          } else if (this.businessParams.gender !== 0 && this.businessParams.gender !== 1) {
            return uni.showToast({
              title: '请选择性别',
              icon: 'none',
              duration: 2000
            })
          } else if (!this.businessParams.birthDay) {
            return uni.showToast({
              title: '请选择出生日期',
              icon: 'none',
              duration: 2000
            })
          } else if (!this.businessParams.education) {
            return uni.showToast({
              title: '请选择学历',
              icon: 'none',
              duration: 2000
            })
          } else if (!this.businessParams.dayStr) {
            return uni.showToast({
              title: '请选择咨询时间',
              icon: 'none',
              duration: 2000
            })
          } if (!this.businessParams.scheduleStartTime) {
            return uni.showToast({
              title: '请选择咨询时间段',
              icon: 'none',
              duration: 2000
            })
          }
        }
        let queryParam = {
          token: this.userInfo.token,
          userId: this.userInfo.userId,
          amount: this.price,
          createChannelType: this.$openType == 'H5' ? this.$pad ? 'IPAD' : 'H5' : this.$openType,
          remarks: '',
          goodsId: this.goodsId,
          createOrderType: this.createOrderType
        }
        if (this.addressId) {
          // 如果有收获地址
          queryParam.addressId = this.addressId
        }
        if (this.buyType == 2 || this.buyType == 3) {
          queryParam.businessParams = JSON.stringify(this.businessParams)
          this.appointmentTime = `${this.businessParams.dayStr} ${this.businessParams.scheduleStartTime}`
          uni.setStorageSync('reAppointmentTime', this.appointmentTime)
        }
        if (this.rePayOrderId) {
          // 订单为重新预约的订单时 传递
          queryParam.rePayOrderId = this.rePayOrderId
        }
        if (this.buyType == 4 && !this.agreementChecked) {
          // 服务包购买
          return uni.showToast({
            title: '请勾选服务协议',
            icon: 'none',
            duration: 2000
          })
        }
        // 支付失败时，重新支付需要用到
        
        if (!this.isCanPay) return
        this.isCanPay = false
        if (getApp().globalData.intervalManager) {
          getApp().globalData.intervalManager.stop()
        }
        this.$request({
          url: '/gw/order/pay/createOrder',
          method: 'post',
          data: queryParam
        }).then(res => {
          this.isCanPay = true
          if (res.status === 1000) {
            this.payOrderId = res.data.payOrderId
            
            if (res.data.orderType == 2) {
              // 支付成功(免单转态，不走支付流程)
              
              this.isShowPayResult = true
              this.payReturnMsg = {
                payRes: true,
                payOrderId: this.payOrderId
              }
              
              return 
            }
            
            this.payHandle(res.data.payOrderId, res.data.payUrl, res.data.payParams)
            
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
        
        // this.$emit('closeGuidTip')
        
      },
      
      continuePayHandle() {
        this.$request({
          url: '/gw/order/pay/continuePay',
          method: 'post',
          data: this.continuePayParam
        }).then(res => {
          if (res.status === 1000) {
            this.payHandle(res.data.payOrderId, res.data.payUrl, res.data.payParams)
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      
      payHandle(payOrderId, payUrl, AppletPayParams) {
        // #ifdef H5 || APP-PLUS
        if (this.$pad) {
          this.ewmConfig.val = payUrl
          this.isShowPayEwm = true
          // 轮询支付状态接口
          let count = 0
          getApp().globalData.intervalManager = pollIntervalManager((stop) => {
            this.$request({
              url: '/gw/order/pay/checkOrder',
              method: 'get',
              data: {
                payOrderId,
                userId: this.userInfo.userId,
                token: this.userInfo.token
              }
            }, false).then(res2 => {
              if (count >= 900 || res2.data != 1) {
                stop()
                this.isShowPayEwm = false
                if (res2.data == 2) {
                  // 支付成功
                  
                  this.isShowPayResult = true
                  this.payReturnMsg = {
                    payRes: true,
                    payOrderId: this.payOrderId
                  }
                  
                } else {
                  this.isShowPayResult = true
                  this.payReturnMsg = {
                    payRes: false,
                    payOrderId: this.payOrderId
                  }
                }
              } else {
                count += 1
              }
            })
          }, 1000)
          getApp().globalData.intervalManager.start()
        } else {
          let routes = getCurrentPages()
          let curRoute = routes[routes.length - 1].route
          let curParam = routes[routes.length - 1].options || routes[routes.length - 1].$route.query
          
          let param = ''
          for (let key in  curParam) {
            if (key != 'payOrderId' && key != 'status' && key != 'mchOrderNo') {
              param += '&' + key + '=' + curParam[key]
            }
          }
          // #ifdef H5
          let url = encodeURIComponent(`${location.href.split('?')[0]}?${param}`)
          // if (this.buyType == 2) {
          //   // 认知评估
          //   url = encodeURIComponent(`${location.href.split('/pages')[0]}/pages/evaluation/detail?goodsId=${this.goodsId}&buyType=2`)
          // } else
          if (this.yjmchReturnUrl) {
            url = encodeURIComponent(`${location.href.split('/pages')[0]}${this.yjmchReturnUrl}`)
          } else if (this.buyType == 3) {
            // 认知评估
            url = encodeURIComponent(`${location.href.split('/pages')[0]}/pages/consulting-service/index`)
          }
          window.location.href = `${payUrl}&yjmchReturnUrl=${url}`
          // #endif
          // #ifdef APP-PLUS
          let appUrl = encodeURIComponent(`${envSetting.domainName}/${curRoute}?${param}`)
          // if (this.buyType == 2) {
          //   // 人工评估
          //   appUrl = encodeURIComponent(`${envSetting.domainName}/pages/evaluation/detail?goodsId=${this.goodsId}&buyType=2`)
          // } else 
          if (this.yjmchReturnUrl) {
            appUrl = encodeURIComponent(`${envSetting.domainName}${this.yjmchReturnUrl}`)
          } else if (this.buyType == 3) {
            // 人工咨询
            appUrl = encodeURIComponent(`${envSetting.domainName}/pages/consulting-service/index`)
          }
          navigateTo('/pages/web-view/web-view', {
            link: `${payUrl}&yjmchReturnUrl=${appUrl}`,
            isNeedLandscape: 'no'
          })
          // #endif
        }
        // #endif
        // #ifdef MP-WEIXIN
        let params = AppletPayParams
        yjpay(params, (res) => {
          
          this.isShowPayResult = true
          this.payReturnMsg = {
            payRes: true,
            payOrderId: this.payOrderId
          }
          
        }, (err) => {
          this.isShowPayResult = true
          
          this.payReturnMsg = {
            payRes: false,
            payOrderId: this.payOrderId
          }
        })
        // #endif
      },
      
      closeCreateOrder() {
        this.isShowPayEwm = false
        getApp().globalData.intervalManager.stop()
      },
      goNextHandle() {
        this.isShowPayResult = false
        this.$emit('nextHandle', this.payReturnMsg)
      },
      payAgainHandle() {
        this.isShowPayResult = false
        if (!this.isContinuePay) {
          // 重新新建订单支付
          this.createOrder()
        } else {
          // 重新继续支付
           this.continuePayHandle()
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
        this.$emit('closePayResultHandle', this.payReturnMsg)
        // #endif
        
        // #ifdef APP-PLUS
        if (param) {
          url = `/${curRoute}?${param}&specailBack=1`
        } else {
          url = `/${curRoute}?specailBack=1`
        }
        // 重定向url值，防止刷新页面后出现支付结果弹窗
        uni.redirectTo({
          url
        })
        // #endif
        
      },
      goBack() {
        this.isShowPayResult = false
        this.$emit('goBack')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .pay-qrimg {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99;

    .content {
      width: 382.42rpx;
      padding: 17.58rpx 57.14rpx;
      box-sizing: border-box;
      background-color: #fff;
      border-radius: 14.65rpx;

      .close {
        text-align: right;

        .icon-close {
          padding: 7.32rpx;
          margin-right: -43.96rpx;
        }
      }
      .top-msg {
        text-align: center;
        font-size: 17.58rpx;
        font-weight: bold;
        color: #333;
      }

      .price {
        font-size: 21.98rpx;
        color: #DF5C1D;
        padding-top: 13.19rpx;
      }

      .code {
        margin: 0 auto;
        width: 220rpx;
        height: 220rpx;
      }

      .desc {
        font-size: 17.58rpx;
        text-align: center;
        padding-top: 10.99rpx;
        color: #333;
      }
    }
  }
  .pay-pre-style {
    width: 282.05rpx;
    height: 142.86rpx;
    background-color: rgba(0, 0, 0, 0.8);
    border-radius: 14.65rpx;
    position: fixed;
    top: 50%;
    left: 50%;
    margin: -71.06rpx 0 0 -139.93rpx;
    font-size: 21.98rpx;
    font-weight: bold;
    text-align: center;
    color: #fff;
    z-index: 99;
    padding-bottom: 18.32rpx;
    .down-time {
      font-size: 19.05rpx;
      
      padding: 23.44rpx 0 12.45rpx 0;
    }
  }
</style>
