<template>
  <view>
    <nav-bar title='我的订单'></nav-bar>
    <view class="container">
      <view :class="['tab', isShowPaddingRight && !isPad ? 'tab-padding-right' : '']">
        <scroll-view class="scroll-view_H" scroll-x="true" :scroll-with-animation="true" @scroll="scroll" :scroll-left="scrollLeft">
          <view 
            v-for="(item, index) in tabArr" 
            :key="item.id" 
            :id="item.id" 
            :class="[tabCurrentIndex == index ? 'on' : '', 'scroll-view-item_H']"
            @click="switchTab(index, item)"
          >
            {{item.text}}
          </view>
        </scroll-view>
        <view class="tab-mask" v-if="!isPad && isShowTabMask" @click="srcollToRight">
          <image src="../../static/images/pages/order-tab-mask.png"></image>
        </view>
      </view>
      <block v-if="requestDone && orderList.length">
        <view class="card-list">
          <view class="item" v-for="item in orderList" :key="item.id">
            <view class="item-top brToHalf">
              <view>{{item.portalCreateTime.split(' ')[0]}}下单</view>
              <view class="be-paid">
                <block v-if="item.orderStatus == 120">
                  进行中
                </block>
                <block v-else>
                  {{item.orderStatus | dictToDesc('ORDERSTATUS')}} {{item.currentTime && item.currentTime != -1 ? item.currentTime : ''}}
                </block>
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
                <view @click="goDetail(item)" v-if="item.orderStatus != 130"><text class="_text">查看订单</text></view>
                <!-- <view class="pay-now" v-if="item.orderStatus == 10">立即支付</view> -->
                <view class="pay-now" v-if="item.orderStatus == 10" @click="getItemHandle(item)">
                  <!-- <payment @nextHandle="nextHandle" @closePayResultHandle="closePayResultHandle" :price="item.amount" :isContinuePay="true" :continuePayParam="{orderId: item.payOrderId, createChannelType: openType}" :btnText="payResultText" :yjmchReturnUrl="yjmchReturnUrl">
                    <text class="_text">立即支付</text>
                  </payment> -->
                  <text class="_text">立即支付</text>
                </view>
                <view v-if="item.orderStatus == 30" @click="showKfCode"><text class="_text">申请售后</text></view>
                <view class="pay-now" v-if="item.businessType == '2210081722313010031' && item.orderTap == 10 && item.orderStatus == 130" @click="continueEvaluation(item)"><text class="_text">继续筛查</text></view>
                <view class="pay-now" v-if="item.businessType == '2210081722313010031' && item.orderTap == 10 && item.orderStatus == 15" @click="unlockHandle(item)"><text class="_text">立即解锁</text></view>
                <view class="pay-now" v-if="item.orderTap == 60 && (item.orderStatus == 70 || item.orderStatus == 80)" @click="goPage(item)"><text class="_text">寄还平板</text></view>
                <view class="pay-now" v-if="item.businessType == '2210081722147310027' && item.orderTap == 30" @click="goCognitiveTraining(item.payOrderId)"><text class="_text">进行训练</text></view>
                <view class="pay-now" v-if="item.businessType == '2210081722313010031' && (item.orderTap == 20 || item.orderTap == 30)" @click="goEvalution(item.payOrderId, item.orderTap)"><text class="_text">{{item.orderTap == 20 ? '开始' : '继续'}}评估</text></view>
                <view class="pay-now" v-if="item.businessType == '2210081722239380029' && item.orderTap == 30 && item.orderStatus == 40" @click="goAppointmentDetail"><text class="_text">进行评估</text></view>
                <view class="pay-now" v-if="item.businessType == '2210081722239380029' && item.orderTap == 30 && item.orderStatus == 120" @click="reAppointment(item)"><text class="_text">重新预约</text></view>
                <view class="pay-now" v-if="item.businessType == '2209231329175690029' && item.orderTap == 30 && item.orderStatus == 40" @click="goHealthConsulting(item.payOrderId)"><text class="_text">立即咨询</text></view>
                <view class="pay-now" v-if="item.businessType == '2209231329175690029' && item.orderTap == 30 && item.orderStatus == 120" @click="reAppointment(item)"><text class="_text">重新预约</text></view>
                <view class="pay-now" v-if="(item.businessType == '2210130902263070058' || item.businessType == '2210130902390810060') && (item.orderTap == 20 || item.orderTap == 30)" @click="goExercise(item)"><text class="_text">立即开始</text></view>
                <view class="pay-now" v-if="item.orderTap == 50" @click="goToGoodsListPage(item)"><text class="_text">再次购买</text></view>
              </view>
            </view>
          </view>
        </view>
      </block>
      <block v-if="requestDone && !orderList.length">
        <view class="empty"><empty-data tips="当前暂无数据"></empty-data></view>
      </block>
      <view :class="[isShowfixedBtmBg ? 'fixed-bottom-bg' : '', 'fixed-bottom']">
        <view class="btn-return" @click="returnBack">返回</view>
      </view>
    </view>
    <kf-code v-if="isShowKfCode" @closeKfHandle="closeKfHandle" ewmName="wd-lxkf"></kf-code>
  </view>
</template>

<script>
  import { navigateTo } from '@/utils/util'
  import navBar from '@/components/nav-bar'
  import emptyData from '@/components/empty-data'
  import payment from '@/components/payment'
  import kfCode from '@/components/kf-code'
  export default {
    components: {
      navBar,
      emptyData,
      payment,
      kfCode
    },
    data() {
      return {
        tabArr: [
          {id: 'all', text: '全部', orderTap: ''},
          {id: 'to-be-paid', text: '待付款', orderTap: 10},
          {id: 'ready-for-use', text: '待使用', orderTap: 20},
          {id: 'in-progress', text: '进行中', orderTap: 30},
          {id: 'pad-send-back', text: '平板寄还', orderTap: 60},
          {id: 'completed', text: '已完成', orderTap: 40},
          {id: 'cancel', text: '已取消', orderTap: 50}
        ],
        tabCurrentIndex: 0,
        imgPrefix: this.$imgPrefix,
        isPad: this.$pad,
        contentScrollW: 0, // 导航区宽度
        scrollLeft: 0, // 横向滚动条位置
        isShowPaddingRight: false,
        orderList: [],
        queryParam: {
          pageSize: 10,
          pageNum: 1,
          orderTap: ''
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
        yjmchReturnUrl: '/pages/order/index',
        isShowTabMask: true
      }
    },
    computed: {
      orderListLen() {
        return this.orderList.length
      }
    },
    watch: {
      orderListLen(newVal, oldVal) {
        let count = this.isPad ? 4 : 3
        if (newVal < count) {
          this.isShowfixedBtmBg = false
        } else {
          this.isShowfixedBtmBg = true
        }
      }
    },
    onLoad() {
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
      if (uni.getStorageSync('openerOrderTap')) {
        this.queryParam.orderTap = uni.getStorageSync('openerOrderTap')
        uni.removeStorageSync('openerOrderTap')
        this.tabCurrentIndex = this.tabArr.findIndex(item => item.orderTap == this.queryParam.orderTap)
        // setTimeout(() => {
        //   this.scrollLeft = this.tabArr[this.tabCurrentIndex].left - this.contentScrollW / 2 + this.tabArr[this.tabCurrentIndex].width / 2
        // }, 100)
      }
    },
    mounted() {
      this.getScrollW()
    },
    onShow() {
      this.resetPage()
      this.getOrderList()
      
    },
    onHide() {
      this.clearTimerId()
    },
    onUnload() { //卸载页面清除定时器
      this.clearTimerId()
    },
    methods: {
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
      clearTimerId() {
        let timerList = this.orderList.filter(item => item.orderStatus == 10)
        if (timerList.length) {
          for (let i = 0; i < timerList.length; i++) {
            clearInterval(timerList[i].timerId)
          }
        }
      },
      resetPage() {
        this.clearTimerId()
        this.orderList = []
        this.requestDone = false
        this.queryParam.pageSize = 10
        this.queryParam.pageNum = 1
      },
      getOrderList() {
        this.$request({
          url: '/gw/h5/v1/front/order/newList',
          method: 'post',
          data: {
            token: this.userInfo.token,
            userId: this.userInfo.userId,
            ...this.queryParam
          }
        }).then(res => {
          if (res.status == 1000) {
            this.orderList = this.orderList.concat(res.data ? res.data.list : [])
            this.orderTotalCount = res.data ? res.data.pageInfo.totalCount : 0
            if (!res.data) {
              this.isShowfixedBtmBg = false
            }
            for (let i = 0; i < this.orderList.length; i++) {
              if (this.orderList[i].businessType == '2212191442306270000') {
                // 组合包
                this.$set(this.orderList[i], 'iconUrl', '/static/operateSteps/portalH5/order-card-img-1.png')
              } else if (this.orderList[i].businessType == '2210130902390810060') {
                // 健脑运动
                this.$set(this.orderList[i], 'iconUrl', '/static/operateSteps/portalH5/order-card-img-2.png')
              } else if (this.orderList[i].businessType == '2210130902263070058') {
                // 趣味锻炼
                this.$set(this.orderList[i], 'iconUrl', '/static/operateSteps/portalH5/order-card-img-1.png')
              } else if (this.orderList[i].businessType == '2209231329175690029') {
                // 咨询
                this.$set(this.orderList[i], 'iconUrl', '/static/operateSteps/portalH5/order-card-img-5.png')
              } else if (this.orderList[i].businessType == '2210081722147310027') {
                // 训练
                this.$set(this.orderList[i], 'iconUrl', '/static/operateSteps/portalH5/order-card-img-6.png')
              } else if (this.orderList[i].businessType == '2210081722078170025') {
                // 课程
                this.$set(this.orderList[i], 'iconUrl', '/static/operateSteps/portalH5/order-card-img-2.png')
              } else if (this.orderList[i].businessType == '2210081722239380029') {
                // 评估
                this.$set(this.orderList[i], 'iconUrl', '/static/operateSteps/portalH5/order-card-img-3.png')
              } else if (this.orderList[i].businessType == '2210081722313010031') {
                // 筛查
                this.$set(this.orderList[i], 'iconUrl', '/static/operateSteps/portalH5/order-card-img-4.png')
              }
            }
            this.getTimeList()
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
      getTimeList() {
        this.clearTimerId()
        for (let i = 0; i < this.orderList.length; i++) {
          if (this.orderList[i].orderStatus == 10 && this.orderList[i].curTime && this.orderList[i].expireTime) {
            // 开始倒计时
            let timerId = setInterval(() => {
              this.cutDownTime(this.orderList[i])
            }, 1000)
            this.$set(this.orderList[i], 'timerId', timerId)
          }
        }
      },
      cutDownTime(item) {
        let begin = item.curTime ? item.curTime.replace(/-/g,"/") : new Date().getTime()
        let end = item.expireTime.replace(/-/g,"/")
        let leftTime = parseInt((new Date(end).getTime() - new Date(begin).getTime()) / 1000)
        let leftm = parseInt((leftTime / 60) % 60)
        let lefts = parseInt(leftTime % 60)
        let countdown = `${leftm.toString().padStart(2, 0)}:${lefts.toString().padStart(2, 0)}`
        let now = new Date(new Date(begin).getTime() + 1000)
        this.$set(item, 'curTime', `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, 0)}-${(now.getDate()).toString().padStart(2, 0)} ${(now.getHours()).toString().padStart(2, 0)}:${(now.getMinutes()).toString().padStart(2, 0)}:${(now.getSeconds()).toString().padStart(2, 0)}`)
        if (leftTime <= 0) {
          this.$set(item, 'currentTime', -1)
          this.$set(item, 'orderStatus', 20)
          clearInterval(item.timerId)
        } else {
          this.$set(item, 'currentTime', countdown)
        }
      },
      goDetail(item) {
        if (item.orderStatus == 15) {
          // 待解锁报告详情
          navigateTo('/pages/order/lock-report-detail?payOrderId='+item.payOrderId)
        } else {
          navigateTo('/pages/order/detail?payOrderId='+item.payOrderId)
        }
      },
      continueEvaluation(item) {
        navigateTo('/pages/evaluation/sort?payOrderId='+item.payOrderId)
      },
      unlockHandle(item) {
        navigateTo('/pages/evaluation/lock-report?payOrderId='+item.payOrderId)
      },
      onReachBottom(e) {
        if (Math.ceil(this.orderTotalCount / this.queryParam.pageSize) > this.queryParam.pageNum) {
          // 有下一页
          // this.pageNum++
          this.queryParam.pageNum++
          this.getOrderList()
        } else {
          this.isShowfixedBtmBg = false
        }
      },
      onPageScroll() {
        this.isShowfixedBtmBg = true
      },
      closePayResultHandle(res) {
        this.clearTimerId()
        this.resetPage()
        this.getOrderList()
      },
      nextHandle(res) {
        this.clearTimerId()
        this.payOrderId = res.payOrderId
        this.resetPage()
        this.getOrderList()
        switch(this.curBusinessType) {
          case '2209231329175690029':
            this.goHealthConsulting(res.payOrderId)
            break
          case '2210081722147310027':
            this.goCognitiveTraining(res.payOrderId)
            break
          case '2210081722239380029':
            this.goAppointmentDetail()
            break
          case '2210081722313010031':
            this.goEvalution(res.payOrderId, 20)
            break
        }
      },
      getItemHandle(item) {
        navigateTo('/pages/pre-pay/index?payOrderId='+item.payOrderId)
        // this.curBusinessType = item.businessType
        // this.timer = item.timerId
        // switch(item.businessType) {
        //   case '2209231329175690029': 
        //     this.payResultText = '咨询'
        //     break
        //   case '2210081722147310027':
        //     this.payResultText = '训练'
        //     break
        //   case '2210081722239380029':
        //     this.payResultText = '评估'
        //     break
        //   case '2210081722313010031':
        //     this.payResultText = '测评'
        //     break
        //   case '2210130902390810060':
        //   case '2210130902263070058':
        //     this.payResultText = '锻炼'
        //     break
        // }
      },
      // 跳转研一训练
      goCognitiveTraining(payOrderId) {
        let routes = getCurrentPages() //获取加载的页面
        let curRoute = routes[routes.length - 1].route //获取当前页面的对象
        let backUrl = encodeURIComponent(`/${curRoute}?specailBack=1`)
        getApp().goCognitiveTraining({
          token: this.userInfo.token,
          isNeedLandscape: 'yes',
          redirectUrl: backUrl,
          payOrderId,
        })
      },
      // 跳转研一测评
      goEvalution(payOrderId, orderTap) {
        if (this.userInfo.info.birthYear && this.userInfo.info.education) {
          // 继续评估，不用再去填写资料
          getApp().goEvalution({
            token: this.userInfo.token,
            requestType: 1,
            payOrderId,
            backType: 2
          })
        } else {
          // 未填写资料，先填写资料
          navigateTo('/pages/evaluation/sort?payOrderId='+payOrderId)
        }
      },
      // 跳转研二人工评估
      goAppointmentDetail() {
        getApp().goAppointmentDetail({
          token: this.userInfo.token,
          type: 2,
          cameraPermission: true
        })
      },
      // 跳转研二健康咨询
      goHealthConsulting(payOrderId) {
        getApp().goHealthConsulting({
          payOrderId,
          token: this.userInfo.token,
          type: 1
        })
      },
      // 重新预约
      reAppointment(item) {
        this.$request({
          url: '/gw/order/pay/checkReAppointment',
          method: 'post',
          data: {
            token: this.userInfo.token,
            orderId: item.payOrderId
          }
        }).then(res => {
          if (res.status === 1000) {
            if (item.businessType == '2210081722239380029') {
              // 辅助评估（人工评估）
              navigateTo(`/pages/evaluation/artificial?goodsId=${res.data.goodsId}&amount=${res.data.amount}&originalAmount=${res.data.originAmount}&addressFlag=${res.data.addressFlag}&reAppointFlag=1&rePayOrderId=${item.payOrderId}&createOrderType=2`)
            } else if (item.businessType == '2209231329175690029') {
              // 健康咨询（医生咨询
              navigateTo(`/pages/consulting-service/appointment?goodsId=${res.data.goodsId}&amount=${res.data.amount}&originalAmount=${res.data.originAmount}&mouldId=${res.data.mouldId}&addressFlag=${res.data.addressFlag}&reAppointFlag=1&rePayOrderId=${item.payOrderId}&createOrderType=2`)
            }
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      goPage(item) {
        navigateTo('/pages/order/send-back-explain?payOrderId='+item.payOrderId)
      },
      goExercise(item) {
        if (item.businessType == '2210130902263070058') {
          navigateTo('/pages/exercise/list')
        } else {
          navigateTo('/pages/micromotion/list')
        }
      },
      goToGoodsListPage(item) {
        switch(item.businessType) {
          case '2210130902390810060':
            // 健脑运动
            navigateTo('/pages/micromotion/open-service-package')
            break
          case '2210130902263070058':
            // 趣味锻炼
            navigateTo('/pages/exercise/open-service-package')
            break
          case '2209231329175690029':
            // 健康咨询
            navigateTo('/pages/consulting-service/index')
            break
          case '2210081722147310027':
            // 训练
            navigateTo('/pages/cognitive-training/guid')
            break
          case '2210081722239380029':
            // 人工评估
            this.$request({
              url: '/gw/h5/v1/front/goods/goodsList',
              method: 'post',
              data: {
                token: this.userInfo.token,
                type: 1,
                userId: this.userInfo.userId
              }
            }, false).then(res => {
              if (res.status === 1000) {
                let goods = res.data.filter(item => item.businessType == '2210081722239380029')[0]
                navigateTo(`/pages/evaluation/artificial?goodsId=${goods.goodsId}&amount=${goods.amount}&originalAmount=${goods.originalAmount}&addressFlag=${goods.addressFlag}`)
              } else {
                uni.showToast({
                  title: res.msg,
                  icon: 'none',
                  duration: 2000
                })
              }
            })
            break
          case '2210081722313010031':
            // 智能评估
            navigateTo('/pages/evaluation/explain')
            break
        }
      },
      switchTab(index, item) {
        if (index == 6) {
          this.isShowPaddingRight = true
        }
        this.tabCurrentIndex = index
        this.scrollLeft = this.tabArr[index].left - this.contentScrollW / 2 + this.tabArr[index].width / 2
        this.clearTimerId()
        this.resetPage()
        this.queryParam.orderTap = item.orderTap
        this.getOrderList()
      },
      closeKfHandle() {
        this.isShowKfCode = false
      },
      showKfCode() {
        this.isShowKfCode = true
      },
      returnBack() {
        // const pages = getCurrentPages()
        // let prevPage = pages[pages.length - 2]
        // console.log(prevPage)
        // if (pages.length === 1) { //如果只有一个调用原生js
        //   // #ifdef H5
        //   history.back()
        //   // #endif
        // } else {
        //   uni.navigateBack({
        //     delta: 1,
        //     success: () => {
        //       if (prevPage.$vm.getOrderList) {
        //         prevPage.$vm.resetPage()
        //         prevPage.$vm.getOrderList()
        //       }
        //     }
        //   })
        // }
        navigateTo('/pages/my/index')
      },
      getScrollW() {
        const query = uni.createSelectorQuery().in(this)
        query.select('.scroll-view_H').boundingClientRect(data => {
          this.contentScrollW = data.width
        }).exec()
        query.selectAll('.scroll-view-item_H').boundingClientRect(data => {
          let dataLen = data.length
          for (let i = 0; i < dataLen; i++) {
            this.tabArr[i].left = data[i].left
            this.tabArr[i].width = data[i].width
          }
          this.scrollLeft = this.tabArr[this.tabCurrentIndex].left - this.contentScrollW / 2 + this.tabArr[this.tabCurrentIndex].width / 2
        }).exec()
      },
      scroll(event) {
        if (event.detail.scrollLeft > 180) {
          this.isShowPaddingRight = true
          this.isShowTabMask = false
        } else {
          this.isShowPaddingRight = false
          this.isShowTabMask = true
        }
      },
      srcollToRight() {
        this.scrollLeft = 500
      }
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
    padding: 15rpx 0rpx 90rpx 0;
    margin: 0 auto;
    .tab {
      padding:0 17rpx 0 12rpx;
      height: 57.5rpx;
      position: relative;
      font-size: 21.25rpx;
      box-sizing: border-box;
      .scroll-view_H {
        white-space: nowrap;
        background-color: #F7F7F7;
        border-radius: 28.75rpx;
        width: 100%;
        height: 100%;
        padding: 2.5rpx 2.5rpx 2.5rpx 2.5rpx;
        box-sizing: border-box;
        .scroll-view-item_H  {
          display: inline-block;
          width: 103rpx;
          height: 52.5rpx;
          line-height: 52.5rpx;
          text-align: center;
          &.on {
            border-radius: 28.75rpx;
            background-color: #43C9A7;
            color: #fff;
            font-size: 22.5rpx;
            font-weight: bold;
          }
        }
      }
    }
    .card-list {
      padding: 0 16.25rpx;
      margin-top: 15rpx;
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
            &>view.pay-now {
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
      padding: 0rpx 0rpx 126rpx 0rpx;
      .tab {
        padding: 0 0 0rpx 14rpx;
        height: 98rpx;
        font-size: 32rpx;
        background-color: #fff;
        .tab-mask {
          width: 86rpx;
          height: 98rpx;
          position: absolute;
          right: 0;
          top: 0%;
          image {
            width: 100%;
            height: 100%;
            background: url('../../static/images/pages/order-tab-mask.png') no-repeat top center;
            background-size: 86rpx 98rpx;
          }
        }
        .scroll-view_H {
          background-color: #fff;
          border-radius: 46rpx 0 0 46rpx;
          padding-top: 10rpx;
          box-sizing: border-box;
          .scroll-view-item_H  {
            width: 160rpx;
            height: 78rpx;
            line-height: 78rpx;
            &.on {
              border-radius: 46rpx;
              font-size: 34rpx;
            }
          }
        }
      }
      .tab-padding-right {
        padding-right: 20rpx;
      }
      .card-list {
        padding: 0 14rpx;
        margin-top: 24rpx;
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
      }
    }
  }
</style>
