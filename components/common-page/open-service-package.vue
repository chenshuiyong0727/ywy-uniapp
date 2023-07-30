<template>
  <view>
   
    <nav-bar :title="title"></nav-bar>
    
    <view class="container">
      <view class="top">
        <image
          class="title"
          :src="
            pageType == 1
              ? imgPrefix + '/static/operateSteps/portalH5/pages/exercise-title-1.png?t=1'
              : imgPrefix + '/static/operateSteps/portalH5/pages/exercise-title-2.png?t=1'
          "
        ></image>
        <view class="service-msg">
          <view class="sub-title">{{
            pageType == 1
              ? '365天锻炼 保持大脑年轻态'
              : '365天跟练 保持大脑年轻态'
          }}</view>
          <view class="price" v-if="goodsData.amount / 100 > 0">¥<text>{{ goodsData.amount / 100 }}</text>/年</view>
          <view class="price" v-else>限时免费</view>
          <view class="origin-price">¥{{ goodsData.originalAmount / 100 }}</view>
        </view>
        <view class="xy">
          <image @click="checkedAgrHandle" :src="agreementChecked ? imgPrefix + '/static/operateSteps/portalH5/pages/exercise-xy-checked.png' : imgPrefix + '/static/operateSteps/portalH5/pages/exercise-xy.png'"></image>
          <view>开通前请阅读<text @click="goToAgreement">《和家健脑用户服务协议》</text>
            <text @click="toPrivateService">《和家健脑隐私服务协议》</text></view>
          </view>
        <view>
          <payment
            @goBack="goBack"
            :price="goodsData.amount"
            :goodsId="goodsData.goodsId"
            :addressFlag="+goodsData.addressFlag"
            :buyType="pageType == 1 ? '4' : '6'"
            :agreementChecked="agreementChecked"
            btnText="确定"
          >
            <text class="btn-open">确认并开通服务包</text>
          </payment>
        </view>
      </view>
      <slot></slot>
      <!--侧边栏-->
      <fab :isOpenFabMenu="isPad ? true : false"></fab>
      <!--end 侧边栏-->
    </view>
    
  </view>
</template>

<script>
import fab from '@/components/fab'
import { navigateTo } from '../../utils/util.js'
import navBar from '@/components/nav-bar'
import payment from '@/components/payment/index.vue'

export default {
  components: {
    navBar,
    payment,
    fab
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    pageType: {
      type: Number,
      default: 1, // 1=>趣味锻炼 2=>健脑运动
    },
  },
  data() {
    return {
      imgPrefix: this.$imgPrefix,
      agreementChecked: false,
      userInfo: {},
      goodsData: {},
      payOrderId: '',
      isPad: this.$pad
    }
  },
  mounted() {
    this.userInfo = uni.getStorageSync('userInfo')
      ? JSON.parse(uni.getStorageSync('userInfo'))
      : {}
    this.getGoodsList()
  },
  methods: {
    checkedAgrHandle() {
      this.agreementChecked = !this.agreementChecked
    },
    getGoodsList() {
      this.$request({
        url: '/gw/h5/v1/front/goods/goodsList',
        method: 'post',
        data: {
          token: this.userInfo.token,
          userId: this.userInfo.userId,
          type: this.pageType == 1 ? 4 : 5,
        },
      }).then((res) => {
        if (res.status === 1000) {
          this.goodsData = res.data ? (res.data.length ? res.data[0] : {}) : {}
        } else {
          uni.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000,
          })
        }
      })
    },
    goBack() {
      uni.redirectTo({
        url:
          this.pageType == 1
            ? '/pages/exercise/list'
            : '/pages/micromotion/list',
      })
    },
    goToAgreement() {
      navigateTo('/pages/agreement/reg')
    },
    toPrivateService() {
      navigateTo('/pages/agreement/pay')
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  width: 750.02rpx;
  max-width: 750.02rpx;
  box-sizing: border-box;
  font-size: 21.97rpx;
  overflow: hidden;
  margin: 0 auto;
  .top {
    width: 750.02rpx;
    padding: 32.23rpx 0 43.95rpx 0;
    background-color: #451b4d;
    .title {
      width: 318.68rpx;
      height: 40.29rpx;
      display: block;
      margin: 0 auto 29.3rpx auto;
    }
    .service-msg {
      width: 407.97rpx;
      height: 133.3rpx;
      background: url('https://hjom-oss.yimed.cn/static/operateSteps/portalH5/pages/price-bg.png') no-repeat;
      background-size: 100% 100%;
      margin: 0 auto;
      position: relative;
      padding-top: 25.64rpx;
      box-sizing: border-box;
      .sub-title {
        text-align: center;
        font-size: 19.04rpx;
        color: #333;
      }
      .price {
        text-align: center;
        font-size: 19.04rpx;
        padding-top: 7.32rpx;
        color: #df5c1d;
        text {
          font-size: 35.16rpx;
        }
      }
      .origin-price {
        font-size: 13.18rpx;
        color: #c99c62;
        text-align: center;
        text-decoration: line-through;
        padding-top: 7.32rpx;
      }
    }
    .xy {
      font-size: 11.72rpx;
      color: #f0d7bb;

      margin-top: 25.64rpx;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      image {
        width: 10.25rpx;
        height: 10.25rpx;
        margin-right: 7.32rpx;
        vertical-align: middle;
        margin-top: 7rpx;
      }
      &>view {
        vertical-align: middle;
      }
    }
    .btn-open {
      display: block;
      width: 234.38rpx;
      height: 45.41rpx;
      margin: 10.99rpx auto;
      text-align: center;
      line-height: 45.41rpx;
      background-color: #f0d7bb;
      border-radius: 7.32rpx;
      color: #502459;
      font-size: 17.58rpx;
    }
  }
}
@media screen and (max-width: 500px) {
  .container {
    width: 750rpx;
    max-width: 750rpx;
    font-size: 24rpx;
    .top {
      width: 750rpx;
      padding: 60rpx 0 48rpx 0;
      .title {
        width: 532rpx;
        height: 68rpx;
        margin: 0 auto 36rpx auto;
      }
      .service-msg {
        width: 650rpx;
        height: 268rpx;
        padding-top: 32rpx;
        .sub-title {
          font-size: 40rpx;
        }
        .price {
          font-size: 40rpx;
          padding-top: 12rpx;
          text {
            font-size: 72rpx;
          }
        }
        .origin-price {
          font-size: 36rpx;
          padding-top: 10rpx;
        }
      }
      .xy {
        font-size: 24rpx;
        margin-top: 50rpx;
        
        padding: 0 50rpx;
        image {
          width: 24rpx;
          height: 24rpx;
          margin: 5rpx 12rpx 0 0;
        }
      }
      .btn-open {
        width: 420rpx;
        height: 96rpx;
        margin: 16rpx auto;
        line-height: 96rpx;
        border-radius: 12rpx;
        font-size: 34rpx;
      }
    }
  }
}
</style>