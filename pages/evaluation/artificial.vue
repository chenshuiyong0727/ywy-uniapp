<template>
  <view>
   
    <nav-bar title='认知评估' :backUrl="pageFrom == 'other' ? '/pages/consulting-service/index' : ''" ></nav-bar>
   
    <view class="container">
      <form-step 
        :buyParams="buyParams" 
        :schedulingDateData="schedulingDateData" 
        :appointType="2" 
        :reAppointFlag="+reAppointFlag"
        :rePayOrderId="rePayOrderId"
        :createOrderType="createOrderType"
      ></form-step>
    </view>
   <pay-result v-if="isShowPayResult" @goBack="confirmHandle" @closeHandle="closeHandle" :isShowPayAginBtn="false" buyType="2" :payReturnMsg="payReturnMsg" :appointmentTime="appointTime">
   </pay-result>
   <!--侧边栏-->
   <fab v-if="isShowFab" :isOpenFabMenu="isPad ? true : false"></fab>
   <!--end 侧边栏-->
  </view>
</template>

<script>
  import fab from '@/components/fab'
  import navBar from '@/components/nav-bar'
  import formStep from '@/components/make-an-appoint/form-step'
  import payResult from '@/components/pay-result'
  import {mixin} from '@/mixin/mixin'
  export default {
    mixins:[mixin],
    components: {
      navBar,
      formStep,
      payResult,
      fab
    },
    data() {
      return {
        schedulingDateData: null,
        buyParams: {},
        isPad: this.$pad,
        pageFrom: '',
        payReturnMsg: {},
        isShowPayResult: false,
        reAppointFlag: -1,
        rePayOrderId: '',
        createOrderType: '1',
        appointTime: ''
      }
    },
    onLoad(options) {
      if (options) {
        this.buyParams = options
        this.pageFrom = options.from ? options.from : ''
        this.reAppointFlag = options.reAppointFlag ? options.reAppointFlag : -1
        this.createOrderType = options.createOrderType ? options.createOrderType : '1'
        this.rePayOrderId = options.rePayOrderId ? options.rePayOrderId : ''
      }
    },
    mounted() {
      console.log('asfdasda')
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
      // this.getSchedulingTime()
      // #ifdef H5 || APP-PLUS
      if (!this.$pad) {
        // let payStatus = getQueryString(window.location.href, 'status')
        let routes = getCurrentPages()
        let curRoute = routes[routes.length - 1].route
        let curParam = routes[routes.length - 1].options || routes[routes.length - 1].$route.query
        let payStatus = curParam.status
        let payOrderId = curParam.payOrderId
        console.log('payOrderId',payOrderId)
        if (payStatus) {
          //payStatus存在 => 支付页面回来的
          if (payStatus == 2) {
            // 2 => 支付成功
            this.payReturnMsg = {
              payRes: true,
              payOrderId
            }
            this.appointTime = uni.getStorageSync('reAppointmentTime')
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
                this.appointTime = uni.getStorageSync('reAppointmentTime')
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
      // #endif
    },
    methods: {
      getSchedulingTime() {
        this.$request({
          url: '/gw/h5/v1/schedule/list',
          method: 'get',
          data: {
            token: this.userInfo.token
          }
        }, false).then(res => {
          if (res.status === 1000) {
            this.schedulingDateData = res.data ? res.data : {}
          }
        })
      },
      confirmHandle() {
        this.isShowPayResult = false
        getApp().goAppointmentDetail({
          token: this.userInfo.token,
          type: 2,
          cameraPermission: true
        })
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    width: 100%;
    max-width: 750.02rpx;
    box-sizing: border-box;
    font-size: 21.97rpx;
    color: #333;
    overflow: hidden;
    margin: 0 auto;
  }
  @media screen and (max-width: 500px) {
    .container {
      width: 750rpx;
      max-width: 750rpx;
    }
  }
</style>