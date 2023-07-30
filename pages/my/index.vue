<template>
  <view>

    <nav-bar title='和家健脑' :isShowRightIcon="false" :isShowLeftIcon="false"></nav-bar>

    <view class="container">
      <view class="top">
        <view class="user-msg">
          <view class="left">
            <image class="tx" :src="userInfo.userId ? imgPrefix + '/static/operateSteps/portalH5/pages/login-default-avatar.png' : imgPrefix + '/static/operateSteps/portalH5/pages/unlogin-default-avatar.png'"></image>
            <view class="nick-name" v-if="userInfo.userId">{{userName}}</view>
            <view class="nick-name" @click="naveToPage('/pages/login/index')" v-else>登录/注册</view>
          </view>
          <view  v-if="userInfo.userId" class="btn" @click="naveToPageByLogin('/pages/improve-infomation/index')">完善资料</view>
        </view>
      </view>
      <view class="common my-order">
        <view class="title"><text>我的订单</text><text class="title-right" @click="naveToPageByLogin('/pages/order/index')">全部订单</text></view>
        <view class="list">
          <view class="item" @click="naveToPageByLogin('/pages/order/index', 10)">
            <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-my-1.png'"></image>
            <view>待付款</view>
            <view :class="['badge', countOrderTap.pendingPayment > 99 ? 'badge-larger' : '']" v-if="countOrderTap.pendingPayment">{{countOrderTap.pendingPayment > 99 ? '99+' : countOrderTap.pendingPayment}}</view>
          </view>
          <view class="item" @click="naveToPageByLogin('/pages/order/index', 20)">
            <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-my-2.png'"></image>
            <view>待使用</view>
            <view :class="['badge', countOrderTap.tobeUsed > 99 ? 'badge-larger' : '']" v-if="countOrderTap.tobeUsed">{{countOrderTap.tobeUsed > 99 ? '99+' : countOrderTap.tobeUsed}}</view>
          </view>
          <view class="item" @click="naveToPageByLogin('/pages/order/index', 30)">
            <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-my-3.png'"></image>
            <view>进行中</view>
            <view :class="['badge', countOrderTap.inProgress > 99 ? 'badge-larger' : '']" v-if="countOrderTap.inProgress">{{countOrderTap.inProgress > 99 ? '99+' : countOrderTap.inProgress}}</view>
          </view>
          <view class="item" @click="naveToPageByLogin('/pages/order/index', 60)">
            <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-my-4.png'"></image>
            <view>平板寄还</view>
            <view :class="['badge', countOrderTap.tabletReturn > 99 ? 'badge-larger' : '']" v-if="countOrderTap.tabletReturn">{{countOrderTap.tabletReturn > 99 ? '99+' : countOrderTap.tabletReturn}}</view>
          </view>
        </view>
      </view>
      <view class="common usage-record">
        <view class="title">使用记录</view>
        <view class="list">
          <view class="item" @click="naveToPageByLogin('/pages/my/intelligence-evaluation-order')">
            <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-my-10.png'"></image>
            <view>认知筛查</view>
            <view :class="['badge', orderNum.screeningNum > 99 ? 'badge-larger' : '']" v-if="orderNum.screeningNum">{{orderNum.screeningNum > 99 ? '99+' : orderNum.screeningNum}}</view>
          </view>
          <view class="item" @click="goAppointmentDetail(2)">
            <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-my-11.png'"></image>
            <view>认知评估</view>
            <view :class="['badge', orderNum.assessmentNum > 99 ? 'badge-larger' : '']" v-if="orderNum.assessmentNum">{{orderNum.assessmentNum > 99 ? '99+' : orderNum.assessmentNum}}</view>
          </view>
          <view class="item" @click="goAppointmentDetail(1)">
            <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-my-12.png'"></image>
            <view>咨询专家</view>
            <view :class="['badge', orderNum.consultingNum > 99 ? 'badge-larger' : '']" v-if="orderNum.consultingNum">{{orderNum.consultingNum > 99 ? '99+' : orderNum.consultingNum}}</view>
          </view>
          <view class="item" @click="goCognitiveTraining">
            <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-my-13.png'"></image>
            <view>数字疗法</view>
            <view :class="['badge', orderNum.trainNum > 99 ? 'badge-larger' : '']" v-if="orderNum.trainNum">{{orderNum.trainNum > 99 ? '99+' : orderNum.trainNum}}</view>
          </view>
          <view class="item" @click="naveToPageByLogin('/pages/my/exercise-order')">
            <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-my-14.png'"></image>
            <view>趣味健脑</view>
          </view>
          <view class="item"  @click="naveToPageByLogin('/pages/my/micromotion-order')">
            <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-my-15.png'"></image>
            <view>健脑运动</view>
          </view>
        </view>
      </view>
      <view class="common my-service">
        <view class="title">我的服务</view>
        <view class="list">
          <view class="item" @click="showKfCode">
            <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-my-5.png'"></image>
            <view>联系客服</view>
          </view>
          <view class="item" @click="naveToPageByLogin('/pages/feedback/index')">
            <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-my-6.png'"></image>
            <view>意见反馈</view>
          </view>
          <view class="item" @click="naveToPageByLogin('/pages/verify-code/index')">
            <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-my-7.png'"></image>
            <view>企业认证</view>
          </view>
          <view class="item" @click="naveToPageByLogin('/pages/order/address-manage')">
            <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-my-8.png'"></image>
            <view>地址管理</view>
          </view>
          <view class="item" @click="naveToPageByLogin('/pages/account-setting/index')">
            <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-my-9.png'"></image>
            <view>账号设置</view>
          </view>

        </view>
      </view>
      <view style="padding-bottom: 50rpx;">
        <input style="background-color: #fff; height: 70rpx; width: 80%;" maxlength="11" v-model="phonetest" type="text" />
        <view style="display: flex; margin-top: 20rpx;">
          <view style="padding-right: 50rpx;" @click="goEval('/pages/evaluation/explain')">跳转说明页</view>
          <view @click="goEval('/pages/my/intelligence-evaluation-order')">跳转列表页</view>
        </view>
      </view>

    </view>
    <kf-code v-if="isShowKfCode" @closeKfHandle="closeKfHandle" ewmName="wd-lxkf"></kf-code>
  </view>


</template>

<script>
  import navBar from '@/components/nav-bar'
  import kfCode from '@/components/kf-code'
  import { navigateTo, getUserInfoGlobal } from '../../utils/util'
  export default {
    components: {
      navBar,
      kfCode
    },
    data() {
      return {
        userInfo: {},
        isPad: this.$pad,
        imgPrefix: this.$imgPrefix,
        isShowKfCode: false,
        orderNum: {},
        countOrderTap: {},
        phonetest: '',
        userName: ''
      }
    },
    onShow() {
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
      if (this.userInfo && this.userInfo.token) {
        let tel = this.userInfo.info.userMobile.substring(0, 3) + '****' + this.userInfo.info.userMobile.substring(this.userInfo.info.userMobile.length - 4)
        this.userName = this.userInfo.info.userRealName ? this.userInfo.info.userRealName : tel
        this.queryMyOrderNum()
      } else {
        this.orderNum = {}
        this.countOrderTap = {}
      }

			//this.handleUserInfo()
    },
    methods: {
      goEval(path) {
        this.$request({
          url: '/gw/h5/v1/front/test/getThirdloginByPhone',
          method: 'get',
          data: {
            phone: this.phonetest
          }
        }).then(res => {
          navigateTo(`${path}?thirdToken=${res.data}`)
        })
      },

			// async handleUserInfo () {
			// 	await getUserInfoGlobal()
			// 	this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
			// },
      queryMyOrderNum() {
        this.$request({
          url: '/gw/h5/v1/front/user/queryMyOrderNum',
          method: 'post',
          data: {
            token: this.userInfo.token,
            userId: this.userInfo.userId
          }
        }, false).then(res => {
          if (res.status === 1000) {
            this.orderNum = res.data ? res.data : {}
            console.log(this.orderNum)
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
        this.$request({
          url: '/gw/h5/v1/front/order/countByOrderTap',
          method: 'get',
          data: {
            token: this.userInfo.token
          }
        }, false).then(res => {
          if (res.status === 1000) {
            this.countOrderTap = res.data ? res.data : {}
          }
        })
      },
      naveToPage(url) {
        // console.log(url)
        navigateTo(url)
      },
      naveToPageByLogin(url, openerOrderTap = '') {
        // 跳转之前判断是否登录
        getApp().loginStatus().then(() => {
          if (openerOrderTap) {
           uni.setStorageSync('openerOrderTap', openerOrderTap)
          }
          navigateTo(url)
        })
      },
      goCognitiveTraining() {
        let routes = getCurrentPages() //获取加载的页面
        let curRoute = routes[routes.length - 1].route //获取当前页面的对象
        let backUrl = encodeURIComponent(`/${curRoute}?pageType=tab`)
        getApp().goCognitiveTraining({
          token: this.userInfo.token,
          backType: 5,
          isNeedLandscape: 'yes',
          redirectUrl: backUrl
        })
      },
      goAppointmentDetail(type) {
        getApp().goAppointmentDetail({
          token: this.userInfo.token,
          type,
          cameraPermission: type == 2 ? true : false
        })
      },
      closeKfHandle() {
        this.isShowKfCode = false
      },
      showKfCode() {
        this.isShowKfCode = true
      },
      goToPage(type) {
        if (type == 1) {
          navigateTo('/pages/evaluation/quick-sieve-record')
        }
        if (type == 2) {
          getApp().goAppointmentDetail({
            token: this.userInfo.token,
            type: 2,
            cameraPermission: true
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    width: 750rpx;
    max-width: 750rpx;
    margin: 0 auto;
    box-sizing: border-box;
    font-size: 22.5rpx;
    color: #333;
    padding-bottom: 55rpx;

    .top {
      height: 203.75rpx;
      // background: linear-gradient(180deg, #7B3A88 0%, #964DA5 100%);
      background: url('https://natt.yimed.cn:11902/static/operateSteps/portalH5/pages/my-img-1.png?t=1') no-repeat top center;
      background-size: 750rpx 203.75rpx;
      padding: 27.5rpx 28.75rpx 0 28.75rpx;
      box-sizing: border-box;
      color: #fff;
      .user-msg {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
          display: flex;
          align-items: center;
        }
      }

      .tx {
        width: 87.5rpx;
        height: 87.5rpx;
        border-radius: 50%;
        margin-right: 17.5rpx;
      }

      .nick-name {
        font-size: 32.5rpx;
        font-weight: bold;
      }
      .btn {
        width: 157.5rpx;
        height: 61.25rpx;
        border-radius: 40rpx;
        background-color: #fff;
        text-align: center;
        line-height: 61.25rpx;
        font-size: 22.5rpx;
        color: #30B08F;
      }
    }

    .common {
      width: 718.75rpx;
      box-sizing: border-box;
      padding: 17.5rpx 17.5rpx 40rpx 17.5rpx;
      margin: 0 auto 13.75rpx auto;
      background-color: #fff;
      border-radius: 12.5rpx;
      .title {
        font-size: 20rpx;
        color: #474747;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
        // padding-bottom: 12.5rpx;
        .title-right {
          font-weight: 400;
          position: relative;
          padding-right: 20rpx;
          color: #666;
          &::after {
            content: '';
            width: 10rpx;
            height: 10rpx;
            border-top: 2px solid #999;
            border-right: 2px solid #999;
            position: absolute;
            top: 7rpx;
            right: 0;
            transform: rotate(45deg);

          }
        }
      }
      .list {
        display: flex;
        flex-wrap: wrap;
        font-size: 22.5rpx;
        color: #474747;
        padding: 0 21.97rpx;
        margin-top: -25rpx;
        .item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-right: 65rpx;
          z-index: 9;
          // margin-top: 25.63rpx;
          margin-top: 57.5rpx;
          min-width: 109.89rpx;
          image {
            width: 53.75rpx;
            height: 53.75rpx;
            margin-bottom: 13.75rpx;
          }
          .badge {
            width: 32.5rpx;
            height: 20rpx;
            display: inline-block;
            text-align: center;
            height: 20rpx;
            line-height: 20rpx;
            color: #fff;
            background-color: #FC6666;
            font-size: 15rpx;
            position: absolute;
            top: -7rpx;
            right: 0;
            border-radius: 12.5rpx;
          }
          .badge-larger {
            width: 35rpx;
          }
        }
        .item:nth-child(4n) {
          margin-right: 0;
        }
      }
    }
    .my-order {
      margin-top: -65rpx;
    }
    .my-service {
      .list {
        flex-wrap: nowrap;
        justify-content: space-between;
        .item {
          margin-right: 0rpx;
        }
      }
    }

  }
  @media screen and (max-width: 500px) {
    .container {
      width: 750rpx;
      max-width: 750rpx;
      padding-bottom: 100rpx;
      .top {
        height: 220rpx;
        padding: 42rpx 26rpx;
        background: linear-gradient(180deg, #32BD9A 0%, #43C9A7 100%);
        .tx {
          width: 124rpx;
          height: 124rpx;
          margin-right: 28rpx;
        }

        .nick-name {
          font-size: 34rpx;
        }
        .btn {
          width: 192rpx;
          height: 84rpx;
          border-radius: 42rpx;
          line-height: 84rpx;
          font-size: 28rpx;
        }
      }
      .common {
        width: 698rpx;
        padding: 32rpx 24rpx 46rpx 24rpx;
        margin: 0 auto 20rpx auto;
        border-radius: 20rpx;
        .title {
          font-size: 32rpx;
          padding-bottom: 0rpx;
          .title-right {
            padding-right: 30rpx;
            &::after {
              content: '';
              width: 15rpx;
              height: 15rpx;
              top: 13rpx;
            }
          }
        }
        .list {
          font-size: 32rpx;
          padding: 0 0rpx;
          margin-top: 0;
          .item {
            margin-right: 90rpx;
            margin-top: 48rpx;
            min-width: 110rpx;
            image {
              width: 80rpx;
              height: 80rpx;
              margin-bottom: 10rpx;
            }
            .badge {
              // padding: 2rpx 15rpx;
              // height: 28rpx;
              // line-height: 28rpx;
              // font-size: 22rpx;
              // position: absolute;
              top: -7rpx;
              right: 0;
              width: 42rpx;
              height: 28rpx;
              // border-radius: 20rpx;
              // padding: 2rpx 16rpx;
              font-size: 22rpx;
              font-weight: 600;
              line-height: 28rpx;
              border-radius: 22rpx;
              height: auto;
              // top: 50%;
              // transform: translateY(-50%);
              // right: 30rpx;
              text-align: center;
            }
            .badge-larger {
              // padding: 2rpx 6rpx 2rpx 10rpx;
              width: 56rpx;
            }
          }
          .item:nth-child(4n) {
            margin-right: 0;
          }
        }
      }
      .my-order {
        margin-top: 20rpx;
        .list {
          justify-content: space-between;
          margin-top: -20rpx;
          .item {
            margin-right: 0rpx;
          }
        }
      }
      .usage-record {
        .list {
          margin-left: 28rpx;
          .item {
            margin-right: 104rpx;
          }
          .item:nth-child(3n) {
            margin-right: 0;
          }
          .item:nth-child(4n) {
            margin-right: 104rpx;
          }
        }
      }
      .my-service {
        width: 698rpx;
        padding: 32rpx 24rpx 14rpx 24rpx;
        margin: 0 auto 20rpx auto;
        border-radius: 20rpx;
        .title {
          font-size: 30rpx;
          margin-bottom: 6rpx;
        }
        .list {
          font-size: 32rpx;
          padding: 0 0rpx;
          flex-direction: column;
          .item {
            margin-right: 0rpx;
            margin-top: 0rpx;
            min-width: 110rpx;
            flex-direction: row;
            justify-content: flex-start;
            padding: 20rpx 0;
            image {
              width: 80rpx;
              height: 80rpx;
              margin-bottom: 0rpx;
              margin-right: 30rpx;
            }
            &>view {
              flex: 1;
            }
            // .badge {
            //   padding: 2rpx 16rpx;
            //   font-size: 22rpx;
            //   font-weight: 600;
            //   line-height: 24rpx;
            //   border-radius: 22rpx;
            //   top: 50%;
            //   transform: translateY(-50%);
            //   right: 30rpx;
            //   text-align: left;
            // }
            // .badge-larger {
            //   padding: 2rpx 6rpx 2rpx 10rpx;
            // }
            &::after {
              content: '';
              width: 15rpx;
              height: 15rpx;
              border-top: 1px solid #C9C9C9;
              border-right: 1px solid #C9C9C9;
              position: absolute;
              right: 0;
              top: 50%;
              transform: translateY(-50%) rotate(45deg);
            }
          }
          .item:nth-child(4n) {
            margin-right: 0;
          }
        }
      }

    }
  }
  @media screen and (width: 360px) and (height: 729px) {
    .container {
      padding-bottom: 180rpx;
    }
  }
</style>
