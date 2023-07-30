<template>
  <view>
   
    <nav-bar title='认知症数字疗法'></nav-bar>
  
    <view class="container">
      <image class="logo" :src="imgPrefix + '/static/operateSteps/portalH5/pages/logo.png'"></image>
      <image class="mobile-tip" :src="imgPrefix + '/static/operateSteps/portalH5/pages/mobile-tip.png'"></image>
    </view>
    <!--侧边栏-->
    <fab :isOpenFabMenu="isPad ? true : false"></fab>
    <!--end 侧边栏-->
  </view>
</template>

<script>
  import fab from '@/components/fab'
  import navBar from '@/components/nav-bar'
  export default {
    components: {
      navBar,
      fab
    },
    data() {
      return {
        isPad: this.$pad,
        imgPrefix: this.$imgPrefix
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    width: 100%;
    max-width: 750rpx;
    min-height: calc(100vh - 47px);
    overflow: hidden;
    background-color: #502459;
    image {
      display: block;
      margin: 0 auto;
    }
    .logo {
      width: 298rpx;
      height: 106rpx;
      margin: 112rpx auto;
    }
    .mobile-tip {
      width: 750rpx;
      height: 316rpx;
    }
  }
</style>