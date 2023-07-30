<template>
  <view>
    <nav-bar title='认知障碍筛查' :backUrl="backUrl"></nav-bar>
    <view class="container">
      <block v-if="isPad">
        <image class="img-1" :src="imgPrefix + '/static/operateSteps/evaluation-new2-img-1.png?t=1'"/>
        <image class="img-2" :src="imgPrefix + '/static/operateSteps/evaluation-new2-img-2.png?t=1'"/>
        <image class="img-3" :src="imgPrefix + '/static/operateSteps/evaluation-new2-img-3.png?t=1'"/>
        <image class="img-4" :src="imgPrefix + '/static/operateSteps/evaluation-new2-img-4.png?t=1'"/>
        <image class="img-5" :src="imgPrefix + '/static/operateSteps/evaluation-new2-img-5.png?t=1'"/>
        <image class="img-6" :src="imgPrefix + '/static/operateSteps/evaluation-new2-img-6.png?t=1'"/>
        <image class="img-7" :src="imgPrefix + '/static/operateSteps/evaluation-new2-img-7.png?t=1'"/>
        <image class="img-8-1" :src="imgPrefix + '/static/operateSteps/evaluation-new2-img-8-1.png?t=1'"/>
        <image class="img-8" :src="imgPrefix + '/static/operateSteps/evaluation-new2-img-8.png?t=1'"/>
        <image class="img-9" :src="imgPrefix + '/static/operateSteps/evaluation-new2-img-9.png?t=1'"/>
        <image class="img-10-1" :src="imgPrefix + '/static/operateSteps/evaluation-new2-img-10-1.png?t=1'"/>
        <image class="img-10" :src="imgPrefix + '/static/operateSteps/evaluation-new2-img-10.png?t=1'"/>
        <image class="img-11" :src="imgPrefix + '/static/operateSteps/evaluation-new2-img-11.png?t=1'"/>

      </block>
      <block v-else>
        <image class="img-1" :src="imgPrefix + '/static/operateSteps/mobile-evaluation-new2-img-1.png?t=1'"/>
        <image class="img-2" :src="imgPrefix + '/static/operateSteps/mobile-evaluation-new2-img-2.png?t=1'"/>
        <image class="img-3" :src="imgPrefix + '/static/operateSteps/mobile-evaluation-new2-img-3.png?t=1'"/>
        <image class="img-4" :src="imgPrefix + '/static/operateSteps/mobile-evaluation-new2-img-4.png?t=1'"/>
        <image class="img-5" :src="imgPrefix + '/static/operateSteps/mobile-evaluation-new2-img-5.png?t=1'"/>
        <image class="img-6" :src="imgPrefix + '/static/operateSteps/mobile-evaluation-new2-img-6.png?t=1'"/>
        <image class="img-7" :src="imgPrefix + '/static/operateSteps/mobile-evaluation-new2-img-7.png?t=1'"/>
        <image class="img-8-1" :src="imgPrefix + '/static/operateSteps/mobile-evaluation-new2-img-8-1.png?t=1'"/>
        <image class="img-8" :src="imgPrefix + '/static/operateSteps/mobile-evaluation-new2-img-8.png?t=1'"/>
        <image class="img-9-1" :src="imgPrefix + '/static/operateSteps/mobile-evaluation-new2-img-9-1.png?t=1'"/>
        <image class="img-9-2" :src="imgPrefix + '/static/operateSteps/mobile-evaluation-new2-img-9-2.png?t=1'"/>
        <image class="img-9-3" :src="imgPrefix + '/static/operateSteps/mobile-evaluation-new2-img-9-3.png?t=1'"/>
        <image class="img-10" :src="imgPrefix + '/static/operateSteps/mobile-evaluation-new2-img-10.png?t=1'"/>
      </block>
      <view class="bottom">
        <view class="kf" @click="showKfCode">
          <image src="../../static/images/applet/icon_kefu.png"></image>
          <view>客服咨询</view>
        </view>
        <view class="btm-right">
            <!-- <view :class="[!paySuccess && (!goodsDetail.payStatus || goodsDetail.payStatus == 0) ? '' : 'btn-pg-group']">
              <view v-if="!(!paySuccess && (!goodsDetail.payStatus || goodsDetail.payStatus == 0))" :class="[!paySuccess && (!goodsDetail.payStatus || goodsDetail.payStatus == 0) ? 'btn-buy' : 'btn-buy-get']" @click="goEvaluation">立即解锁</view>
              <view>
                <payment @nextHandle="goNextHandle" @closePayResultHandle="closeHandle" :price="goodsDetail.amount" :goodsId="goodsDetail.goodsId" :addressFlag="+goodsDetail.addressFlag" btnText="评估" buyType="1">
                  <view :class="[!paySuccess && (!goodsDetail.payStatus || goodsDetail.payStatus == 0) ? 'btn-buy' : 'btn-buy-get']">
                    <text>{{goodsDetail.amount / 100 > 0 ? '立即筛查' : '重新筛查'}}</text>
                  </view>
                </payment>
              </view>
            </view> -->
            <view :class="[evaluationData.orderNum >= 1 ? 'btn-pg-group' : '']">
              <view class="btn-unlock btn-common" v-if="evaluationData.orderNum" @click="goDetail">{{evaluationData.lastFastSieve.lockStatus == 1 ? '查看报告' : '立即解锁'}}</view>
              <view>
                <view v-if="goodsDetail.payOrderId" @click="goEvaluation" :class="['btn-evaluation', 'btn-common', evaluationData.orderNum ? '' : 'btn-evaluation-full']"><text>继续筛查</text></view>
                <payment v-else @nextHandle="goNextHandle" @closePayResultHandle="closeHandle" :price="goodsDetail.amount" :goodsId="goodsDetail.goodsId" :addressFlag="+goodsDetail.addressFlag" btnText="评估" buyType="1">
                  <view :class="['btn-evaluation', 'btn-common', evaluationData.orderNum ? '' : 'btn-evaluation-full']"><text>立即筛查</text></view>
                </payment>
              </view>
              
            </view>
        </view>
      </view>
      <!-- <pay-result v-if="isShowPayResult" @closeHandle="closeHandle" @goNextHandle="goNextHandle" :payReturnMsg="payReturnMsg" btnText="评估">
      </pay-result> -->
      <kf-code v-if="isShowKfCode" @closeKfHandle="closeKfHandle" ewmName="znpg-xqy"></kf-code>
      <!--侧边栏-->
      <fab v-if="isShowFab" :isOpenFabMenu="isPad ? true : false"></fab>
      <!--end 侧边栏-->
    </view>
  </view>
</template>

<script>
  import fab from '@/components/fab'
  import navBar from '@/components/nav-bar'
  import payment from '@/components/payment'
  import payResult from '@/components/pay-result'
  import kfCode from '@/components/kf-code'
  import { navigateTo } from '@/utils/util'
  import {mixin} from '@/mixin/mixin'
  export default {
    mixins:[mixin],
    components: {
      navBar,
      payment,
      payResult,
      kfCode,
      fab
    },
    data() {
      return {
        userInfo: {},
        imgPrefix: this.$imgPrefix,
        isPad: this.$pad,
        isWechat: this.$isWechat,
        payOrderId: '',
        // isShowPayResult: false,
        // payMsg: '',
        paySuccess: false,
        isShowKfCode: false,
        payReturnMsg: {},
        goodsDetail: {},
        evaluationData: {},
        thirdToken: '',
        crossLoad: false,
        backUrl: ''
      }
    },
    onLoad(options) {
      // 首次进入该页面
      this.thirdToken = options.thirdToken ? options.thirdToken : ''
      if (this.thirdToken) {
        this.crossLoad = true
        this.backUrl = '/pages/index/index'
        getApp().thirdLoginByToken(this.thirdToken).then(res => {
          if (res.loginStatus == 1) {
            // // 登录成功
            this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
            this.getGoodsList()
            // 查询快筛概况
            this.queryFastSieveOverview()
            // uni.redirectTo({
            //   url: '/pages/evaluation/explain'
            // })
          }
        })
      }
    },
    onShow() {
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
      // 第二次进入该页面
      console.log('as12d', this.crossLoad)
      if (!this.crossLoad) {
        this.backUrl = ''
        this.getGoodsList()
        // 查询快筛概况
        this.queryFastSieveOverview()
      } else {
        this.crossLoad = false
      }
      
    },
    methods: {
      getGoodsList() {
        getApp().loginStatus('/pages/index/index').then((res) => {
          this.$request({
            url: '/gw/h5/v1/front/goods/goodsList',
            method: 'post',
            data: {
              token: this.userInfo.token,
              type: 1,
              userId: this.userInfo.userId
            }
          }).then(res => {
            if (res.status === 1000) {
              // 跳转只能评估详情进行购买
              this.goodsDetail = res.data.filter(item => item.businessType == '2210081722313010031')[0]
              // navigateTo('/pages/evaluation/detail?goodsId=' + goods.goodsId)
            } else {
              uni.showToast({
                title: res.msg,
                icon: 'none',
                duration: 2000
              })
            }
          })
        })
      },
      queryFastSieveOverview() {
        getApp().loginStatus('/pages/index/index').then((res) => {
          this.$request({
            url: '/gw/h5/v1/front/goods/queryFastSieveOverview',
            method: 'post',
            data: {
              token: this.userInfo.token,
              userId: this.userInfo.userId
            }
          }, false).then(res => {
            if (res.status === 1000) {
              this.evaluationData = res.data
            } else {
              uni.showToast({
                title: res.msg,
                icon: 'none',
                duration: 2000
              })
            }
          })
        })
      },
      goDetail() {
        // 点击查看报告/解锁报告
        if (this.evaluationData.lastFastSieve.lockStatus == 1) {
          // 查看报告
          if (this.evaluationData.orderNum == 1) {
            // 仅有一个订单，先跳到信息填写在跳到研一报告详情
            if (this.userInfo.info && this.userInfo.info.birthYear && this.userInfo.info.birthYear > 0 && this.userInfo.info.education) {
              getApp().goEvalution({
                token: this.userInfo.token,
                requestType: 2,
                payOrderId: this.evaluationData.lastFastSieve.payOrderId,
                backType: 2
              })
            } else {
              navigateTo('/pages/evaluation/sort?payOrderId='+this.evaluationData.lastFastSieve.payOrderId)
            }
          } else {
            // 多个订单，跳转至筛查报告列表
            navigateTo('/pages/evaluation/evaluation-list')
          }
        } else {
          // 解锁报告
          if (this.evaluationData.orderNum == 1) {
            // 仅有一个订单，跳转筛查解锁页
            navigateTo('/pages/evaluation/lock-report?payOrderId='+this.evaluationData.lastFastSieve.payOrderId)
          } else {
            // 多个订单，跳转至筛查报告列表
            navigateTo('/pages/evaluation/evaluation-list')
          }
        }
      },
      goEvaluation() {
        navigateTo('/pages/evaluation/sort?payOrderId='+this.goodsDetail.payOrderId)
      },
      closeKfHandle() {
        // this.isShowPayResult = false
        this.isShowKfCode = false
      },
      showKfCode() {
        this.isShowKfCode = true
      },
      goNextHandle(res) {
        // this.isShowPayResult = false
        //  v1.3跳转信息填写页面
        if (res) {
          this.goodsDetail.payOrderId = res.payOrderId
          navigateTo('/pages/evaluation/sort?payOrderId='+res.payOrderId)
        } else {
          this.goodsDetail.payOrderId = this.payReturnMsg.payOrderId
          navigateTo('/pages/evaluation/sort?payOrderId='+this.payReturnMsg.payOrderId)
        }
      },
      closeHandle() {
        this.getGoodsList()
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
  .container {
    width: 100%;
    max-width: 750.02rpx;
    box-sizing: border-box;
    font-size: 21.97rpx;
    color: #333;
    overflow: hidden;
    margin: 0 auto;
    padding-bottom: 51.27rpx;
    image {
      width: 100%;
      display: block;
    }

    .img-1 {
      height: 218.32rpx;
    }

    .img-2 {
      height: 48.35rpx;
    }

    .img-3 {
      height: 282.78rpx;
    }
    .img-4 {
      height: 288.64rpx;
    }
    
    .img-5 {
      height: 137rpx;
    }
    
    .img-6 {
      height: 434.43rpx;
    }
    
    .img-7 {
      height: 84.25rpx;
    }
    .img-8-1 {
      height: 136.26rpx;
    }
    .img-8 {
      height: 545.05rpx;
    }
    .img-9 {
      height: 289.38rpx;
    }
    .img-10-1 {
      height: 207.33rpx;
    }
    .img-10 {
      height: 479.85rpx;
    }
    .img-11 {
      height: 254.95rpx;
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
      z-index: 13;
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
        
        // .btn-buy, .btn-buy-get {
        //   display: flex;
        //   justify-content: center;
        //   align-items: center;
        //   box-sizing: border-box;
        //   background-color: #43C9A7;
        //   height: 55.68rpx;
        //   color: #fff;
        //   font-size: 21.98rpx;
        //   font-weight: bold;
        //   border-radius: 7.33rpx;
        //   margin-right: 14.65rpx;
        //   .price-1 {
        //     padding-left: 21.98rpx;
        //     font-size: 23.44rpx;
        //   }
        //   .price-2 {
        //     font-size: 13.19rpx;
        //     color: #fff;
        //     padding-left: 7.33rpx;
        //     text-decoration: line-through;
        //   }
        // }
        .btn-unlock {
          width: 307.69rpx;
          
        }
        .btn-evaluation {
          width: 307.69rpx;
        }
        .btn-evaluation-full {
          width: 629.3rpx;
          margin-right: 21.98rpx;
        }
        .btn-common {
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
              content: '您已有筛查报告';
              width: 118.42rpx;
              height: 24.18rpx;
              line-height: 24.18rpx;
              display: block;
              background-color: #FC6666;
              border-radius: 12.45rpx 12.45rpx 1.47rpx 12.45rpx;
              font-size: 13.19rpx;
              color: #fff;
              font-weight: bold;
              position: absolute;
              top: -15rpx;
              left: 10rpx;
              text-align: center;
            }
          }
        }
      }
    }
  }
  @media screen and (max-width: 500px) {
    .container {
      width: 750rpx;
      max-width: 750rpx;
      padding-bottom: 100rpx;
      .img-1 {
        height: 660rpx;
      }
      
      .img-2 {
        height: 184rpx;
      }
      
      .img-3 {
        height: 706rpx;
      }
      
      .img-4 {
        height: 732rpx;
      }
      .img-5 {
        height: 350rpx;
      }
      
      .img-6 {
        height: 920rpx;
      }
      
      .img-7 {
        height: 160rpx;
      }
      .img-8-1 {
        height: 330rpx;
      }
      .img-8 {
        height: 1306rpx;
      }
      .img-9-1 {
        height: 486rpx;
      }
      .img-9-2 {
        height: 698rpx;
      }
      .img-9-3 {
        height: 874rpx;
      }
      .img-10 {
        height: 656rpx;
      }
      
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
          // .btn-buy, .btn-buy-get {
            
          //   height: 92rpx;
          //   font-size: 34rpx;
          //   .price-1 {
          //     padding-left: 21.98rpx;
          //     font-size: 44rpx;
          //   }
          //   .price-2 {
          //     font-size: 24rpx;
          //     color: #fff;
          //     padding-left: 10rpx;
          //     text-decoration: line-through;
          //   }
          // }
          // .btn-buy-get {
          //   flex-direction: column-reverse;
          //   .price-1, .price-2 {
          //     font-size: 26rpx;
          //   }
          // }
          // .btn-buy {
          //   width: 600rpx;
          // }
          // .btn-buy-get {
          //   width: 305rpx;
          // }
          // .btn-pg-group {
          //   &>view:nth-child(1) {
          //     margin-right: 10rpx;
          //     position: relative;
          //     &::after {
          //       width: 115rpx;
          //       height: 36rpx;
          //       line-height: 36rpx;
          //       border-radius: 18px 18px 2px 18px;
          //       font-size: 24rpx;
          //       top: -18rpx;
          //       left: -10rpx;
          //     }
          //   }
          // }
          .btn-unlock {
            width: 305rpx;
            
          }
          .btn-evaluation {
            width: 305rpx;
          }
          .btn-evaluation-full {
            width: 600rpx;
          }
          .btn-common {
            
            height: 92rpx;
            font-size: 34rpx;
            border-radius: 12rpx;
          }
          .btn-pg-group {
            &>view:nth-child(1) {
              margin-right: 10rpx;
              position: relative;
              &::after {
                width: 185rpx;
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
  }
</style>
