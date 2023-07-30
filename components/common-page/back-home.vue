<template>
  <view class="back-home">
    <view class="content" @click="goHome">
      <image src="../../static/images/com/home.png"></image>
      <view>返回首页</view>
    </view>
  </view>
</template>

<script>
  export default {
    methods: {
      goHome() {
        uni.switchTab({
          url: '/pages/index/index'
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .back-home {
    position: fixed;
    top: 20%;
    right: 0;
    .content {
      background-color: #fff;
      width: 64.47rpx;
      font-size: 14.65rpx;
      padding: 7.33rpx 3.66rpx;
      border-top-left-radius: 8.79rpx;
      border-bottom-left-radius: 8.79rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      image {
        width: 43.96rpx;
        height: 43.96rpx;
      }
    }
  }
  @media screen and (max-width: 500px) {
    .back-home {
      .content {
        width: 100rpx;
        font-size: 24rpx;
        padding: 10rpx 5rpx;
        border-top-left-radius: 12rpx;
        border-bottom-left-radius: 12rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        image {
          width: 60rpx;
          height: 60rpx;
        }
      }
    }
  }
</style>