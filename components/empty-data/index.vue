<template>
  <view class="empty-data">
    <image class="img-no-data" src="../../static/images/pages/no-data.png"></image>
    <view class="tip">{{tips}}</view>
  </view>
</template>

<script>
  export default {
    props: {
      tips: {
        type: String,
        default: '抱歉，当前页面暂无数据'
      }
    }
  }
</script>

<style lang="scss" scoped>
  .empty-data {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .img-no-data {
      width: 200rpx;
      height: 200rpx;
      display: block;
    }
    .tip {
      text-align: center;
      font-size: 21.25rpx;
    }
  }
  @media screen and (max-width: 500px) {
    .empty-data {
      .img-no-data {
        width: 360rpx;
        height: 360rpx;
      }
      .tip {
        text-align: center;
        font-size: 32rpx;
      }
    }
  }
</style>