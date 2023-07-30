<template>
  <view class="container">
    <view class="image-box">
      <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/haibao.png'"></image>
    </view>
    <view class="bottom-container">
      <view class="left-box">
        <image class="kefu-image" src="../../static/images/applet/icon_kefu.png" />
        <text>客服咨询</text>
      </view>
      <button class="submit-button">
        <text>立即报名</text>
      </button>
    </view>
  </view>
</template>
<script>
  export default {
    data() {
      return {
        imgPrefix: this.$imgPrefix
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    .image-box>image {
      min-height: 100vh;
      max-width: 750.02rpx;
      width: 750rpx;
      height: 720.7rpx;
    }

    .bottom-container {
      display: flex;
      align-items: center;
      width: 750rpx;
      height: 80.57rpx;
      background: #ffffff;

      .left-box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 119.38rpx;
        height: 80.57rpx;

        &>.kefu-image {
          height: 46.88rpx;
          width: 46.88rpx;
        }

        &>text {
          width: 64.45rpx;
          height: 21.97rpx;
          font-size: 16.11rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #5796f8;
          line-height: 21.97rpx;
        }
      }

      .submit-button {
        width: 618.9rpx;
        height: 61.52rpx;
        line-height: 61.52rpx;
        background: #43c9a7;
        border-radius: 7.32rpx;

        &>text {
          width: 82.03rpx;
          height: 29.3rpx;
          font-size: 20.51rpx;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: bold;
          color: #ffffff;
        }
      }
    }
  }

  @media screen and (max-width: 576px) and (min-width: 330px) {
    .left-box {
      &>text {
        width: 100rpx !important;
      }
    }

    .submit-button {
      padding-bottom: 74.9rpx;
    }
  }

  @media screen and (max-width: 320px) {
    .left-box {
      margin-bottom: 10rpx;

      &>text {
        margin-left: 15rpx;
        width: 120rpx !important;
      }
    }

    .submit-button {
      margin-bottom: 10rpx;
      padding-bottom: 74.9rpx;
    }
  }
</style>
