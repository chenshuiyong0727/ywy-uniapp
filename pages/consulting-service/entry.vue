<template>
  <view>
    <nav-bar title='咨询专家' :backUrl="backUrl"></nav-bar>
    <view class="container">
      <view class="entry-list">
        <view class="box" @click="goEvalution">
          <view class="title">
            <text>认知评估</text>
            <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-go.png'"></image>
          </view>
          <view class="sub-title">评估师1对1辅助，评估大脑认知风险</view>
          <image class="img-1" :src="isPad ? imgPrefix + '/static/operateSteps/img-rz.png' : imgPrefix + '/static/operateSteps/img-rz-2.png'"></image>
          <view v-if="guidType == 1" class="click-masker" @click="goEvalution"></view>
        </view>
        <view class="box" @click="goToPage">
          <view class="title">
            <text>健康咨询</text>
            <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-go.png'"></image>
          </view>
          <view class="sub-title">专业医生提供咨询服务</view>
          <view class="desc">
            <view class="item">评估报告解读</view>
            <view class="item">认知疾病问题咨询</view>
          </view>
          <image class="img-2" :src="imgPrefix + '/static/operateSteps/doctor-2.png'"></image>
        </view>
      </view>
      <tip
        :gestureLeftPos="isPad ? guidMsg.gestureLeftPos.pad : guidMsg.gestureLeftPos.mobile" 
        :gestureTopPos="isPad ? guidMsg.gestureTopPos.pad : guidMsg.gestureTopPos.mobile" 
        :leftPos="isPad ? guidMsg.leftPos.pad : guidMsg.leftPos.mobile" 
        :bottomPos="isPad ? guidMsg.bottomPos.pad : guidMsg.bottomPos.mobile"
        :gestureType="guidMsg.gestureType"
        v-if="isShowGuidTip1" 
        :guidContent="guidMsg.content"
        :styles="guidMsg.styles"
        @closeGuidHandle="closeGuidHandle">
      </tip>
      <!--侧边栏-->
      <fab @useGuidHandle="useGuidHandle" :isShowUseGuid="isShowUseGuid" :isOpenFabMenu="isPad ? true : false"></fab>
      <!--end 侧边栏-->
    </view>
  </view>
</template>

<script>
  import navBar from '@/components/nav-bar'
  import tip from '@/components/guid-tip/tip'
  import fab from '@/components/fab'
  import { navigateTo } from '@/utils/util'
  export default {
    components: {
      navBar,
      tip,
      fab
    },
    data() {
      return {
        userInfo: {},
        isPad: this.$pad,
        imgPrefix: this.$imgPrefix,
        isShowGuidTip1: false,
        guidMsg: {
          content: {
            title: '点击这里',
            descList: ['可预约评估师进一步评估确认'],
          },
          styles: {
            width: this.$pad ? '349.45rpx' : '570rpx',
            // height: this.$pad ? '372.16rpx' : '448rpx',
            // bgImgName: this.$pad ? 'new-pad-guid-bg-4' : 'new-mobile-guid-bg-4',
            paddingLeft: false,
            // specialPadding: this.$pad ? 'margin-top: 248rpx;margin-left: 10rpx;' : 'margin-top: 215rpx',
            closePos: this.$pad ? 'right: -66rpx' : 'right: -96rpx'
          },
          bottomPos: {
            mobile: 550,
            pad: -40
          },
          leftPos: {
            mobile: 80,
            pad: 30
          },
          gestureTopPos: {
            mobile:  -400,
            pad: -340
          },
          gestureLeftPos: {
            mobile: 280,
            pad: 150,
          },
          gestureType: 1
        },
        guidType: -1,
        isShowUseGuid: false,
        backUrl: '/pages/index/index'
      }
    },
    onShow() {
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
    },
    onLoad(options) {
      this.guidType = options.guidType ? options.guidType : -1
      if (this.guidType > 0) {
        // #ifndef MP
        this.guidMsg.styles.bgImgName = this.$pad ? 'new-pad-guid-bg-4' : 'new-mobile-guid-bg-4'
        this.guidMsg.styles.height = this.$pad ? '372.16rpx' : '448rpx'
        this.guidMsg.styles.specialPadding = this.$pad ? 'margin-top: 248rpx;margin-left: 10rpx;' : 'margin-top: 210rpx'
        // #endif
        // #ifdef MP
        this.guidMsg.styles.bgImgName = this.$pad ? 'new-mp-pad-guid-bg-1' : 'new-mobile-guid-bg-4'
        this.guidMsg.styles.height = this.$pad ? '283.52rpx' : '448rpx'
        this.guidMsg.styles.specialPadding = this.$pad ? 'margin-top: 160rpx;margin-left: 10rpx;' : 'margin-top: 215rpx',
        // #endif
        this.guidTipHandle()
        this.isShowUseGuid = true
      }
      if (options.hasBackUrl == 'false') {
        this.backUrl = ''
      }
      
    },
    methods: {
      useGuidHandle() {
        if (uni.getStorageSync('hasGuidEntry')) {
          uni.setStorageSync('hasGuidEntry', false)
          uni.setStorageSync('enterPageTime', new Date().getTime())
          this.guidTipHandle()
        } else {
          this.closeGuidHandle()
        }
      },
      closeGuidHandle() {
        this.isShowGuidTip1 = false
        uni.setStorageSync('hasGuidEntry', true)
      },
      guidTipHandle() {
        if (!uni.getStorageSync('hasGuidEntry') && this.guidType == 1) {
          // 评估提示浮层
          this.isShowGuidTip1 = true
        } else if (!uni.getStorageSync('hasGuidEntry') && this.guidType == 2) {
          // 医生咨询提示浮层
          this.isShowGuidTip1 = true
          this.guidMsg.content = {
            title: '点击这里',
            descList: ['预约专家，咨询认知防治内容'],
          }
          this.guidMsg.styles = {
            width: this.$pad ? '349.45rpx' : '598rpx',
            // #ifndef MP
            height: this.$pad ? '372.16rpx' : '304rpx',
            bgImgName: this.$pad ? 'new-pad-guid-bg-4-2' : 'new-mobile-guid-bg-8',
            specialPadding: this.$pad ? 'margin-top: 248rpx;margin-left: 10rpx;' : 'margin-top: 0rpx',
            // #endif
            // #ifdef MP
            height: this.$pad ? '283.52rpx' : '304rpx',
            bgImgName: this.$pad ? 'new-mp-pad-guid-bg-2' : 'new-mobile-guid-bg-8',
            specialPadding: this.$pad ? 'margin-top: 160rpx;margin-left: 10rpx;' : 'margin-top: 0rpx',
            // #endif
            paddingLeft: false,
            closePos: this.$pad ? 'right: -66rpx' : 'right: -96rpx;bottom: 4rpx'
          }
          this.guidMsg.leftPos = {
            mobile: 100,
            pad: 390
          }
          this.guidMsg.bottomPos = {
            // #ifndef MP
            mobile: 470,
            pad: -30,
            // #endif
            // #ifdef MP
            mobile: 470,
            pad: 45,
            // #endif
          }
          this.guidMsg.gestureTopPos = {
            // #ifndef MP
            mobile: 130,
            pad: -320,
            // #endif
            // #ifdef MP
            mobile:  -490,
            pad: -250
            // #endif
          }
          this.guidMsg.gestureLeftPos = {
            mobile: 100,
            pad: 130,
          }
        }
      },
      goToPage() {
        if (this.guidType > 0) {
          navigateTo('/pages/consulting-service/index?guidType='+this.guidType)
        } else {
          navigateTo('/pages/consulting-service/index')
        }
        
      },
      goEvalution() {
        // 走认知评估
        this.$request({
          url: '/gw/h5/v1/front/goods/goodsList',
          method: 'post',
          data: {
            token: this.userInfo.token,
            type: 1,
            userId: this.userInfo.userId
          }
        }, false).then(res => {
          if (res.status === 1000) {
            let goods = res.data.filter(item => item.businessType == '2210081722239380029')[0]
            if (goods.payStatus == 1) {
              // 已付款，跳第三方页面
              this.goToEvalution()
            } else {
              navigateTo(`/pages/evaluation/artificial?goodsId=${goods.goodsId}&amount=${goods.amount}&originalAmount=${goods.originalAmount}&addressFlag=${goods.addressFlag}`)
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
      goToEvalution() {
        getApp().goAppointmentDetail({
          token: this.userInfo.token,
          type: 2,
          cameraPermission: true
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    width: 750.02rpx;
    max-width: 750.02rpx;
    box-sizing: border-box;
    font-size: 17.58rpx;
    color: #333;
    padding: 51.28rpx 21.98rpx;
    margin: 0 auto;
    position: relative;
    .entry-list {
      display: flex;
      justify-content: space-between;
      .box {
        width: 344.32rpx;
        height: 339.93rpx;
        background: #F5F5F5;
        box-shadow: 0px 2px 24px 0px rgba(0,0,0,0.08);
        border-radius: 21.98rpx;
        padding: 29.3rpx 0;
        box-sizing: border-box;
        position: relative;
        .title {
          display: flex;
          align-items: center;
          font-size: 32.23rpx;
          font-weight: bold;
          padding: 0 32.23rpx;
          position: relative;
          z-index: 10;
          image {
            width: 20.51rpx;
            height: 20.51rpx;
            margin-left: 11.72rpx;
          }
        }
        .sub-title {
          font-size: 16rpx;
          font-weight: bold;
          padding: 8.79rpx 32.23rpx 0 32.23rpx;
          position: relative;
          /* #ifndef MP */
          z-index: 10;
          /* #endif */
          /* #ifdef MP */
          z-index: 10;
          /* #endif */
        }
        .click-masker {
          position: absolute;
          width: 344.32rpx;
          height: 190.48rpx;
          top: 109.89rpx;
          z-index: 12;
        }
        .img-1 {
          width: 344.32rpx;
          height: 231.5rpx;
          display: block;
          margin: 0rpx auto 0 auto;
        }
        .img-2 {
          width: 231.5rpx;
          height: 231.5rpx;
          position: absolute;
          right: 0;
          bottom: 0;
        }
        .desc {
          margin-top: 54.95rpx;
          padding: 0 32.23rpx;
          position: relative;
          /* #ifndef MP */
          z-index: 12;
          /* #endif */
          /* #ifdef MP */
          z-index: 10;
          /* #endif */
          .item {
            padding: 18rpx 13.19rpx 13.19rpx 14.65rpx;
            font-size: 14.65rpx;
            position: relative;
            background: linear-gradient(180deg, #F4F4F4 0%, #FDFDFD 100%);
            box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.04), 0px -2px 4px 0px rgba(255,255,255,0.5);
            border-radius: 7.33rpx;
            display: inline-block;
            margin: 0 43.96rpx 11.72rpx 0;
            &::after {
              width: 27.84rpx;
              height: 19.05rpx;
              content: '01';
              font-size: 13.19rpx;
              font-weight: bold;
              position: absolute;
              line-height: 14.65rpx;
              padding: 1.47rpx 2.93rpx;
              box-sizing: border-box;
              top: 0;
              left: 0;
              background: url('../../static/images/pages/icon-border.png') no-repeat top left;
              background-size: 27.84rpx 19.05rpx;
              font-family: PingFangSC-Semibold, PingFang SC;
            }
          }
          .item:nth-child(2) {
            &::after {
              content: '02';
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
      font-size: 34rpx;
      padding: 28rpx 40rpx;
     
      .entry-list {
        flex-direction: column;
        .box {
          width: 670rpx;
          height: 512rpx;
          box-shadow: 0px 4px 48px 0px rgba(0,0,0,0.08);
          border-radius: 30rpx;
          padding: 40rpx 0;
          margin-bottom: 28rpx;
          .title {
            font-size: 56rpx;
            padding: 0 40rpx;
            image {
              width: 48rpx;
              height: 48rpx;
              margin-left: 20rpx;
            }
          }
          .sub-title {
            z-index: 9;
            font-size: 30rpx;
            padding: 16rpx 40rpx 0 40rpx;
          }
          .click-masker {
            width: 564rpx;
            height: 326rpx;
            top: 130rpx;
            z-index: 12;
          }
          .img-1 {
            width: 564rpx;
            height: 326rpx;
            display: block;
            margin: 0rpx auto 0 auto;
          }
          .img-2 {
            width: 380rpx;
            height: 380rpx;
            
          }
          .desc {
            margin-top: 50rpx;
            padding: 0 40rpx;
            z-index: 9;
            .item {
              padding: 42rpx 34rpx 22rpx 40rpx;
              font-size: 34rpx;
              box-shadow: 0px 4px 8px 0px rgba(0,0,0,0.04), 0px -4px 8px 0px rgba(255,255,255,0.5);
              border-radius: 12rpx;
              margin: 0 60rpx 26rpx 0;
              &::after {
                width: 66rpx;
                height: 46rpx;
                font-size: 32rpx;
                line-height: 36rpx;
                padding: 0rpx 8rpx;
                background-size: 66rpx 46rpx;
              }
            }
          }
        }
      }
    }
  }
</style>