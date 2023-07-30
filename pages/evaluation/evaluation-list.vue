<template>
  <view>
    <nav-bar title='筛查报告列表'></nav-bar>
    <view class="container">
      
      <block v-if="requestDone && evaluationData.length">
        <view class="card-list">
          <view class="item" v-for="item in evaluationData" :key="item.id">
            <view class="item-top brToHalf">
              <view>{{item.portalCreateTime.split(' ')[0]}}下单</view>
              <view class="be-paid">
                {{item.orderStatus | dictToDesc('ORDERSTATUS')}}
              </view>
            </view>
            <view class="item-bottom">
              <view class="item-detail brToHalf">
                <image :src="imgPrefix + item.iconUrl"></image>
                <view class="item-text">
                  <view>{{item.subject}}</view>
                  <view>{{item.body}}</view>
                </view>
              </view>
              <view class="item-btn">
                <view @click="goDetail(item)"><text class="_text">详情</text></view>
                <view class="btn-style" v-if="item.orderStatus == 15" @click="unlockHandle(item)"><text class="_text">立即解锁</text></view>
                <view class="btn-style" v-if="item.orderStatus == 60" @click="lookReportHandle(item)"><text class="_text">查看报告</text></view>
              </view>
            </view>
          </view>
        </view>
      </block>
      <block v-if="requestDone && !evaluationData.length">
        <view class="empty"><empty-data tips="当前暂无数据"></empty-data></view>
      </block>
      <view :class="[isShowfixedBtmBg ? 'fixed-bottom-bg' : '', 'fixed-bottom']">
        <view class="btn-return" @click="returnBack">返回</view>
      </view>
    </view>
  </view>
</template>

<script>
  import { navigateTo } from '@/utils/util'
  import navBar from '@/components/nav-bar'
  import emptyData from '@/components/empty-data'
  export default {
    components: {
      navBar,
      emptyData,
    },
    data() {
      return {
        evaluationData: [],
        imgPrefix: this.$imgPrefix,
        isPad: this.$pad,
        orderList: [],
        queryParam: {
          pageSize: 10,
          pageNum: 1
        },
        
        openType: this.$openType,
        orderTotalCount: 0,
        timer: null,
        requestDone: false,
        payResultText: '训练',
        // 字典
        sysDictList: [],
        isShowKfCode: false,
        isShowfixedBtmBg: true,
        // 继续支付成功后H5的回跳地址
        yjmchReturnUrl: '/pages/order/index'
      }
    },
    computed: {
      evaluationDataLen() {
        return this.evaluationData.length
      }
    },
    watch: {
      evaluationDataLen(newVal, oldVal) {
        let count = this.isPad ? 4 : 3
        if (newVal < count) {
          this.isShowfixedBtmBg = false
        } else {
          this.isShowfixedBtmBg = true
        }
      }
    },
    mounted() {
      
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
      
      this.getEvaluationList()
    },
    methods: {
      getEvaluationList() {
        this.$request({
          url: '/gw/h5/v1/front/order/fastSieveOrder',
          method: 'post',
          data: {
            token: this.userInfo.token,
            userId: this.userInfo.userId,
            ...this.queryParam
          }
        }).then(res => {
          if (res.status === 1000) {
            this.evaluationData = res.data ? res.data.list ? res.data.list : [] : []
            for (let i = 0; i < this.evaluationData.length; i++) {
              if (this.evaluationData[i].businessType == '2210081722313010031') {
                // 筛查
                this.$set(this.evaluationData[i], 'iconUrl', '/static/operateSteps/portalH5/order-card-img-4.png')
              }
            }
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
          this.requestDone = true
        })
      },
      getListSysDictFront() {
        this.$request({
          url: '/gw/h5/v1/base/sys/dict/listSysDictFront',
          method: 'post'
        }).then(res => {
          if (res.status === 1000) {
            this.sysDictList = res.data
          }
        })
      },
      
      
      
      
      goDetail(item) {
        // navigateTo('/pages/order/detail?payOrderId='+item.payOrderId)
        if (item.orderStatus == 15) {
          // 待解锁报告详情
          navigateTo('/pages/order/lock-report-detail?payOrderId='+item.payOrderId)
        } else {
          navigateTo('/pages/order/detail?payOrderId='+item.payOrderId)
        }
      },
      unlockHandle(item) {
        navigateTo('/pages/evaluation/lock-report?payOrderId='+item.payOrderId)
      },
      lookReportHandle(item) {
        // 查看报告详情 跳转研一系统
        if (this.userInfo.info && this.userInfo.info.birthYear && this.userInfo.info.birthYear > 0 && this.userInfo.info.education) {
          getApp().goEvalution({
            token: this.userInfo.token,
            requestType: 2,
            payOrderId: item.payOrderId,
            backType: 2
          })
        } else {
          navigateTo('/pages/evaluation/sort?payOrderId='+item.payOrderId)
        }
      },
      onReachBottom(e) {
        if (Math.ceil(this.orderTotalCount / this.queryParam.pageSize) > this.queryParam.pageNum) {
          // 有下一页
          // this.pageNum++
          this.queryParam.pageNum++
          this.getEvaluationList()
        } else {
          this.isShowfixedBtmBg = false
        }
      },
      onPageScroll() {
        this.isShowfixedBtmBg = true
      },
      returnBack() {
        const pages = getCurrentPages()
        let prevPage = pages[pages.length - 2]
        console.log(prevPage)
        if (pages.length === 1) { //如果只有一个调用原生js
          // #ifdef H5
          history.back()
          // #endif
        } else {
          uni.navigateBack({
            delta: 1
          })
        }
      },
      
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    width: 750rpx;
    max-width: 750rpx;
    box-sizing: border-box;
    font-size: 20rpx;
    color: #333;
    padding: 20rpx 0rpx 90rpx 0;
    margin: 0 auto;
    
    .card-list {
      padding: 0 16.25rpx;
      .item {
        background-color: #fff;
        padding: 12.5rpx 0;
        border-radius: 12.5rpx;
        margin-bottom: 12.5rpx;
        .item-top {
          display: flex;
          justify-content: space-between;
          padding: 0 17.5rpx 11.25rpx 17.5rpx;
          font-size: 20rpx;
          color: #999;
          .be-paid {
            color: #DF5C1D;
          }
        }
        .item-bottom {
          padding: 17.5rpx 17.5rpx 0 17.5rpx;
          .item-detail {
            display: flex;
            
            padding-bottom: 17.5rpx;
            image {
              width: 81.25rpx;
              height: 81.25rpx;
              margin-right: 15rpx;
              border-radius: 15rpx;
              flex: 0 0 81.25rpx;
            }
            .item-text {
              &>view:nth-child(1) {
                font-size: 22.5rpx;
                font-weight: bold;
                padding-bottom: 12.5rpx;
              }
              &>view:nth-child(2) {
                font-size: 20rpx;
                color: #666;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
                line-height: 31.25rpx;
              }
            }
          }
          .item-btn {
            display: flex;
            justify-content: flex-end;
            margin-top: 12.5rpx;
            &>view {
              width: 130rpx;
              height: 47.5rpx;
              text-align: center;
              border-radius: 25rpx;
              font-size: 20rpx;
              margin-left: 10rpx;
              border: 1px solid #DBE1E4;
              ._text {
                line-height: 47.5rpx;
              }
            }
            &>view.btn-style {
              background-color: #43C9A7;
              border: 1px solid #43C9A7;
              color: #fff;
              font-weight: bold;
            }
          }
        }
      }
    }
    .fixed-bottom {
      width: 717.5rpx;
      height: 50rpx;
      padding-top: 1px;
      position: fixed;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      .btn-return {
        width: 275rpx;
        height: 55rpx;
        border-radius: 27.5rpx;
        border: 1px solid #333;
        background-color: #F7F7F7;
        margin: -17.5rpx auto 15rpx auto;
        text-align: center;
        line-height: 55rpx;
        font-size: 21.25rpx;
        color: #333;
      }
    }
    .fixed-bottom-bg {
      background: linear-gradient(180deg, rgba(247,247,247,0) 0%, rgba(247,247,247,0.96) 100%);
    }
    /* #ifdef APP-PLUS */
    .brToHalf {
      position: relative;
      &::before{
        content: '';
        width: 100%;
        height: 1px;
        transform-origin: 0 0;
        border-bottom: 1px solid #E5E5E5;
        transform: scaleY(0.5);
        position: absolute;
        bottom: 0;
        left: 0;
      }
    }
    /* #endif */
  }
  @media screen and (max-width: 500px) {
    .container {
      font-size: 32rpx;
      padding: 22rpx 0rpx 126rpx 0rpx;
      
      .card-list {
        padding: 0 14rpx;
        .item {
          padding: 18rpx 0 26rpx 0;
          border-radius: 20rpx;
          margin-bottom: 20rpx;
          .item-top {
            padding: 0 26rpx 18rpx 26rpx;
            font-size: 32rpx;
          }
          .item-bottom {
            padding: 28rpx 26rpx 0 26rpx;
            .item-detail {
              padding-bottom: 28rpx;
              image {
                width: 120rpx;
                height: 120rpx;
                margin-right: 22rpx;
                border-radius: 20rpx;
                flex: 0 0 120rpx;
              }
              .item-text {
                &>view:nth-child(1) {
                  font-size: 36rpx;
                  padding-bottom: 22rpx;
                }
                &>view:nth-child(2) {
                  font-size: 32rpx;
                  line-height: 48rpx;
                }
              }
            }
            .item-btn {
              margin-top: 26rpx;
              &>view {
                width: 180rpx;
                height: 76rpx;
                line-height: 76rpx;
                border-radius: 38rpx;
                font-size: 32rpx;
                margin-left: 8rpx;
              }
            }
          }
        }
      }
      .fixed-bottom {
        width: 750rpx;
        height: 116rpx;
        padding-top: 0px;
        bottom: 14rpx;
        
        .btn-return {
          width: 724rpx;
          height: 88rpx;
          border-radius: 44rpx;
          margin: 14rpx auto;
          line-height: 88rpx;
          font-size: 34rpx;
          background: #fff;
        }
      }
      .fixed-bottom-bg {
        background: #fff;
        bottom: 0rpx;
        border-top: 1px solid #F3F4F5;
      }
    }
  }
</style>
