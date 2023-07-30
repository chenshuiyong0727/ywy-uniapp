<template>
  <begin title='健脑运动' :pageType="2">
    <view class="img-box" slot="imgs">
      <block v-if="isPad">
        <image class="img-1" :src="imgPrefix + '/static/operateSteps/micromotion-new-img-1.png?t=1'"></image>
        <image class="img-2" :src="imgPrefix + '/static/operateSteps/micromotion-new-img-2.png?t=1'"></image>
        <image class="img-3" :src="imgPrefix + '/static/operateSteps/micromotion-new-img-3.png?t=1'"></image>
        <image class="img-4" :src="imgPrefix + '/static/operateSteps/micromotion-new-img-4.png?t=1'"></image>
        <image class="img-5" :src="imgPrefix + '/static/operateSteps/micromotion-new-img-5.png?t=1'"></image>
      </block>
      <block v-else>
        <image class="img-1" :src="imgPrefix + '/static/operateSteps/mobile-micromotion-new-img-1.png?t=1'"></image>
        <image class="img-2" :src="imgPrefix + '/static/operateSteps/mobile-micromotion-new-img-2.png?t=1'"></image>
        <image class="img-3" :src="imgPrefix + '/static/operateSteps/mobile-micromotion-new-img-3.png?t=1'"></image>
        <image class="img-4" :src="imgPrefix + '/static/operateSteps/mobile-micromotion-new-img-4.png?t=1'"></image>
        <image class="img-5" :src="imgPrefix + '/static/operateSteps/mobile-micromotion-new-img-5.png?t=1'"></image>
      </block>
    </view>
    <!--侧边栏-->
    <fab slot="fab" v-if="isShowFab" :isOpenFabMenu="isPad ? true : false"></fab>
    <!--end 侧边栏-->
  </begin>
</template>

<script>
  import begin from '@/components/common-page/begin'
  import fab from '@/components/fab'
  import {mixin} from '@/mixin/mixin'
  export default {
    mixins:[mixin],
    components: {
      begin,
      fab
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
      height: 298.9rpx;
    }
    .img-2 {
      height: 172.89rpx;
    }
    .img-3 {
      height: 281.32rpx;
    }
    .img-4 {
      height: 345.79rpx;
    }
    .img-5 {
      height: 493.04rpx;
    }
  }
   @media screen and (max-width: 500px) {
     .img-box {
       image {
         width: 750rpx;
       }
       .img-1 {
         height: 602rpx;
       }
       .img-2 {
         height: 666rpx;
       }
       .img-3 {
         height: 498rpx;
       }
       .img-4 {
         height: 868rpx;
       }
       .img-5 {
         height: 892rpx;
       }
     }
   }
</style>