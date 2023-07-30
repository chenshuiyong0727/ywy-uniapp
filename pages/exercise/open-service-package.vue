<template>
  <open-service-package :pageType="1" title='趣味健脑'>
    <view class="img-box">
      <block v-if="isPad">
        <image class="img-1" :src="imgPrefix + '/static/operateSteps/exercise-package-1.png?t='+ new Date().getTime()"></image>
        <image class="img-2" :src="imgPrefix + '/static/operateSteps/exercise-begin-1.png?t='+ new Date().getTime()"></image>
        <image class="img-3" :src="imgPrefix + '/static/operateSteps/exercise-begin-2.png?t='+ new Date().getTime()"></image>
        <image class="img-4" :src="imgPrefix + '/static/operateSteps/exercise-begin-3.png?t='+ new Date().getTime()"></image>
        <image class="img-5" :src="imgPrefix + '/static/operateSteps/exercise-begin-4.png?t='+ new Date().getTime()"></image>
      </block>
      <block v-else>
        <image class="img-1" :src="imgPrefix + '/static/operateSteps/mobile-micromotion-package-1.png?t='+ new Date().getTime()"></image>
        <image class="img-2" :src="imgPrefix + '/static/operateSteps/mobile-exercise-begin-1.png?t='+ new Date().getTime()"></image>
        <image class="img-3" :src="imgPrefix + '/static/operateSteps/mobile-exercise-begin-2.png?t='+ new Date().getTime()"></image>
        <image class="img-4" :src="imgPrefix + '/static/operateSteps/mobile-exercise-begin-3.png?t='+ new Date().getTime()"></image>
        <image class="img-5" :src="imgPrefix + '/static/operateSteps/mobile-exercise-begin-4.png?t='+ new Date().getTime()"></image>
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
    }
    .img-1 {
      height: 167.73rpx;
    }
    .img-2 {
      height: 339.12rpx;
    }
    .img-3 {
      height: 172.86rpx;
    }
    .img-4 {
      height: 281.26rpx;
    }
    .img-5 {
      height: 345.79rpx;
    }
  }
  @media screen and (max-width: 500px) { 
    .img-box {
      image {
        width: 750rpx;
      }
      .img-1 {
        height: 478rpx;
      }
      .img-2 {
        height: 1088rpx;
      }
      .img-3 {
        height: 666rpx;
      }
      .img-4 {
        height: 498rpx;
      }
      .img-5 {
        height: 544rpx;
      }
    }
  }
</style>