<template>
  <view>
   
    <nav-bar title='认知筛查记录' :backdelta="backdelta"></nav-bar>
   
    <view class="container">
      <block v-if="recordData.length">
        <view :class="[item.status != 1 ? 'not-finished' : 'finished', 'list']" v-for="item in recordData"
          :key="item.orderid">
          <view>
            <view class="status">
              <block v-if="item.status === 0 || item.status === -1">
                <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-unnormal.png'"></image>
                <text class="not-finished-2">未完成筛查</text>
              </block>
              <block v-else>
                <block v-if="item.lockStatus == 1">
                  <image v-if="item.type == 'N'" :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-normal.png'"></image>
                  <image v-else :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-danger.png'"></image>
                  <text :class="[item.type == 'N' ? '' : '_color']">{{item.type | dictToDesc('EVALUATIONTYPE')}}</text>
                </block>
                <block v-else>
                  <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-lock-2.png'"></image>
                  <text class="_color3">待解锁报告</text>
                </block>
              </block>
            </view>
            <view class="time">{{item.reporttime | formateTime}}的筛查结论</view>
          </view>
          <!-- <view class="do-continue" v-if="item.status === 0" @click="goEvaluation(item.orderid)">继续筛查</view>
          <view class="text-cancel" v-else-if="item.status === -1">订单已取消</view> -->
          <view v-if="item.status === 1 && item.lockStatus == -1" class="btn btn-lock" @click="unlockHandle(item.orderid)">立即解锁</view>
          <view v-if="item.status === 1 && item.lockStatus == 1" class="btn btn-report" @click="lookReportHandle(item.orderid)">查看报告</view>
          <view class="btn" v-else-if="item.status === 0" @click="goEvaluation(item.orderid)">继续筛查</view>
          <view class="text-cancel" v-else-if="item.status === -1">订单已取消</view>
        </view>
      </block>
      <block v-else-if="isDoneRequest && !recordData.length">
        <empty-data></empty-data>
      </block>
    </view>
    <!--侧边栏-->
    <fab v-if="isShowFab" :isOpenFabMenu="isPad ? true : false"></fab>
    <!--end 侧边栏-->
  </view>
</template>

<script>
  import fab from '@/components/fab'
  import navBar from '@/components/nav-bar'
  import emptyData from '@/components/empty-data'
  import { navigateTo } from '../../utils/util.js'
  import {mixin} from '@/mixin/mixin'
  export default {
    mixins:[mixin],
    components: {
      navBar,
      emptyData,
      fab
    },
    data() {
      return {
        backdelta: 1,
        userInfo: {},
        recordData: [],
        isDoneRequest: false,
        isPad: this.$pad,
        imgPrefix: this.$imgPrefix
      }
    },
    onLoad(options) {
      if (options.backdelta) {
        this.backdelta = options.backdelta
      }
    },
    mounted() {
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
      this.getList()
    },
    filters: {
      // getStatus(type) {
      //   switch (type) {
      //     case 'N':
      //       return '认知正常'
      //     case 'CI':
      //       return '疑似认知功能障碍'
      //     case 'AD':
      //       return '疑似痴呆'
      //     case 'MDD':
      //       return '疑似抑郁'
      //     default:
      //       return '--'
      //   }
      // },
      formateTime(time) {
        return time ? time.split(' ')[0] : '--'
      }
    },
    methods: {
      getList() {
        this.$request({
          url: '/gw/h5/v1/fastsieve',
          method: 'get',
          data: {
            // orderid: '1527531362955825154',
            token: this.userInfo.token,
            pageSize: 100,
            pageNum: 1
          }
        }).then(res => {
          if (res.status === 1000) {
            this.recordData = res.data ? res.data.list : [],
            this.isDoneRequest = true
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      // goDetail(status, orderid) {
      //   if (status === -1 || status === 1) return
      //   getApp().goEvalution({
      //     token: this.userInfo.token,
      //     requestType: 2,
      //     payOrderId: orderid,
      //     backType: 2
      //   })
      // },
      lookReportHandle(orderid) {
        // 查看报告详情 跳转研一系统
        if (this.userInfo.info && this.userInfo.info.birthYear && this.userInfo.info.birthYear > 0 && this.userInfo.info.education) {
          getApp().goEvalution({
            token: this.userInfo.token,
            requestType: 2,
            payOrderId: orderid,
            backType: 2
          })
        } else {
          navigateTo('/pages/evaluation/sort?payOrderId='+orderid)
        }
      },
      unlockHandle(orderid) {
        navigateTo('/pages/evaluation/lock-report?payOrderId='+orderid)
      },
      goEvaluation(orderid) {
        if (this.userInfo.info && this.userInfo.info.birthYear && this.userInfo.info.birthYear > 0 && this.userInfo.info.education) {
          getApp().goEvalution({
            token: this.userInfo.token,
            requestType: 1,
            payOrderId: orderid,
            backType: 2
          })
        } else {
          navigateTo('/pages/evaluation/sort?payOrderId='+orderid)
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
      border-radius: 14.65rpx;
      padding: 21.97rpx 29.3rpx;
      margin-bottom: 16.11rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .btn {
        height: 46.88rpx;
        line-height: 46.88rpx;
        border-radius: 23.44rpx;
        padding: 0 25.64rpx;
        background-color: #43C9A7;
        border: 1px solid #43C9A7;
        color: #fff;
        font-size: 20rpx;
      }
      .btn-report {
        background-color: #fff;
        border: 1px solid #43C9A7;
        color: #43C9A7;
      }
      .btn-lock {
        background-color: #0D72FF;
        border: 1px solid #0D72FF;
        color: #fff;
      }
      
      &>view:nth-child(1) {
        flex: 1;
      }

      .status {
        padding-bottom: 10.25rpx;

        image {
          width: 33.69rpx;
          height: 33.69rpx;
          vertical-align: middle;
          margin-right: 7.32rpx;
        }

        text {
          font-size: 22.5rpx;
          color: #43C9A7;
          font-weight: bold;
          vertical-align: middle;
        }
        .not-finished-2 {
          color: #E9AE48;
        }

        ._color {
          color: #E2703D;
        }
        ._color3 {
          color: #0D72FF;
        }
      }

      .time {
        font-size: 20rpx;
        color: #999;
      }
    }

    .finished {
      // position: relative;

      // &::after {
      //   content: '';
      //   width: 10.99rpx;
      //   height: 10.99rpx;
      //   border-top: 1px solid #D6D6D6;
      //   border-right: 1px solid #D6D6D6;
      //   position: absolute;
      //   top: 50%;
      //   right: 20.51rpx;
      //   transform: translateY(-50%) rotate(45deg);
      // }
    }

    .not-finished {
      .do-continue {
        width: 156.74rpx;
        height: 52rpx;
        background-color: #502459;
        border-radius: 26rpx;
        color: #fff;
        font-size: 21.97rpx;
        text-align: center;
        line-height: 52rpx;
        align-self: flex-end;
      }
      
      .text-cancel {
        color: #999;
        font-size: 21.97rpx;
        padding-right: 20rpx;
      }
    }
  }
  @media screen and (max-width: 500px) {
    .container {
      width: 750rpx;
      max-width: 750rpx;
      padding: 30rpx;
    
      .list {
        border-radius: 28rpx;
        padding: 36rpx 26rpx;
        margin-bottom: 22rpx;
        
        .btn {
          height: 74rpx;
          line-height: 74rpx;
          border-radius: 37rpx;
          padding: 0 26rpx;
          font-size: 32rpx;
        }
        
        .status {
          padding-bottom: 16rpx;
    
          image {
            width: 52rpx;
            height: 52rpx;
            margin-right: 14rpx;
          }
    
          text {
            font-size: 34rpx;
          }
        }
    
        .time {
          font-size: 30rpx;
        }
      }
    
      .finished {
        // &::after {
        //   width: 15rpx;
        //   height: 15rpx;
        //   right: 20rpx;
        // }
      }
    
      .not-finished {
        .do-continue {
          width: 244rpx;
          height: 72rpx;
          border-radius: 36rpx;
          font-size: 30rpx;
          line-height: 72rpx;
        }
        .text-cancel {
          font-size: 30rpx;
        }
      }
    }
  }
</style>
