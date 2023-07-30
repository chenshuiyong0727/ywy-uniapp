<template>
  <view>
   
    <nav-bar title="咨询专家"></nav-bar>
   
    <view class="container">
      <form-step 
        ref="step" 
        :buyParams="buyParams" 
        :schedulingDateData="schedulingDateData" 
        :appointType="1"
        :reAppointFlag="+reAppointFlag"
        :rePayOrderId="rePayOrderId"
        :createOrderType="createOrderType"
      ></form-step>
    </view>
    <!--侧边栏-->
    <fab v-if="isShowFab" :isOpenFabMenu="isPad ? true : false"></fab>
    <!--end 侧边栏-->
  </view>
</template>

<script>
  import fab from '@/components/fab'
  import navBar from '@/components/nav-bar'
  import formStep from '@/components/make-an-appoint/form-step'
 
  import {mixin} from '@/mixin/mixin'
  export default {
    mixins:[mixin],
    components: {
      navBar,
      formStep,
      fab
    },
    data() {
      return {
        isPad: this.$pad,
        schedulingDateData: null,
        buyParams: {},
        reAppointFlag: -1,
        rePayOrderId: '',
        createOrderType: '1'
      }
    },
    onLoad(options) {
      if (options) {
        this.buyParams = options
        this.reAppointFlag = options.reAppointFlag ? options.reAppointFlag : -1
        this.createOrderType = options.createOrderType ? options.createOrderType : '1'
        this.rePayOrderId = options.rePayOrderId ? options.rePayOrderId : ''
      }
    },
    onShow() {
      // this.$nextTick(() => {
      //   this.$refs.step.setSwiperCurr(0, 'step-begin')
      // })
      setTimeout(() => {
        this.$refs.step.setSwiperCurr(0, 'step-begin')
      }, 100)
    },
    mounted() {
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
      // this.getSchedulingTime()
      console.log('asdfas')
      
    },
    methods: {
      getSchedulingTime() {
        this.$request({
            url: '/gw/h5/v1/schedule/doctorSourcce',
            method: 'get',
            data: {
              token: this.userInfo.token,
              doctorId: this.buyParams.mouldId,
            },
          },
          false
        ).then((res) => {
          if (res.status === 1000) {
            this.schedulingDateData = res.data ? res.data : {}
          }
        })
      },
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
  
  /* #ifdef MP */
  @media screen and (min-width: 768px) {
    
    // .container {
    //   transform: scale(1);
    //   transform-origin: top center;
     
    // }
  }
  /* #endif */
</style>
