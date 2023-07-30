<template>
  <view class="protocol-container"  v-if="isShowAddressSelect">
    <view :class="[isShowContentFlag ? 'content-show' : 'content-close','content']">
      <view class="close" @click="closeHandle(1)"><uni-icons type="closeempty" size="20"></uni-icons></view>
      <view class="title">租赁服务协议</view>
      <view class="article">
        <view v-html="portalContent.detail"></view>
      </view>
      <view class="btn" @click="closeHandle(2)">我已阅读并同意《租赁服务协议》</view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        isShowContentFlag: false,
        isShowAddressSelect: false,
        portalContent: ''
      }
    },
    mounted() {
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
      this.getPortalAgreement()
    },
    methods: {
      closeHandle(type) {
        this.isShowContentFlag = false
        setTimeout(() => {
          this.isShowAddressSelect = false
        }, 200)
        this.$emit('closeProtocolHandle', type)
      },
      getPortalAgreement() {
        this.$request({
          url: '/gw/h5/v1/front/user/getPortalAgreement',
          method: 'get',
          data: {
            token: this.userInfo.token,
            type: 1
          }
        }).then(res => {
          if (res.status == 1000) {
            this.portalContent = res.data
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .protocol-container {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    z-index: 9999;
    color: #333;
    text-align: left;
    .content {
      width: 750rpx;
      max-width: 750rpx;
      background-color: #fff;
      border-top-left-radius: 25rpx;
      border-top-right-radius: 25rpx;
      font-size: 21.25rpx;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
      transition: height 0.2s;
      .close {
        position: absolute;
        right: 15rpx;
        top: 5rpx;
        padding: 10rpx;
      }
      .title {
        text-align: center;
        padding: 12.5rpx 0;
        font-weight: bold;
        font-size: 27.5rpx;
      }
      .article {
        max-height: 450rpx;
        font-size: 22.5rpx;
        padding: 0 25rpx;
        overflow: auto;
      }
      .btn {
        width: 397.5rpx;
        height: 60rpx;
        text-align: center;
        line-height: 60rpx;
        background-color: #43C9A7;
        color: #fff;
        font-size: 21.25rpx;
        border-radius: 7.5rpx;
        margin: 25rpx auto 0 auto;
      }
    }
    .content-close {
      height: 0;
    }
    .content-show {
      height: 630rpx;
    }
  }
  @media screen and (max-width: 500px) {
    .protocol-container {
      .content {
        border-top-left-radius: 40rpx;
        border-top-right-radius: 40rpx;
        font-size: 32rpx;
        .title {
          padding: 20rpx 0;
          font-size: 44rpx;
          font-weight: bold;
        }
        .article {
          max-height: 760rpx;
          font-size: 36rpx;
          padding: 0 40rpx;
          line-height: 60rpx;
        }
        .btn {
          width: 636rpx;
          height: 96rpx;
          line-height: 96rpx;
          font-size: 34rpx;
          border-radius: 12rpx;
          margin: 15rpx auto 0 auto;
        }
      }
      .content-close {
        height: 0;
      }
      .content-show {
        height: 980rpx;
      }
    }
  }
</style>