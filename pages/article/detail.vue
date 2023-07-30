<template>
  <view>
   
    <nav-bar title='和家健脑'></nav-bar>
  
    <view class="container">
      <rich-text :nodes="articleDetail.detail"></rich-text>
    </view>
    <!--侧边栏-->
    <fab v-if="isShowFab" :isOpenFabMenu="isPad ? true : false"></fab>
    <!--end 侧边栏-->
  </view>
</template>

<script>
  import fab from '@/components/fab'
  import navBar from '@/components/nav-bar'
  import {mixin} from '@/mixin/mixin'
  export default {
    mixins:[mixin],
    components: {
      navBar,
      fab
    },
    data() {
      return {
        isPad: this.$pad,
        articleId: '',
        title: '',
        articleDetail: {}
      }
    },
    onLoad(options) {
      this.articleId = options.id
      this.title = options.title
      this.getArticleDetail()
    },
    methods: {
      getArticleDetail() {
        this.$request({
          url: '/gw/h5/v1/front/brainScience/detail',
          data: {
            id: this.articleId
          }
        }).then(res => {
          if (res.status === 1000) {
            this.articleDetail = res.data ? res.data : {}
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
    width: 750.02rpx;
    max-width: 750.02rpx;
    box-sizing: border-box;
    font-size: 21.97rpx;
    color: #333;
    overflow: hidden;
    margin: 0 auto;
    padding: 21.97rpx;
    box-sizing: border-box;
    img {
      width: 100% !important;
      height: auto !important;
    }
  }
</style>