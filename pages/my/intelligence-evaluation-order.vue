<template>
  <view>
   
    <nav-bar title='认知筛查记录' :backUrl="backUrl"></nav-bar>

    <view class="container">
      <block v-if="orderList.length">
        <view :class="[item.status != 1 ? 'not-finished' : 'finished', 'list']" v-for="item in orderList" :key="item.orderid">
          <view v-if="!isPad" class="report-time brToHalf">{{item.reporttime | formateTime}}</view>
          <view class="list-bottom">
            <view class="list-left">
              
              <view class="item item-2">
                <view>筛查结果</view>
                <view>
                  <block v-if="item.status === 0 || item.status === -1">
                    <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-unnormal.png'"></image>
                    <text>未完成筛查</text>
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
                  <!-- <image :src="item.type != 'N' ? imgPrefix + '/static/operateSteps/portalH5/pages/icon-unnormal.png' : imgPrefix + '/static/operateSteps/portalH5/pages/icon-normal.png'"></image> -->
                </view>
              </view>
              <view class="item" v-if="isPad">
                <view>筛查时间</view>
                <view>{{item.reporttime | formateTime}}</view>
              </view>
              <view class="item">
                <view>实付款</view> 
                <view v-if="item.lockStatus == 1">¥{{item.price ? item.price / 100 : '--'}}</view>
                <view v-else>待付款</view>
              </view>
            </view>
            <view v-if="item.status === 1 && item.lockStatus == -1" class="btn btn-lock" @click="unlockHandle(item.orderid)">立即解锁</view>
            <view v-if="item.status === 1 && item.lockStatus == 1" class="btn btn-report" @click="lookReportHandle(item.orderid)">查看报告</view>
            <view class="btn" v-else-if="item.status === 0" @click="goEvaluation(item.orderid)">继续筛查</view>
            <view class="text-cancel" v-else-if="item.status === -1">订单已取消</view>
            
          </view>
        </view>
      </block>
      <block v-else-if="isDoneRequest && !orderList.length">
        <empty-data></empty-data>
      </block>
      <!--侧边栏-->
      <fab v-if="isShowFab" :isOpenFabMenu="isPad ? true : false"></fab>
      <!--end 侧边栏-->
    </view>
  </view>
</template>

<script>
  import fab from '@/components/fab'
  import navBar from '@/components/nav-bar'
  import emptyData from '@/components/empty-data'
  import { navigateTo } from '../../utils/util'
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
        userInfo: {},
        orderList: [],
        isDoneRequest: false,
        isPad: this.$pad,
        imgPrefix: this.$imgPrefix,
        thirdToken: '',
        crossLoad: false,
        backUrl: ''
      }
    },
    onLoad(options) {
      this.thirdToken = options.thirdToken ? options.thirdToken : ''
      if (this.thirdToken) {
        this.crossLoad = true
        this.backUrl = '/pages/index/index'
        getApp().thirdLoginByToken(this.thirdToken).then(res => {
          if (res.loginStatus == 1) {
            // 登录成功
            this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
            this.getList()
          }
        })
      }
    },
    onShow() {
      if (!this.crossLoad) {
        this.backUrl = ''
        this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
        this.getList()
      } else {
        this.crossLoad = false
      }
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
            token: this.userInfo.token,
            pageSize: 100,
            pageNum: 1
          }
        }).then(res => {
          if (res.status === 1000) {
            this.orderList = res.data ? res.data.list : []
            this.isDoneRequest = true
          }
        })
      },
      // goDetail(totalresult, orderid) {
      //   if (totalresult == 1) return
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
  @function tovmin($rpx){
    @return #{$rpx * 100 / 750}vmin; 
  }
            
  .container {
    width: 100%;
    max-width: tovmin(750.02);
    box-sizing: border-box;
    font-size: tovmin(21.97);
    color: #333;
    padding: tovmin(16.11) tovmin(11.72) tovmin(16.11) tovmin(11.72);
    overflow: hidden;
    margin: 0 auto;
    .list {
      background-color: #fff;
      border-radius: tovmin(14.65);
      .list-bottom {
        padding: tovmin(14.65) tovmin(21.97);
        margin-bottom: tovmin(11.72);
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .list-left {
        display: flex;
        align-items: flex-start;
      }
      .item {
        margin-right: tovmin(56.25);
        //min-width: tovmin(120);
        &>view:nth-child(1) {
          font-size: tovmin(20);
          color: #999;
          padding-bottom: tovmin(14.65);
        }
        &>view:nth-child(2) {
          font-size: tovmin(22.5);
          color: #333;
          font-weight: bold;
        }
        ._color {
          color: #E2703D;
        }
       ._color3 {
         color: #0D72FF;
       }
      }
      .item-2 {
        width: tovmin(212.5);
        flex: 0 0 tovmin(212.5);
        margin-right: tovmin(25);
        &>view:nth-child(2) {
          display: flex;
          align-items: center;
          color: #43C9A7;
          image {
            width: tovmin(26.37);
            height: tovmin(26.37);
            margin-right: tovmin(5.86);
            flex: 0 0 tovmin(26.37);
          }
        }
      }
      .btn {
        height: tovmin(46.88);
        line-height: tovmin(46.88);
        border-radius: tovmin(23.44);
        padding: 0 tovmin(20);
        background-color: #43C9A7;
        border: 1px solid #43C9A7;
        color: #fff;
        font-size: tovmin(20);
        box-sizing: border-box;
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
      .text-cancel {
        color: #999;
        font-size: tovmin(14.65);
        padding-right: tovmin(20);
      }
    }
    .finished {
      // position: relative;
      // &::after {
      //   content: '';
      //   width: tovmin(10.99);
      //   height: tovmin(10.99);
      //   border-top: 1px solid #D6D6D6;
      //   border-right: 1px solid #D6D6D6;
      //   position: absolute;
      //   top: 50%;
      //   right: tovmin(20.51);
      //   transform: translateY(-50%) rotate(45deg);
      // }
    }
    .not-finished {
      .item-2 {
        &>view:nth-child(2) {
          color: #E9AE48;
        }
      }
    }
  }
  @media screen and (max-width: 500px) {
    .container {
      width: tovmin(750);
      max-width: tovmin(750);
      padding: tovmin(12) tovmin(0);
      .list {
        border-radius: tovmin(0);
        .report-time {
          padding: tovmin(16) tovmin(26);
          font-size: tovmin(34);
          font-weight: bold;
        }
        .list-bottom {
          padding: tovmin(28) tovmin(26);
          margin-bottom: tovmin(12);
        }
        .item {
          margin-right: tovmin(90);
          &>view:nth-child(1) {
            font-size: tovmin(28);
            padding-bottom: tovmin(20);
          }
          &>view:nth-child(2) {
            font-size: tovmin(34);
          }
        }
        .item-2 {
          width: tovmin(250);
          flex: 0 0 tovmin(250);
          margin-right: tovmin(40);
          &>view:nth-child(2) {
            image {
              width: tovmin(40);
              height: tovmin(40);
              margin-right: tovmin(16);
              flex: 0 0 tovmin(40);
            }
          }
        }
        .btn {
          height: tovmin(74);
          line-height: tovmin(74);
          border-radius: tovmin(42);
          padding: 0 tovmin(26);
          font-size: tovmin(32);
        }
        .text-cancel {
          font-size: tovmin(28);
          padding-right: tovmin(6);
        }
      }
      .finished {
        // &::after {
        //   width: tovmin(15);
        //   height: tovmin(15);
        //   top: tovmin(25);
        //   right: tovmin(26);
        //   transform: translateY(0%) rotate(45deg);
        // }
      }
    }
  }
</style>