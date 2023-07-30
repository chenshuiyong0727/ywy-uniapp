<template>
  <view>
   
    <nav-bar title='趣味健脑订单记录'></nav-bar>
    
    <view class="container">
      <temp-order-list :orderType='1'></temp-order-list>
      <!--侧边栏-->
      <fab v-if="isShowFab" :isOpenFabMenu="isPad ? true : false"></fab>
      <!--end 侧边栏-->
    </view>
  </view>
</template>

<script>
  import fab from '@/components/fab'
  import navBar from '@/components/nav-bar'
  import tempOrderList from '@/components/temp-order-list'
  import { navigateTo } from '../../utils/util'
  import {mixin} from '@/mixin/mixin'
  export default {
    mixins:[mixin],
    components: {
      navBar,
      tempOrderList,
      fab
    },
    data() {
      return {
        isPad: this.$pad
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    width: 100%;
    max-width: 750.02rpx;
    box-sizing: border-box;
    font-size: 21.97rpx;
    color: #333;
    padding: 16.11rpx 11.72rpx 16.11rpx 11.72rpx;
    overflow: hidden;
    margin: 0 auto;
  }
  @media screen and (max-width: 500px) {
    .container {
      width: 100%;
      max-width: 750rpx;
      padding: 12rpx 0rpx;
    }
  }
</style>