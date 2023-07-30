<template>
  <view class="container">
    <!-- <image class="banner" src="../../static/images/pages/banner.png"></image> -->
    <view class="health-container">
		 <view class="class-item">
			<view class="left-box">
				<image class="image-item" src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F6%2F58aa9ac3f343e.jpg&refer=http%3A%2F%2Fpic1.win4000.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1666507152&t=035a217eb3501f19e4614126d27932a3">
			</view>
			<view class="right-box">
				<text class="right-top">唤醒你的大脑，每天起床十分钟手1111131dfssdfsdfsdfsdf</text>
				<text class="right-center">零基础 10分钟</text>
				<text class="right-bottom">和家健脑 官方教程</text>
			</view>
		 </view>
     <view class="class-item">
			<view class="left-box">
				<image class="image-item" src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F6%2F58aa9ac3f343e.jpg&refer=http%3A%2F%2Fpic1.win4000.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1666507152&t=035a217eb3501f19e4614126d27932a3">
			</view>
			<view class="right-box">
				<text class="right-top">唤醒你的大脑，每天起床十分钟手1111131dfssdfsdfsdfsdf</text>
				<text class="right-center">零基础 10分钟</text>
				<text class="right-bottom">和家健脑 官方教程</text>
			</view>
		</view>
    <view class="class-item">
			<view class="left-box">
				<image class="image-item" src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F6%2F58aa9ac3f343e.jpg&refer=http%3A%2F%2Fpic1.win4000.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1666507152&t=035a217eb3501f19e4614126d27932a3">
			</view>
			<view class="right-box">
				<text class="right-top">唤醒你的大脑，每天起床十分钟手1111131dfssdfsdfsdfsdf</text>
				<text class="right-center">零基础 10分钟</text>
				<text class="right-bottom">和家健脑 官方教程</text>
			</view>
		</view>
    <view class="class-item">
			<view class="left-box">
				<image class="image-item" src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F6%2F58aa9ac3f343e.jpg&refer=http%3A%2F%2Fpic1.win4000.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1666507152&t=035a217eb3501f19e4614126d27932a3">
			</view>
			<view class="right-box">
				<text class="right-top">唤醒你的大脑，每天起床十分钟手1111131dfssdfsdfsdfsdf</text>
				<text class="right-center">零基础 10分钟</text>
				<text class="right-bottom">和家健脑 官方教程</text>
			</view>
		</view>
	</view>
  </view>
</template>

<script>
import { navigateTo } from '../../utils/util.js'
export default {
  data() {
    return {
      title: '首页1',
    }
  },
  onLoad() {
    // this.getUser()
  },
  methods: {
    // async getUser() {
    //   uni.showLoading({
    //     title: '加载中',
    //   })
    //   const res = await this.$request({
    //     url: '/api/applet/activity/queryUserNum', // 这是请求网址的地址
    //     method: 'get',
    //     data: {
    //       activityId: 1,
    //     },
    //   })
    //   console.log(res) // 打印出来看我们请到的数据
    // },
    // naveToPage(url) {
    //   // console.log(url)
    //   navigateTo(url)
    // },
    // go2() {
    //   navigateTo('/pages/micromotion/index')
    // },
  },
}
</script>

<style scoped>
.container {
  background: #f5f5f5;
  min-height: 100vh;
  width: 750.02rpx;
  max-width: 750.02rpx;
  box-sizing: border-box;
  font-size: 21.97rpx;
  color: #333;
  padding: 21.97rpx 11.72rpx;
  overflow: hidden;
}

.banner {
  width: 726.56rpx;
  height: 279.79rpx;
}

.health-container {
  margin-top: 21.97rpx;
  display: flex;
  flex-direction: column;
}

.class-item {
  margin-top: 21.97rpx;
  display: flex;
  height: 175.78rpx;
}

.class-item:first-child {
  margin-top: 0;
}

.right-box {
  box-sizing: border-box;
  padding: 24.9rpx 0;
  margin-left: 20.51rpx;
  display: flex;
  flex-direction: column;
}

.right-top {
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 421.88rpx;
  height: 36.62rpx;
  font-size: 26.37rpx;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: bold;
  color: #333333;
  line-height: 36.62rpx;
}

.right-center {
  margin-top: 5.86rpx;
  margin-bottom: 29.3rpx;
  width: 100%;
  height: 27.1rpx;
  font-size: 19.04rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 27.1rpx;
}

.right-bottom {
  width: 100%;
  height: 27.1rpx;
  font-size: 19.04rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  line-height: 27.1rpx;
}

.image-item {
  width: 263.67rpx;
  height: 175.78rpx;
  background: linear-gradient(180deg, #a4b0bd 0%, #8b99aa 100%);
  border-radius: 14.65rpx;
}
</style>
