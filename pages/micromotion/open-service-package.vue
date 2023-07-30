<template>
  <open-service-package :pageType="2" title='健脑运动'>
    <view class="img-box">
      <block v-if="isPad">
        <image class="img-1" :src="imgPrefix + '/static/operateSteps/micromotion-package-1.png?t=1'"></image>
        <image class="img-2" :src="imgPrefix + '/static/operateSteps/micromotion-new-img-1.png?t=1'"></image>
        <image class="img-3" :src="imgPrefix + '/static/operateSteps/micromotion-new-img-2.png?t=1'"></image>
        <image class="img-4" :src="imgPrefix + '/static/operateSteps/micromotion-new-img-3.png?t=1'"></image>
        <image class="img-5" :src="imgPrefix + '/static/operateSteps/micromotion-new-img-4.png?t=1'"></image>
      </block>
      <block v-else>
        <image class="img-1" :src="imgPrefix + '/static/operateSteps/mobile-micromotion-package-1.png?t=1'"></image>
        <image class="img-2" :src="imgPrefix + '/static/operateSteps/mobile-micromotion-new-img-1.png?t=1'"></image>
        <image class="img-3" :src="imgPrefix + '/static/operateSteps/mobile-micromotion-new-img-2.png?t=1'"></image>
        <image class="img-4" :src="imgPrefix + '/static/operateSteps/mobile-micromotion-new-img-3.png?t=1'"></image>
        <image class="img-5" :src="imgPrefix + '/static/operateSteps/mobile-micromotion-new-img-4.png?t=1'"></image>
      </block>
      
    </view>
  </open-service-package>
</template>

<script>
  import openServicePackage from '@/components/common-page/open-service-package'
  export default {
    components: {
      openServicePackage
    },
    data() {
      return {
        userInfo: {},
        imgPrefix: this.$imgPrefix,
        isPad: this.$pad
      }
    },
    mounted() {
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped>
  .img-box {
    image {
      width: 750.02rpx;
      display: block;
      margin: 0 auto;
    }
    .img-1 {
      height: 167.73rpx;
    }
    .img-2 {
      height: 298.84rpx;
    }
    .img-3 {
      height: 172.89rpx;
    }
    .img-4 {
      height: 281.32rpx;
    }
    .img-5 {
      height: 345.79rpx;
    }
  }
  @media screen and (max-width: 500px) { 
    .img-box {
      image {
        width: 750rpx;
        display: block;
      }
      .img-1 {
        height: 478rpx;
      }
      .img-2 {
        height: 602rpx;
      }
      .img-3 {
        height: 666rpx;
      }
      .img-4 {
        height: 498rpx;
      }
      .img-5 {
        height: 868rpx;
      }
    }
  }
</style>