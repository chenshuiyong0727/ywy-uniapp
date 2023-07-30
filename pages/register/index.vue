<template>
  <view class="register-container">
    <view class="title-text">
      <text>和家健脑</text>
    </view>

    <view class="top-container">
      <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/registerSuccess-icon.png'"></image>
      <text>注册成功</text>
    </view>
    <view class="enter-family">恭喜您加入 健脑大家庭</view>
    <view class="text-one">
      <text class="text-onee"
        >您是第 {{ regNum }} 位开始科学锻炼大脑的用户</text
      >
      <text class="text-two">往后余生，健康相伴每一天</text>
    </view>
    <view>
      <!-- <tip
        :width="400"
        :height="75"
        :rightImage="false"
        v-if="isGuidTip && isPad"
        :isShowNextBtn="false"
        :isShowCloseBtn="false"
        :gestureLeftPos="515"
        :gestureTopPos="-50"
        :leftPos="-270"
        :bottomPos="-100"
        :title="title"
        :gestureType="1"
      ></tip>
      <tip
        :width="310"
        :height="50"
        :rightImage="false"
        v-if="isGuidTip && !isPad"
        :isShowNextBtn="false"
        :isShowCloseBtn="false"
        :gestureLeftPos="455"
        :gestureTopPos="-100"
        :leftPos="-120"
        :bottomPos="-120"
        :title="title"
        :gestureType="7"
      ></tip> -->
      <view class="back-home">
        <text class="now-back">正在返回首页...{{ backTime }}s</text>
        <text class="back" @click="backToIndex">立即返回</text>
      </view>
    </view>
    <view v-if="enterCode" :class="[{ fixTop: fixTop }, 'footer']">
      <view class="new-code" v-if="enterCode">
        <image
          class="divider-image"
          :src="imgPrefix + '/static/operateSteps/portalH5/pages/renzheng.png'"
        ></image>
        <text class="user-name">{{ userName }}用户</text>
        <image
          class="user-image"
          :src="imgPrefix + '/static/operateSteps/portalH5/pages/user.png'"
        ></image>
      </view>
      <!-- <view v-if="!enterCode" class="footer-text"
        ><text class="des">如果您是合作企业用户，请询问推广员后填写</text
        ><text class="code">(邀请码不影响注册)</text></view
      >
      <view v-if="!enterCode" class="footer-input">
        <input
          :adjust-position="false"
          v-if="isPad"
          placeholder-style="font-size: 17.23rpx;color: #cccccc"
          v-model="promoteCode"
          placeholder="请输入邀请码 (选填)"
        />
        <input
          :adjust-position="false"
          v-else
          placeholder-style="font-size: 33.23rpx;color: #cccccc"
          v-model="promoteCode"
          placeholder="请输入邀请码 (选填)"
        />
        <view v-if="!enterCode" @click="insertCode" class="footer-button">
          <text>确认</text>
        </view>
      </view>
      <view class="must-code" v-if="mustCode">请填写邀请码</view>
      <view class="must-code" v-if="errorCode">邀请码错误</view> -->
    </view>
  </view>
</template>

<script>
// import tip from '@/components/second-tip/second-tip'
import { navigateTo, encrypt, getUserInfoGlobal } from '../../utils/util.js'
export default {
  data() {
    return {
      backTime: 0,
      // isGuidTip: false,
      fixTop: false,
      isPad: this.$pad,
      imgPrefix: this.$imgPrefix,
      errorCode: false,
      mustCode: false,
      enterCode: false,
      videoContext: null,
      detailId: '',
      detailData: {},
      videoSrc: '',
      regNum: '',
      promoteCode: '',
      userName: '',
      userInfo: {},
      title: '您现在可以使用所有的免费功能啦！点击按钮，返回首页去使用吧',
    }
  },
  // components: {
  //   tip,
  // },
  onLoad() {
    // setTimeout(() => {
    //   this.isGuidTip = true
    // }, 5000)
    this.userInfo = uni.getStorageSync('userInfo')
      ? JSON.parse(uni.getStorageSync('userInfo'))
      : {}
    console.log('this', this.userInfo)
    const num = this.userInfo.regNum
    this.regNum = num
  },
  onShow() {
    this.promoteCodeHandle()
  },
  watch: {
    promoteCode(newName, oldName) {
      if (newName.trim() !== '') {
        this.mustCode = false
      }
    },
    backTime(newVal) {
      if (newVal == 0) {
        navigateTo('/pages/index/index')
      }
    },
  },
  mounted() {
    this.backTime = 5
    setInterval(this.backTimeDown, 1000)
  },
  methods: {
    backTimeDown() {
      this.backTime--
    },
    closeGuid() {
      this.isShowGuidTip = false
    },
    // 推荐码处理逻辑
    promoteCodeHandle() {
      let promoteInfo = uni.getStorageSync('promoteInfo') || {}
      // 参数和缓存都没有推荐码信息的话，直接返回
      if (JSON.stringify(promoteInfo) !== '{}') {
        this.promoteCode = promoteInfo.promoteCode
        this.insertCode()
        return
      }
    },
    focusInput() {
      this.fixTop = true
    },
    blurInput() {
      this.fixTop = false
      this.insertCode()
    },
    backToIndex() {
      navigateTo('/pages/index/index')
    },
    insertCode() {
      this.errorCode = false
      this.mustCode = false
      if (!this.promoteCode) {
        this.mustCode = true
        return
      }
      const token = this.userInfo.token
      this.$request({
        url: '/gw/h5/v1/front/user/updatePromoteCode',
        method: 'put',
        data: {
          promoteCode: this.promoteCode,
          token,
        },
      })
        .then((res) => {
          if (res.status === 1000) {
            uni.removeStorageSync('promoteInfo')
            getUserInfoGlobal()
            this.mustCode = false
            this.enterCode = true
            this.userName = res.data
          } else {
            this.errorCode = true
            uni.removeStorageSync('promoteInfo')
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
.user-image {
  width: 145.02rpx;
  height: 38.09rpx;
}
/* .t-container {
  padding-top: 8.06rpx !important;
  width: 330.35rpx;
  height: 120.88rpx;
  background: #336cea;
  box-shadow: 0rpx 2.93rpx 5.86rpx 0rpx rgba(74, 74, 74, 0.15);
  border-radius: 8.79rpx;
  font-size: 19.04rpx !important;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #ffffff;
  line-height: 27.1rpx !important;
} */

.back-home {
  display: flex;
  align-items: center;
  margin-top: 56rpx;
  .now-back {
    font-size: 17.58rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 24.17rpx;
  }
  .back {
    margin-left: 20rpx;
    font-size: 17.58rpx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: bold;
    color: #43C9A7;
    line-height: 24.17rpx;
    text-decoration: underline;
  }
}

.fixTop {
  position: fixed;
  top: 15rpx !important;
  left: 0;
  z-index: 999999;
}

.register-container {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  .title-text {
    margin-top: 25.99rpx;
    width: 80.57rpx;
    height: 28.56rpx;
    font-size: 19.78rpx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: bold;
    color: #333333;
    line-height: 28.56rpx;
  }
  .top-container {
    display: flex;
    align-items: center;
    margin-top: 33.69rpx;
    image {
      width: 32.23rpx;
      height: 32.23rpx;
      margin-right: 5.86rpx;
    }
    text {
      margin-left: 10rpx;
      width: 76.17rpx;
      height: 27.1rpx;
      font-size: 19.04rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #43c9a7;
      line-height: 27.1rpx;
    }
  }
  .enter-family {
    // width: 257.81rpx;
    height: 35.16rpx;
    font-size: 24.9rpx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: bold;
    color: #333333;
    line-height: 35.16rpx;
    margin-top: 18.31rpx;
  }
  .text-one {
    display: flex;
    flex-direction: column;
    margin-left: 30rpx;
    margin-top: 13.92rpx;
    // width: 320.46rpx;
    height: 20.51rpx;
    font-size: 16.65rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
    line-height: 24.51rpx;
    .text-two {
      margin-left: 50rpx;
      // width: 205.78rpx;
      height: 20.51rpx;
      font-size: 16.65rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 20.51rpx;
    }
  }
  .back-index {
    margin-top: 39.55rpx !important;
    width: 293.7rpx;
    height: 47.61rpx;
    background: #502459;
    border-radius: 8.06rpx;
    line-height: 47.61rpx;
    text-align: center;
    text {
      width: 73.97rpx;
      height: 25.63rpx;
      font-size: 18.31rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
    }
    .right-icon {
      margin-left: 2.2rpx;
      width: 23.44rpx;
      height: 17.58rpx;
    }
  }
  .footer {
    margin-top: 45.41rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw;
    height: 100%;
    background-image: url('https://hjom-oss.yimed.cn/static/operateSteps/portalH5/pages/register-bg-large.png');
    background-position: 50% 0%;
    background-size: 468.75rpx 180.18rpx;
    background-repeat: no-repeat;
    .footer-text {
      width: 463.62rpx;
      height: 21.97rpx;
      font-size: 15.38rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 21.97rpx;
      margin: 39.55rpx 0 32.23rpx 0;
      text {
        margin-left: 10rpx;
      }
      .code {
        color: #9d9d9d;
      }
    }
    .footer-input {
      display: flex;
      align-items: center;
      input {
        padding-left: 11.72rpx;
        padding-right: 10rpx;
        width: 193.36rpx;
        height: 47.61rpx;
        background: #ffffff;
        border-radius: 8.06rpx;
      }
      .footer-button {
        border: 1px solid #502459;
        width: 100.34rpx;
        height: 47.61rpx;
        background: #fff;
        border-radius: 0px 8.06rpx 8.06rpx 0px;
        text-align: center;
        line-height: 47.61rpx;
        text {
          width: 37.35rpx;
          height: 25.63rpx;
          font-size: 18.31rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #502459;
        }
      }
    }
    .must-code {
      width: 80.97rpx;
      height: 16.85rpx;
      font-size: 12.45rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ff6060;
      line-height: 16.85rpx;
      margin-top: 14px;
      margin-right: 230rpx;
    }
    .new-code {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .shenfen {
        margin-top: 39.55rpx;

        height: 20.51rpx;
        font-size: 14.65rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 20.51rpx;
        letter-spacing: 5.13rpx;
      }
      .divider-image {
        width: 311.28rpx;
        height: 21.97rpx;
        margin-bottom: 19.78rpx;
        margin-top: 21.97rpx;
      }
      .user-name {
        text-align: center;
        /* margin-left: 30rpx; */
        width: 294.66rpx;
        height: 38.82rpx;
        font-size: 27.83rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: bold;
        color: #a57f4d;
        line-height: 38.82rpx;
        margin-bottom: 18.31rpx;
      }
    }
  }
}

@media screen and (min-width: 1360px) {
  .footer {
    margin-top: 20rpx !important;
  }
  .fixTop {
    top: 34rpx !important;
  }
}

@media screen and (min-width: 1024px) {
  .text-two {
    // width: 200rpx !important;
  }
  .back-index {
    text {
      width: 60rpx !important;
    }
  }
}

@media screen and (max-width: 568px) and (min-width: 200px) {
  .back-home {
    display: flex;
    align-items: center;
    margin-top: 56rpx;
    .now-back {
      font-size: 29.58rpx !important;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 24.17rpx;
    }
    .back {
      margin-left: 25rpx !important;
      font-size: 29.58rpx !important;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: bold;
      color: #43C9A7;
      line-height: 24.17rpx;
      text-decoration: underline;
    }
  }
  .fixTop {
    top: 70rpx !important;
  }
  .register-container {
    .title-text {
      margin-top: 70rpx;
      width: 200rpx;
      height: 48rpx;
      font-size: 34rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.86);
      line-height: 48rpx;
      margin-bottom: 70rpx;
      text-align: center;
    }
    .top-container {
      image {
        width: 64rpx;
        height: 64rpx;
      }
      text {
        width: 180rpx;
        height: 48rpx;
        font-size: 34rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: bold;
        color: #43c9a7;
        line-height: 48rpx;
        text-align: center;
      }
    }
    .enter-family {
      margin-top: 50rpx;
      // width: 496rpx;
      height: 66rpx;
      font-size: 48rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: bold;
      color: #333333;
      line-height: 66rpx;
    }
    .text-one {
      margin-right: -30rpx;
      // width: 595rpx;
      height: 90rpx !important;
      font-size: 30rpx !important;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 50rpx;
      .text-two {
        margin-top: 20rpx;
        // width: 400rpx;
        font-size: 30rpx !important;
        padding-left: 45rpx;
      }
    }
    .back-index {
      width: 460rpx !important;
      height: 96rpx !important;
      background: #502459;
      border-radius: 12rpx;
      line-height: 96rpx;
      margin-top: 50rpx;
      text {
        width: 136rpx;
        height: 48rpx;
        font-size: 34rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 48rpx;
      }
    }
    .footer {
      background-size: 636rpx 360rpx !important;
      .footer-text {
        width: 100%;
        margin-top: 96rpx;
        display: flex;
        flex-direction: column;
        .des {
          margin-left: 96rpx;
          display: block;
          margin-right: 100rpx !important;
          width: 560rpx;
          height: 40rpx;
          font-size: 28rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 40rpx;
        }
        .code {
          margin-bottom: 70rpx;
          margin-left: 236rpx;
          margin-top: 14rpx;
          width: 280rpx;
          height: 40rpx;
          font-size: 28rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 40rpx;
        }
      }
      .footer-input {
        margin-top: 100rpx;
        display: flex;
        align-items: center;
        input {
          box-sizing: border-box;
          padding-top: 24rpx;
          padding-bottom: 24rpx;
          padding-left: 16rpx;
          padding-right: 10rpx;
          width: 380rpx;
          height: 96rpx;
          background: #ffffff;
          border-radius: 8.06rpx;
          font-size: 34rpx;
        }
        .footer-button {
          width: 164rpx;
          height: 96rpx;
          background: #502459;
          border-radius: 0rpx 12rpx 12rpx 0px;
          line-height: 96rpx;
          text {
            width: 68rpx;
            height: 48rpx;
            font-size: 34rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ffffff;
          }
        }
      }
      .must-code {
        width: 166rpx;
        height: 36rpx;
        font-size: 26rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ff6060;
        line-height: 36rpx;
        margin-right: 355rpx !important;
      }
      .new-code {
        /* margin-top: 76rpx; */
        display: flex;
        flex-direction: column;
        align-items: center;
        .shenfen {
          width: 345rpx;
          height: 40rpx;
          font-size: 28rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 40rpx;
          letter-spacing: 5rpx;
          margin-bottom: 5rpx;
        }
        .divider-image {
          width: 556rpx;
          height: 40rpx;
          margin-top: 66rpx;
          margin-bottom: 30rpx;
        }
        .user-name {
          text-align: center;
          width: 610rpx;
          height: auto;
          font-size: 36rpx;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: bold;
          color: #a57f4d;
          line-height: 50rpx;
          margin-bottom: 0;
        }
        .user-image {
          width: 252rpx;
          height: 66rpx;
          margin-top: 20rpx;
        }
      }
    }
  }
}
/* @media screen and (max-width: 1400px) and (min-width: 700px) {
  .reget-container {
    padding-top: 14rpx !important;
  }
} */

/* @media screen and (max-width: 568px) and (min-width: 320px) {
  .top-container {
    text {
      width: 100.17rpx !important;
    }
  }
  .text-one {
    width: 450rpx !important;
  }
  .text-two {
    margin-top: 12rpx !important;
    width: 300rpx !important;
  }
  .back-index {
    text {
      width: 100rpx !important;
    }
  }
  .footer-button {
    height: 60rpx !important;
  }
} */
</style>