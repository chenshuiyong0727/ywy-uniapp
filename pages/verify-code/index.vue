<template>
  <view style="height: 100vh">
    <nav-bar title="认证码"></nav-bar>
    <view v-if="!showVerify" class="code-container">
      <text class="code-text">认证码</text>
      <input
        v-if="isPad"
        placeholder-style="font-size: 21rpx;color: #cccccc"
        class="code-input"
        v-model="code"
        placeholder="请输入认证码"
      />
      <input
        v-else
        placeholder-style="font-size: 33rpx;color: #cccccc"
        class="code-input"
        v-model="code"
        placeholder="请输入认证码"
      />
      <view class="must-code" v-if="mustCode">认证码不能为空</view>
      <view class="must-code" v-if="errorCode"
        >认证码填写有误，请核实后再试</view
      >
      <span class="code-desc"
        >如果您是合作企业用户，可填写专属企业认证码验证通过后，即可享受企业合作价格</span
      >
      <view @click="submitCode" class="verify-button">
        <text class="verify-text">确认</text>
      </view>
    </view>
    <view class="verify-container" v-else>
      <image class="renzheng" :src="imgPrefix + '/static/operateSteps/portalH5/pages/renzheng.png'"></image>
      <span class="user-name">
        {{ userName }}
      </span>
      <image class="user" :src="imgPrefix + '/static/operateSteps/portalH5/pages/user.png'"></image>
      <view @click="confirm" class="verify-bottom-button">
        <text>确认</text>
      </view>
    </view>
    <!--侧边栏-->
    <fab v-if="isShowFab" :isOpenFabMenu="isPad ? true : false"></fab>
    <!--end 侧边栏-->
  </view>
</template>

<script>
import fab from '@/components/fab'
import navBar from '@/components/nav-bar'
import {mixin} from '@/mixin/mixin'
export default {
  mixins:[mixin],
  components: {
    navBar,
    fab
  },
  data() {
    return {
      mustCode: false,
      errorCode: false,
      code: '',
      userInfo: '',
      showVerify: false,
      userName: '',
      isPad: this.$pad,
      imgPrefix: this.$imgPrefix
    }
  },
  mounted() {
    this.userInfo = uni.getStorageSync('userInfo')
      ? JSON.parse(uni.getStorageSync('userInfo'))
      : {}
    // this.showVerify = this.userInfo.info.promoteCode ? true : false
    // this.userName = this.userInfo.info.customerName
    this.getPromoteCode()
  },
  methods: {
    getPromoteCode() {
        this.$request({
          url: '/gw/h5/v1/front/user/getUcUser',
          method: 'post',
          data: {
            token: this.userInfo.token
          },
        }).then((res) => {
          if (res.status === 1000) {
            this.showVerify = res.data.promoteCode ? true : false
            this.userName = res.data.customerName
            this.userInfo.info = res.data
            uni.setStorageSync('userInfo', JSON.stringify(this.userInfo))
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
    },
    confirm() {
      uni.switchTab({
        url: '/pages/my/index',
      })
    },
    submitCode() {
      const token = this.userInfo.token
      this.$request({
        url: '/gw/h5/v1/front/user/updatePromoteCode',
        method: 'put',
        data: {
          promoteCode: this.code,
          token,
        },
      })
        .then((res) => {
          if (res.status === 1000) {
            this.mustCode = false
            this.errorCode = false
            this.showVerify = true
            this.userName = res.data
            this.getPromoteCode()
            // uni.setStorageSync('companyName', res.data)
          } else {
            if (this.code.length === 0) {
              this.errorCode = false
              this.mustCode = true
            } else {
              this.errorCode = true
            }
          }
        })
        .catch((e) => {
          this.errorCode = true
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.code-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 46.88rpx !important;
  .code-text {
    font-size: 26.37rpx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: bold;
    color: #333333;
  }
  .code-input {
    padding-left: 13.92rpx;
    margin-top: 44rpx;
    width: 380.86rpx;
    height: 64.2rpx;
    font-size: 21.97rpx;
    background: #ffffff;
    border-radius: 7.32rpx;
    border: 0.73rpx solid #cccccc;
  }
  .must-code {
    margin: 12rpx 0;
    text-align: center;
    width: 100%;
    height: 32.23rpx;
    font-size: 21.44rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ff6060;
    line-height: 32.23rpx;
  }
  .code-desc {
    width: 380.86rpx;
    height: 43.95rpx;
    font-size: 19.11rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 21.97rpx;
    margin-top: 8.79rpx;
  }
  .verify-button {
    margin-top: 21.97rpx;
    width: 400.86rpx;
    height: 64.2rpx;
    text-align: center;
    line-height: 64.2rpx;
    background: #43C9A7;
    border-radius: 7.32rpx;
    .verify-text {
      font-size: 22.97rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
    }
  }
}

.verify-container {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  margin-top: 70.31rpx;
  background-image: url('https://hjom-oss.yimed.cn/static/operateSteps/portalH5/pages/register-bg-large.png');
  background-position: 50% 0%;
  background-size: 468.75rpx 180.18rpx;
  background-repeat: no-repeat;
  .renzheng {
    margin-top: 21.97rpx;
    width: 311.28rpx;
    height: 25.97rpx;
    margin-bottom: 19.78rpx;
  }
  .user {
    margin-top: 18.31rpx;
    width: 145.02rpx;
    height: 38.09rpx;
  }
  .user-name {
    font-size: 24.9rpx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: bold;
    color: #a57f4d;
    line-height: 35.16rpx;
  }
  .verify-bottom-button {
    margin-top: 50rpx;
    width: 253.42rpx;
    height: 54.2rpx;
    background: #43C9A7;
    border-radius: 7.32rpx;
    text-align: center;
    line-height: 54.2rpx;
    text {
      width: 43.95rpx;
      font-size: 21.97rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 30.76rpx;
    }
  }
}

@media screen and (max-width: 500px) and (min-width: 100px) {
  .code-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 74rpx !important;
    .code-text {
      font-size: 48rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: bold;
      color: #333333;
    }
    .code-input {
      padding-left: 15rpx;
      width: 636rpx;
      height: 126rpx;
      font-size: 40rpx;
      background: #ffffff;
      border-radius: 12rpx;
      border: 2rpx solid #cccccc;
    }
    .must-code {
      width: 100%;
      margin-top: 20rpx;
      margin-bottom: 20rpx;
      height: 32.23rpx;
      font-size: 30.44rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ff6060;
      line-height: 32.23rpx;
    }
    .code-desc {
      width: 636rpx;
      height: 80rpx;
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 40rpx;
    }
    .verify-button {
      width: 656rpx;
      height: 104rpx;
      background: #43C9A7;
      border-radius: 12rpx;
      line-height: 104rpx;
      .verify-text {
        font-size: 40rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: bold;
        color: #ffffff;
      }
    }
  }

  .verify-container {
    display: flex;
    height: 100%;
    flex-direction: column;
    align-items: center;
    margin-top: 70.31rpx;
    background-image: url('https://hjom-oss.yimed.cn/static/operateSteps/portalH5/pages/register-bg-large.png');
    background-position: 50% 0%;
    background-size: 636rpx 360rpx;
    background-repeat: no-repeat;
    .renzheng {
      margin-top: 56rpx;
      width: 556rpx;
      height: 40rpx;
    }
    .user {
      margin-top: 18.31rpx;
      width: 252rpx;
      height: 66rpx;
      margin-top: 62rpx;
    }
    .user-name {
      margin-top: 30rpx;
      font-size: 36rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: bold;
      color: #a57f4d;
      line-height: 50rpx;
    }
    .verify-bottom-button {
      margin-top: 100rpx;
      width: 636rpx;
      height: 104rpx;
      background: #43C9A7;
      border-radius: 12rpx;
      line-height: 104rpx;
      text-align: center;
      text {
        width: 80rpx;
        height: 56rpx;
        font-size: 40rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: bold;
        color: #ffffff;
      }
    }
  }
}
</style>
