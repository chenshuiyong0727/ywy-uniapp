<template>
  <view>
    <!-- #ifndef MP -->
    <nav-bar title='认知记录'></nav-bar>
    <!-- #endif -->
    <view class="container">
      <view class="list" @click="goToPage(1)">
        <view class="list-left">
          <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-sc-record.png'"></image>
        </view>
        <view class="list-middle">
          <view class="title">认知障碍筛查记录</view>
          <view class="content"><text>{{fastSieveRecord.time || '--'}}</text><text>{{fastSieveRecord.count || '0'}}</text></view>
          <view class="_h6"><text>最近一次记录</text><text>累计记录</text></view>
        </view>
      </view>
      <view class="list" @click="goToPage(2)">
        <view class="list-left">
          <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-pg-record.png'"></image>
        </view>
        <view class="list-middle">
          <view class="title">认知评估记录</view>
          <view class="content"><text>{{artificialFastSieveRecord.time || '--'}}</text><text>{{artificialFastSieveRecord.count || '0'}}</text></view>
          <view class="_h6"><text>最近一次记录</text><text>累计记录</text></view>
        </view>
      </view>
      <view class="list" @click="goToTrain">
        <view class="list-left">
          <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-xl-record.png'"></image>
        </view>
        <view class="list-middle">
          <view class="title">认知症数字疗法记录</view>
          <view class="content"><text>{{trainPlanRecord.time || '--' }}</text><text>{{trainPlanRecord.count || '0'}}</text></view>
          <view class="_h6"><text>最近一次记录</text><text>累计记录</text></view>
        </view>
      </view>
    </view>
    <!--侧边栏-->
    <fab v-if="isShowFab" :isOpenFabMenu="isPad ? true : false"></fab>
    <!--end 侧边栏-->
  </view>
</template>

<script>
  import fab from '@/components/fab'
  import navBar from '@/components/nav-bar'
  import { navigateTo } from '../../utils/util'
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
        imgPrefix: this.$imgPrefix,
        userInfo: {},
        fastSieveRecord: {},
        trainPlanRecord: {},
        artificialFastSieveRecord: {}
      }
    },
    mounted() {
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
      this.getRecordList()
    },
    methods: {
      goToPage(type) {
        if (type == 1 && this.fastSieveRecord.count > 0) {
          navigateTo('/pages/evaluation/quick-sieve-record')
        } else if (type == 1 && this.fastSieveRecord.count <= 0) {
          uni.showToast({
            title: '暂无记录',
            icon: 'none',
            duration: 2000
          })
        }
        if (type == 2 && this.artificialFastSieveRecord.count > 0) {
          getApp().goAppointmentDetail({
            token: this.userInfo.token,
            type: 2,
            cameraPermission: true
          })
        } else if (type == 2 && this.artificialFastSieveRecord.count <= 0) {
          uni.showToast({
            title: '暂无记录',
            icon: 'none',
            duration: 2000
          })
        }
      },
      getRecordList() {
        this.$request({
          url: '/gw/h5/v1/statistics/all',
          method: 'get',
          data: {
            token: this.userInfo.token
          }
        }).then(res => {
          if (res.status === 1000) {
            this.fastSieveRecord = res.data ? res.data.fastsieve : {}
            this.trainPlanRecord = res.data ? res.data.trainplan : {},
            this.artificialFastSieveRecord = res.data ? res.data.artificialFastSieve : {}
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      goToTrain() {
        if (this.$pad && this.trainPlanRecord.count > 0) {
          let routes = getCurrentPages() //获取加载的页面
          let curRoute = routes[routes.length - 1].route //获取当前页面的对象
          let backUrl = encodeURIComponent(`/${curRoute}`)
          getApp().goCognitiveTraining({
            token: this.userInfo.token,
            isNeedLandscape: 'yes',
            redirectUrl: backUrl
          })
        } else if (!this.$pad && this.trainPlanRecord.count > 0) {
          navigateTo('/pages/cognitive-training/can-not-train')
        } else {
          uni.showToast({
            title: '暂无记录',
            icon: 'none',
            duration: 2000
          })
        }
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
    padding: 16.11rpx 11.72rpx;
    overflow: hidden;
    margin: 0 auto;

    .list {
      background-color: #fff;
      padding-right: 19.04rpx;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      border-radius: 14.65rpx;
      position: relative;
      margin-bottom: 11.72rpx;

      .list-left {
        width: 136.23rpx;
        height: 136.23rpx;
        border-radius: 14.65rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 18.31rpx;

        image {
          width: 86.43rpx;
          height: 81.3rpx;
        }
      }

      .list-middle {
        .title {
          font-size: 19.04rpx;
          font-weight: bold;
          padding-bottom: 20.51rpx;
        }

        .content {
          font-size: 17.58rpx;
          font-weight: bold;
          padding-bottom: 7.32rpx;

          text {
            display: inline-block;
            width: 109.87rpx;
            margin-right: 51.27rpx;
          }
        }

        ._h6 {
          font-size: 11.72rpx;
          color: #999;

          text {
            display: inline-block;
            width: 109.87rpx;
            margin-right: 51.27rpx;
          }
        }
      }

      &::after {
        content: '';
        width: 10.99rpx;
        height: 10.99rpx;
        border-top: 1px solid #D6D6D6;
        border-right: 1px solid #D6D6D6;
        position: absolute;
        top: 50%;
        right: 20.51rpx;
        transform: translateY(-50%) rotate(45deg);
      }
    }

    .list:nth-child(1) {
      .list-left {
        background: linear-gradient(135deg, #FFE5BA 0%, #FFC685 100%);
      }
    }

    .list:nth-child(2) {
      .list-left {
        background: linear-gradient(135deg, #B4F2FF 0%, #7DE2FF 100%);
      }
    }

    .list:nth-child(3) {
      .list-left {
        background: linear-gradient(135deg, #DCBFFF 0%, #B68BFF 100%);
      }
    }
  }
  @media screen and (max-width: 500px) {
    .container {
      width: 750rpx;
      max-width: 750rpx;
      padding: 30rpx;
    
      .list {
        padding-right: 20rpx;
        border-radius: 28rpx;
        margin-bottom: 24rpx;
    
        .list-left {
          width: 204rpx;
          height: 204rpx;
          border-radius: 28rpx;
          justify-content: center;
          margin-right: 28rpx;
    
          image {
            width: 130rpx;
            height: 130rpx;
          }
        }
    
        .list-middle {
          .title {
            font-size: 34rpx;
            padding-bottom: 18rpx;
          }
    
          .content {
            font-size: 30rpx;
            padding-bottom: 6rpx;
    
            text {
              width: 170rpx;
              margin-right: 50rpx;
            }
            &>text:nth-child(2) {
              width: 130rpx;
            }
          }
    
          ._h6 {
            font-size: 26rpx;
            text {
              width: 170rpx;
              margin-right: 50rpx;
            }
            &>text:nth-child(2) {
              width: 130rpx;
            }
          }
        }
    
        &::after {
          width: 15rpx;
          height: 15rpx;
          right: 20rpx;
        }
      }
    }
  }
</style>
