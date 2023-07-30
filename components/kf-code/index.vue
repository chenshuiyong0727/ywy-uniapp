<template>
  <view class="kf-code">
    <view class="kf-code-container">
      <view class="close">
        <uni-icons class="icon-close" type="closeempty" size="25" color="#333" @click="closeHandle"></uni-icons>
      </view>
      <view class="title">微信扫描二维码，添加客服</view>
      <image class="ewm" show-menu-by-longpress :src="imgPrefix + '/static/operateSteps/qrcode/'+ ewmName +'.jpg'"></image>
      <view class="tip">和家健脑客服</view>
    </view>
  </view>
</template>

<script>
  export default {
    props: {
      ewmName: {
        type: String,
        default: 'wd-lxkf'
      }
    },
    data() {
      return {
        imgPrefix: this.$imgPrefix,
      }
    },
    methods: {
      closeHandle() {
        this.$emit('closeKfHandle')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .kf-code {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    .kf-code-container {
      width: 292.98rpx;
      background-color: #fff;
      border-radius: 14.65rpx;
      padding: 21.97rpx;
      box-sizing: border-box;
      .close {
        text-align: right;
      
        .icon-close {
          padding: 7.32rpx;
          margin-right: -7.32rpx;
        }
      }
      .title {
        font-size: 17.58rpx;
        color: #502459;
        text-align: center;
        padding-bottom: 8.79rpx;
        margin-top: 7.32rpx;
      }
      .tip {
        text-align: center;
        padding-top: 5.13rpx;
        font-size: 13.19rpx;
      }
      .ewm {
        width: 124.51rpx;
        height: 124.51rpx;
        display: block;
        margin: 0 auto;
      }
    }
  }
  @media screen and (max-width: 500px) {
    .kf-code {
      .kf-code-container {
        width: 480rpx;
        border-radius: 20rpx;
        padding: 30rpx;
        .close {
          .icon-close {
            padding: 10rpx;
            margin-right: -10rpx;
          }
        }
        .title {
          font-size: 32rpx;
          padding-bottom: 22rpx;
        }
        .tip {
          font-size: 26rpx;
        }
        .ewm {
          width: 280rpx;
          height: 280rpx;
        }
      }
    }
  }
</style>