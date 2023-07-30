<template>
  <view class="setting-account">
  
    <nav-bar title="账号设置"></nav-bar>
  
    <view class="account-container">
      <view class="current-account">当前账号</view>
      <view class="phone-number">{{ userMobile }}</view>
      <view @click="logout" class="logout-button btn">
        <text>退出登录</text>
      </view>
      <view @click="changeAccount" class="btn">
        <text>切换账号</text>
      </view>
      <!-- #ifdef APP-PLUS -->
      <view @click="cancelAccount" class="btn" v-if="platform=='ios'">
        <text>注销账号</text>
      </view>
      <!-- #endif -->
    </view>
  </view>
</template>


<script>
import navBar from '@/components/nav-bar'
export default {
  data() {
    return {
      userMobile: '',
      token: '',
      mpWexin: false,
      platform: this.$platform
    }
  },
  components: {
    navBar,
  },
  onLoad() {
    const type = uni.getSystemInfoSync().uniPlatform
    if (type == 'mp-weixin') {
      this.mpWexin = true
    }
    this.userInfo = uni.getStorageSync('userInfo')
      ? JSON.parse(uni.getStorageSync('userInfo'))
      : {}
    this.token = this.userInfo.token
    this.userMobile = this.userInfo.info?.userMobile.replace(
      /(\d{3})\d{4}(\d{4})/,
      '$1 **** $2'
    )
    console.log('uuu',this.userMobile)
  },
  methods: {
    // 这个是swtchTab回到首页
    logout() {
      this.$request({
        url: '/gw/h5/v1/front/user/logout',
        method: 'get',
        data: {
          token: this.token,
        },
      })
        .then((res) => {
          uni.removeStorageSync('promoteInfo')
          if (res.status === 1000) {
            uni.removeStorageSync('userInfo')
            uni.removeStorageSync('hasGuidIndex')
            uni.removeStorageSync('hasGuidEntry')
            uni.removeStorageSync('sysDictList')
            uni.removeStorageSync('reAppointmentTime')
            uni.switchTab({
              url: '/pages/index/index',
            })
          } else {
            uni.removeStorageSync('userInfo')
            uni.removeStorageSync('hasGuidIndex')
            uni.removeStorageSync('hasGuidEntry')
            uni.removeStorageSync('sysDictList')
            uni.removeStorageSync('reAppointmentTime')
            uni.switchTab({
              url: '/pages/index/index',
            })
          }
        })
        .catch((e) => {
          uni.removeStorageSync('userInfo')
          uni.removeStorageSync('hasGuidIndex')
          uni.removeStorageSync('hasGuidEntry')
          uni.removeStorageSync('sysDictList')
          uni.removeStorageSync('reAppointmentTime')
          uni.switchTab({
            url: '/pages/index/index',
          })
        })
    },
    // 重定向
    changeAccount() {
      this.$request({
        url: '/gw/h5/v1/front/user/logout',
        method: 'get',
        data: {
          token: this.token,
        },
      })
        .then((res) => {
          uni.removeStorageSync('promoteInfo')
          if (res.status === 1000) {
            uni.removeStorageSync('userInfo')
            uni.removeStorageSync('hasGuidIndex')
            uni.removeStorageSync('hasGuidEntry')
            uni.removeStorageSync('sysDictList')
            uni.removeStorageSync('reAppointmentTime')
            uni.redirectTo({
              url: '/pages/login/index',
            })
          } else {
            uni.removeStorageSync('userInfo')
            uni.removeStorageSync('hasGuidIndex')
            uni.removeStorageSync('hasGuidEntry')
            uni.removeStorageSync('sysDictList')
            uni.removeStorageSync('reAppointmentTime')
            uni.redirectTo({
              url: '/pages/login/index',
            })
          }
        })
        .catch((e) => {
          uni.removeStorageSync('userInfo')
          uni.removeStorageSync('hasGuidIndex')
          uni.removeStorageSync('hasGuidEntry')
          uni.removeStorageSync('sysDictList')
          uni.removeStorageSync('reAppointmentTime')
          uni.redirectTo({
            url: '/pages/login/index',
          })
        })
    },
    // #ifdef APP-PLUS
    cancelAccount() {
      uni.navigateTo({
        url: '/pages/account-setting/cancel'
      })
    }
    // #endif
  },
}
</script>

<style lang="scss" scoped>
.setting-account {
  height: 100%;
  overflow: hidden;
}
.account-container {
  text-align: center;
  padding-top: 72.5rpx;
  .current-account {
    font-size: 22.5rpx;
    color: #999999;
    padding-bottom: 20rpx;
  }
  .phone-number {
    font-size: 35rpx;
    color: #333333;
    font-weight: bold;
    padding-bottom: 56.25rpx;
  }
  .btn {
    width: 340rpx;
    height: 60rpx;
    border: 1px solid #43C9A7;
    border-radius: 7.5rpx;
    margin: 0 auto 17.5rpx auto;
    text-align: center;
    line-height: 60rpx;
    font-size: 22.5rpx;
    color: #43C9A7;
  }
  .logout-button {
    background-color: #43C9A7;
    color: #fff;
  }
}

@media screen and (max-width: 500px) and (min-width: 100px) {
  .account-container {
    padding-top: 156rpx;
    .current-account {
      font-size: 36rpx;
      padding-bottom: 32rpx;
    }
    .phone-number {
      font-size: 56rpx;
      padding-bottom: 90rpx;
    }
    .btn {
      width: 544rpx;
      height: 96rpx;
      border-radius: 12rpx;
      margin: 0 auto 28rpx auto;
      line-height: 96rpx;
      font-size: 34rpx;
    }
  }
}
</style>