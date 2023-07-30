<template>
  <view>
   
    <nav-bar :title="detail.businessType == '2210081722239380029' ? '认知评估' : '认知障碍筛查'" :backdelta="backdelta"></nav-bar>
    
    <view class="container">
      <temp-detail :detail="detail" :ewmName="detail.businessType =='2210081722239380029' ? 'rgpg-xqy' : 'znpg-xqy'">
        <view><rich-text :nodes="isPad ? detail.info : detail.appInfo"></rich-text></view>
      </temp-detail>
      
      <!--侧边栏-->
      <fab v-if="isShowFab" :isOpenFabMenu="isPad ? true : false"></fab>
      <!--end 侧边栏-->
    </view>
  </view>
</template>

<script>
  import fab from '@/components/fab'
  import navBar from '@/components/nav-bar'
  import tempDetail from '@/components/temp-detail'
  import { navigateTo } from '@/utils/util'
  import {mixin} from '@/mixin/mixin'
  export default {
    mixins:[mixin],
    components: {
      navBar,
      tempDetail,
      fab
    },
    data() {
      return {
        detail: {},
        isPad: this.$pad,
        backdelta: 1
      }
    },
    mounted() {
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
      this.getGoodsList()
    },
    onLoad(options) {
      this.goodsId = options.goodsId ? options.goodsId : ''
      if (options.backdelta) {
        this.backdelta = options.backdelta
      }
    },
    methods: {
      getGoodsList() {
        this.$request({
          url: '/gw/h5/v1/front/goods/goodsList',
          method: 'post',
          data: {
            token: this.userInfo.token,
            type: 1,
            userId: this.userInfo.userId
          }
        }).then(res => {
          if (res.status === 1000) {
            let goods = res.data ? res.data.filter(item => item.goodsId == this.goodsId) : []
            this.detail = goods.length ? goods[0] : {}
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
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
    overflow: hidden;
    margin: 0 auto;

    .img-1 {
      width: 100%;
      height: 720.72rpx;
    }
  }
</style>
