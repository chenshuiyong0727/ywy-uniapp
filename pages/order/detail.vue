<template>
  <view>
    <nav-bar title='订单详情' :refreshPage="false"></nav-bar>
    <view class="container">
      <view class="title">
        <text>{{detailData.orderStatus | dictToDesc('ORDERSTATUS')}}</text>
        <text class="cutdown" v-if="detailData.orderStatus == 10 && detailData.currentTime && detailData.businessType != '2210081722313010031'">{{detailData.currentTime}}</text>
        <text class="tip" v-if="detailData.orderStatus == 110">订单已取消，后续请点击【已取消】查看</text>
      </view>
      <view class="box-common box-product">
        <view class="box-flex">
          <view class="flex-left"><image :src="imgPrefix + detailData.iconUrl"></image></view>
          <view class="flex-right">
            <view class="sub-title text-ellipsis">{{detailData.subject || '--'}}</view>
            <view class="desc">{{detailData.body || '--'}}</view>
          </view>
        </view>
      </view>
      <view class="box-common" v-if="(detailData.tabletServices == 1 && detailData.orderStatus == 90) || (detailData.refundType && detailData.refundType != -1)">
        <view class="tip" v-if="detailData.orderStatus == 110">退款至购买账户中，请注意查收</view>
        <view class="box-flex" v-if="detailData.tabletServices == 1 && detailData.orderStatus == 90">
          <view class="flex-left">押金状态:</view>
          <view class="flex-right"><text>退款审核中</text></view>
        </view>
        <view class="box-flex" v-else>
          <view class="flex-left">{{detailData.refundType && detailData.refundType == 1 ? '押金' : '退款'}}状态:</view>
          <view class="flex-right"><text>已完成</text></view>
        </view>
        <block v-if="detailData.refundType && detailData.refundType != -1">
          <view class="box-flex">
            <view class="flex-left">{{detailData.refundType == 1 ? '退还押金' : '退款金额'}}:</view>
            <view class="flex-right"><text v-if="detailData.refundAmount">￥{{detailData.refundAmount / 100}}</text></view>
          </view>
          <view class="box-flex">
            <view class="flex-left">备注说明:</view>
            <view class="flex-right"><text>{{detailData.refundRemarks || '--'}}</text></view>
          </view>
        </block>
      </view>
      <view class="box-common" v-if="detailData.tabletServices == 1 && detailData.recycleStatus && detailData.recycleStatus != -1">
        <view class="_t">平板寄还</view>
        <view class="box-flex">
          <view class="flex-left">物流状态:</view>
          <view class="flex-right"><text>{{detailData.recycleStatus | dictToDesc('RECYCLESTATUS')}}</text></view>
        </view>
        <block v-if="detailData.recycleStatus == 1">
          <view class="box-flex text-weight">
            <view class="flex-left">收件人:</view>
            <view class="flex-right" v-if="detailData.returnLogisticsMsg"><text>{{detailData.returnLogisticsMsg.name ? detailData.returnLogisticsMsg.name : '--'}}</text><text class="copy" @click="copyHandle(detailData.returnLogisticsMsg.name)">复制</text></view>
          </view>
          <view class="box-flex text-weight">
            <view class="flex-left">收货地址:</view>
            <view class="flex-right" v-if="detailData.returnLogisticsMsg"><text>{{detailData.returnLogisticsMsg.address ? detailData.returnLogisticsMsg.address : '--'}}</text><text class="copy" @click="copyHandle(detailData.returnLogisticsMsg.address)">复制</text></view>
          </view>
          <view class="box-flex text-weight">
            <view class="flex-left">联系电话:</view>
            <view class="flex-right" v-if="detailData.returnLogisticsMsg"><text>{{detailData.returnLogisticsMsg.phone ? detailData.returnLogisticsMsg.phone : '--'}}</text><text class="copy" @click="copyHandle(detailData.returnLogisticsMsg.phone)">复制</text></view>
          </view>
        </block>
        <block v-if="detailData.recycleStatus > 1">
          <view class="box-flex">
            <view class="flex-left">配送物流:</view>
            <view class="flex-right"><text>{{detailData.returnLogisticsSupplier | dictToDesc('LOGISTICSSUPPLIER')}}</text></view>
          </view>
          <view class="box-flex">
            <view class="flex-left">物流单号:</view>
            <view class="flex-right"><text class="txt text-ellipsis">{{detailData.returnLogisticsNumber}}</text><text class="copy" @click="copyHandle(detailData.returnLogisticsNumber)">复制</text></view>
          </view>
        </block>
        <view class="btn" v-if="detailData.recycleStatus == 1 || detailData.recycleStatus == 2">
          <view @click="goPage">寄还说明</view>
          <view @click="showLogisticsPopover">{{detailData.recycleStatus == 1 ? '填写' : '修改'}}物流信息</view>
        </view>
        
      </view>
      <view class="box-common">
        <view class="_t">{{detailData.businessType == '2210081722313010031' ? '筛查明细' : '订单明细'}}</view>
        <view class="box-flex">
          <view class="flex-left">{{detailData.businessType == '2210081722313010031' ? '筛查编号:' : '订单编号:'}}</view>
          <view class="flex-right"><text class="txt text-ellipsis">{{detailData.payOrderId || '--'}}</text><text class="copy" @click="copyHandle(detailData.payOrderId)">复制</text></view>
        </view>
        <view class="box-flex" v-if="detailData.businessType == '2210081722313010031'">
          <view class="flex-left">开始时间:</view>
          <view class="flex-right"><text>{{detailData.startTime || '--'}}</text></view>
        </view>
        <view class="box-flex" v-if="detailData.businessType == '2210081722313010031'">
          <view class="flex-left">完成时间:</view>
          <view class="flex-right"><text>{{detailData.completeTime || '--'}}</text></view>
        </view>
        <view class="box-flex" v-if="detailData.businessType != '2210081722313010031'">
          <view class="flex-left">下单时间:</view>
          <view class="flex-right"><text>{{detailData.portalCreateTime || '--'}}</text></view>
        </view>
        <view class="box-flex" v-if="detailData.channelType">
          <view class="flex-left">支付方式:</view>
          <view class="flex-right"><text>{{detailData.channelType | dictToDesc('CHANNELTYPE')}}支付</text></view>
        </view>
        <view class="box-flex" v-if="detailData.payTime && detailData.businessType != '2210081722313010031'">
          <view class="flex-left">支付时间:</view>
          <view class="flex-right"><text>{{detailData.payTime}}</text></view>
        </view>
      </view>
      <view class="box-common" v-if="(detailData.businessType == '2210081722239380029' || detailData.businessType == '2209231329175690029')">
        <view class="_t">预约信息</view>
        <view class="box-flex">
          <view class="flex-left">预约服务:</view>
          <view class="flex-right"><text>{{detailData.businessParams.serviceName}}</text></view>
        </view>
        <view class="box-flex">
          <view class="flex-left">预约时间:</view>
          <view class="flex-right"><text>{{detailData.businessParams ? detailData.businessParams.dayStr : '--'}}</text></view>
        </view>
        <view class="box-flex">
          <view class="flex-left">预约人:</view>
          <view class="flex-right"><text>{{detailData.businessParams ? detailData.businessParams.userName : ''}}</text></view>
        </view>
        <view class="box-flex">
          <view class="flex-left">性别:</view>
          <view class="flex-right"><text>{{ detailData.businessParams.gender | dictToDesc('SEX')}}</text></view>
        </view>
        <view class="box-flex">
          <view class="flex-left">出生年月:</view>
          <view class="flex-right"><text>{{detailData.businessParams ? detailData.businessParams.birthDay : ''}}</text></view>
        </view>
        <view class="box-flex">
          <view class="flex-left">学历:</view>
          <view class="flex-right"><text>{{detailData.businessParams.education | dictToDesc('EDUCATION')}}</text></view>
        </view>
        <view class="box-flex">
          <view class="flex-left">上传报告:</view>
          <view class="flex-right"><text class="link" @click="lookHandle">查看</text></view>
        </view>
      </view>
      <view class="box-common" v-if="false">
        <view class="box-flex">
          <view class="flex-left">使用亲属:</view>
          <view class="flex-right"><text>394794235493054378</text></view>
        </view>
        <view class="box-flex">
          <view class="flex-left">亲属姓名:</view>
          <view class="flex-right"><text>2023-02-21 13:53:23</text></view>
        </view>
        <view class="box-flex">
          <view class="flex-left">亲属手机:</view>
          <view class="flex-right"><text>微信支付</text></view>
        </view>
        <view class="box-flex">
          <view class="flex-left">收货地址:</view>
          <view class="flex-right"><text>2023-02-21 13:53:23</text></view>
        </view>
      </view>
      <view class="box-common" v-if="detailData.orderStatus != 20 && detailData.tabletServices != -1 && detailData.sendStatus">
        <view class="_t">平板配送</view>
        <view class="box-flex">
          <view class="flex-left">物流状态:</view>
          <view class="flex-right"><text>{{detailData.sendStatus | dictToDesc('SENDPADSTATUS')}}</text></view>
        </view>
        <view class="box-flex" v-if="detailData.sendStatus != 1">
          <view class="flex-left">配送物流:</view>
          <view class="flex-right"><text>{{detailData.logisticsSupplier || '--'}}</text></view>
        </view>
        <view class="box-flex" v-if="detailData.sendStatus != 1">
          <view class="flex-left">物流单号:</view>
          <view class="flex-right"><text class="txt text-ellipsis">{{detailData.logisticsNumber || '--'}}</text><text v-if="detailData.logisticsNumber" class="copy" @click="copyHandle(detailData.logisticsNumber)">复制</text></view>
        </view>
      </view>
      <view :class="['box-common', isPad ? '' : 'box-mobile-money']">
        <view class="_t">金额明细</view>
        <!-- <view class="box-flex">
          <view class="flex-left">服务原价:</view>
          <view class="flex-right"><text class="money-weight" v-if="detailData.originAmount">￥{{detailData.originAmount / 100}}</text></view>
        </view> -->
        <block v-if="detailData.originAmountDetail && detailData.originAmountDetail.length">
          <view class="box-flex" v-for="(item, index) in detailData.originAmountDetail" :key="index">
            <view class="flex-left">{{item.type | dictToDesc('ORIGINAMOUNTTYPE')}}:</view>
            <view class="flex-right"><text class="money-weight">￥{{item.amount / 100}}</text></view>
          </view>
        </block>
        <view class="box-flex" v-if="detailData.amount && detailData.originAmount">
          <view class="flex-left">优惠减免:</view>
          <view class="flex-right"><text class="money-weight">-￥{{(detailData.originAmount - detailData.amount) / 100}}</text></view>
        </view>
        <view class="box-flex" v-if="detailData.amount">
          <view class="flex-left" v-if="isPad">实付款:</view>
          <view class="flex-right">
            <text v-if="!isPad">实付款:</text>
            <text class="money money-weight">￥{{detailData.amount / 100 }}</text>
          </view>
        </view>
      </view>
      <view :class="['btm-btn', detailData.orderStatus == 30 ? '' : 'one-btm-btn']" v-if="detailData.orderStatus != 10">
        <view class="btn1" @click="showKfCode" v-if="detailData.orderStatus == 30">申请售后</view>
        <view @click="returnBack">返回</view>
      </view>
      <view class="fixed-bottom" v-if="detailData.orderStatus == 10">
        <view class="kf" @click="showKfCode">
          <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/evaluation-img-5.png'"></image>
          <view>客服咨询</view>
        </view>
        <view class="price">
          <view class="amount">
            <view>￥<text>{{detailData.amount / 100}}</text></view>
            <view>￥{{detailData.originAmount / 100}}</view>
          </view>
          <view class="pay-btn">
            <payment @nextHandle="nextHandle" @closePayResultHandle="closePayResultHandle" :price="detailData.amount" :isContinuePay="true" :continuePayParam="{orderId: detailData.payOrderId, createChannelType: openType}" :btnText="payResultText" :yjmchReturnUrl="yjmchReturnUrl">
              <text class="_text">立即支付</text>
            </payment>
          </view>
        </view>
      </view>
    </view>
    <logistics-popover v-if="isShowLogisticsPopover" :logisticsParam="{logisticsSupplier: detailData.returnLogisticsSupplier, logisticsNumber: detailData.returnLogisticsNumber}" :payOrderId="detailData.payOrderId" @closeLogisticsPop="closeLogisticsPop" @updateLogisticsSuccess="updateLogisticsSuccess"></logistics-popover>
    <kf-code v-if="isShowKfCode" @closeKfHandle="closeKfHandle" ewmName="wd-lxkf"></kf-code>
  </view>
</template>

<script>
  import { navigateTo } from '@/utils/util'
  import navBar from '@/components/nav-bar'
  import payment from '@/components/payment'
  import logisticsPopover from '@/components/order/logistics-popover'
  import kfCode from '@/components/kf-code'
  export default {
    components: {
      navBar,
      payment,
      logisticsPopover,
      kfCode
    },
    data() {
      return {
        imgPrefix: this.$imgPrefix,
        isPad: this.$pad,
        payOrderId: '',
        detailData: {},
        openType: this.$openType,
        payResultText: '训练',
        isShowLogisticsPopover: false,
        isShowKfCode: false,
        // 继续支付成功后H5的回跳地址
        yjmchReturnUrl: '/pages/order/index'
      }
    },
    onLoad(options) {
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
      this.payOrderId = options.payOrderId ? options.payOrderId : ''
      this.getOrderDetail()
    },
    onUnload() { //卸载页面清除定时器
      if (this.detailData.timerId) {
        clearInterval(this.detailData.timerId)
      }
    },
    methods: {
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
          this.getOrderDetail()
        } else {
          this.$set(item, 'currentTime', countdown)
        }
      },
      getTimeList() {
        if (this.detailData.orderStatus == 10 && this.detailData.expireTime) {
          // 开始倒计时
          let timerId = setInterval(() => {
            this.cutDownTime(this.detailData)
          }, 1000)
          this.$set(this.detailData, 'timerId', timerId)
        }
      },
      getOrderDetail() {
        this.$request({
          url: '/gw/h5/v1/front/order/detail',
          method: 'get',
          data: {
            token: this.userInfo.token,
            payOrderId: this.payOrderId,
          }
        }).then(res => {
          if (res.status === 1000) {
            this.detailData = res.data
            if (this.detailData.businessType == '2212191442306270000') {
              // 组合包
              this.$set(this.detailData, 'iconUrl', '/static/operateSteps/portalH5/order-card-img-1.png')
            } else if (this.detailData.businessType == '2210130902390810060') {
              // 健脑运动
              this.$set(this.detailData, 'iconUrl', '/static/operateSteps/portalH5/order-card-img-2.png')
              this.payResultText = '锻炼'
            } else if (this.detailData.businessType == '2210130902263070058') {
              // 趣味锻炼
              this.$set(this.detailData, 'iconUrl', '/static/operateSteps/portalH5/order-card-img-1.png')
              this.payResultText = '锻炼'
            } else if (this.detailData.businessType == '2209231329175690029') {
              // 咨询
              this.$set(this.detailData, 'iconUrl', '/static/operateSteps/portalH5/order-card-img-5.png')
              this.payResultText = '咨询'
            } else if (this.detailData.businessType == '2210081722147310027') {
              // 训练
              this.$set(this.detailData, 'iconUrl', '/static/operateSteps/portalH5/order-card-img-6.png')
              this.payResultText = '训练'
            } else if (this.detailData.businessType == '2210081722078170025') {
              // 课程
              this.$set(this.detailData, 'iconUrl', '/static/operateSteps/portalH5/order-card-img-2.png')
            } else if (this.detailData.businessType == '2210081722239380029') {
              // 评估
              this.$set(this.detailData, 'iconUrl', '/static/operateSteps/portalH5/order-card-img-3.png')
              this.payResultText = '评估'
            } else if (this.detailData.businessType == '2210081722313010031') {
              // 筛查
              this.$set(this.detailData, 'iconUrl', '/static/operateSteps/portalH5/order-card-img-4.png')
              this.payResultText = '评估'
            }
            if (this.detailData.orderStatus == 10) {
              this.getTimeList()
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
      closePayResultHandle(res) {
        clearInterval(this.detailData.timerId)
        this.getOrderDetail()
      },
      nextHandle(res) {
        clearInterval(this.detailData.timerId)
        this.payOrderId = res.payOrderId
        switch(this.detailData.businessType) {
          case '2209231329175690029':
            this.goHealthConsulting()
            break
          case '2210081722147310027':
            this.goCognitiveTraining()
            break
          case '2210081722239380029':
            this.goAppointmentDetail(2)
            break
          case '2210081722313010031':
            this.goEvalution()
            break
        }
        this.getOrderDetail()
      },
     
      // 跳转研一训练
      goCognitiveTraining() {
        let routes = getCurrentPages() //获取加载的页面
        let curRoute = routes[routes.length - 1].route //获取当前页面的对象
        let backUrl = encodeURIComponent(`/${curRoute}?specailBack=1`)
        getApp().goCognitiveTraining({
          token: this.userInfo.token,
          isNeedLandscape: 'yes',
          redirectUrl: backUrl,
          payOrderId: this.payOrderId,
        })
      },
      // 跳转研一测评
      goEvalution() {
        // 付款成功后为待使用状态下首次进入评估需要先填写资料
        navigateTo('/pages/evaluation/sort?payOrderId='+this.payOrderId)
      },
      // 跳转研二认知评估
      goAppointmentDetail(type) {
        getApp().goAppointmentDetail({
          token: this.userInfo.token,
          type,
          cameraPermission: true
        })
      },
      // 跳转研二健康咨询
      goHealthConsulting() {
        getApp().goHealthConsulting({
          payOrderId: this.payOrderId,
          token: this.userInfo.token,
          type: 1
        })
      },
      copyHandle(data) {
        uni.setClipboardData({
          data,
          success: (res)  => {
            uni.showToast({
              title: '复制成功',
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      showLogisticsPopover() {
        this.isShowLogisticsPopover = true
      },
      closeLogisticsPop() {
        this.isShowLogisticsPopover = false
      },
      goPage() {
        navigateTo('/pages/order/send-back-explain?payOrderId='+this.payOrderId)
      },
      // 物流更新成功
      updateLogisticsSuccess() {
        this.isShowLogisticsPopover = false
        this.getOrderDetail()
      },
      returnBack() {
        const pages = getCurrentPages()
        let prevPage = pages[pages.length - 2]
        if (pages.length === 1) { //如果只有一个调用原生js
          // #ifdef H5
          history.back()
          // #endif
        } else {
          uni.navigateBack({
            delta: 1,
            success: () => {
              if (prevPage.$vm.getOrderList) {
                prevPage.$vm.resetPage()
                prevPage.$vm.getOrderList()
              }
            }
          })
        }
      },
      closeKfHandle() {
        this.isShowKfCode = false
      },
      showKfCode() {
        this.isShowKfCode = true
      },
      lookHandle() {
        if (this.detailData.businessType == '2210081722239380029') {
          // 跳转认知评估报告列表页
          this.goAppointmentDetail(2)
        } else {
          // 跳转健康咨询报告列表页
          this.goAppointmentDetail(1)
        }
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
    padding: 18.75rpx 16.25rpx 25rpx 16.25rpx;
    margin: 0 auto;
    .title {
      color: #30B08F;
      font-size: 27.5rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
      .tip {
        font-size: 20rpx;
        padding-left: 12.5rpx;
      }
      .cutdown {
        padding-left: 12.5rpx;
      }
    }
    .box-common {
      padding: 25rpx;
      box-sizing: border-box;
      background-color: #fff;
      border-radius: 12.5rpx;
      margin-bottom: 10rpx;
      ._t {
        font-size: 22.5rpx;
        font-weight: bold;
        color: #1A1A1A;
        margin-bottom: 16.25rpx;
      }
      .tip {
        width: 337.5rpx;
        height: 37.5rpx;
        line-height: 37.5rpx;
        text-align: center;
        border-radius: 18.75rpx;
        background-color: #FFEBD3;
        color: #DC4B05;
        font-size: 21.25rpx;
        font-weight: bold;
        margin-bottom: 16.25rpx;
      }
      .box-flex {
        display: flex;
        font-size: 20rpx;
        align-items: center;
        padding-bottom: 16.25rpx;
        .flex-left {
          width: 93.75rpx;
          color: #6B6B6B;
          image {
            width: 75rpx;
            height: 75rpx;
            border-radius: 15rpx;
            flex: 0 0 75rpx;
          }
        }
        .flex-right {
          flex: 1;
          color: #1A1A1A;
          margin-left: 43.75rpx;
          text {
            vertical-align: middle;
          }
          .copy {
            font-size: 20rpx;
            color: #181818;
            padding: 5rpx 10rpx;
            background-color: #EBEEF0;
            border-radius: 15rpx;
            margin-left: 12.5rpx;
            font-weight: normal;
          }
          .money {
            font-size: 25rpx;
            color: #FC6666;
            font-weight: bold;
          }
          .link {
            color: #43C9A7;
          }
          .txt {
            display: inline-block;
            max-width: 400rpx;
          }
          .money-weight {
            font-weight: bold;
          }
        }
      }
      .box-flex:last-child {
        padding-bottom: 0;
      }
      .text-weight {
        align-items: flex-start;
        .flex-right {
          font-weight: bold;
          font-size: 23.75rpx;
        }
      }
      .btn {
        display: flex;
        &>view {
          width: 262.5rpx;
          height: 57.5rpx;
          line-height: 57.5rpx;
          text-align: center;
          border-radius: 7.5rpx;
          border: 1px solid #DBE1E4;
          font-size: 21.25rpx;
        }
        &>view:nth-child(2) {
          width: 356.25rpx;
          margin-left: 12.5rpx;
          background-color: #43C9A7;
          border-color: #43C9A7;
          color: #fff;
          font-size: 25rpx;
          font-weight: bold;
        }
      }
    }
    .box-product {
      .box-flex {
        align-items: flex-start;
        .flex-right {
          margin-left: 15rpx;
          .sub-title {
            max-width: 562.5rpx;
            font-size: 25rpx;
            font-weight: bold;
            color: #1A1A1A;
          }
          .desc {
            font-size: 20rpx;
            color: #666;
            padding-top: 10rpx;
          }
        } 
      }
    }
    .fixed-bottom {
      width: 750rpx;
      height: 75rpx;
      background-color: #fff;
      border-radius: 12.5rpx 12.5rpx 0 0;
      position: fixed;
      bottom: 0;
      left: 50%;
      margin-left: -375rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 7.5rpx 16.25rpx 7.5rpx 27.5rpx;
      box-sizing: border-box;
      .kf {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 17.5rpx;
        color: #5796F8;
        image {
          width: 40rpx;
          height: 40rpx;
        }
      }
      .price {
        display: flex;
        align-items: center;
        .amount {
          &>view:nth-child(1) {
            text-align: right;
            color: #FF7A3A;
            font-weight: bold;
            font-size: 20rpx;
            text {
              font-size: 27.5rpx;
            }
          }
          &>view:nth-child(2) {
            text-align: right;
            font-size: 17.5rpx;
            color: #BDBDBD;
            text-decoration: line-through;
          }
        }
        .pay-btn {
          width: 431.25rpx;
          height: 56.25rpx;
          text-align: center;
          
          border-radius: 7.5rpx;
          background-color: #43C9A7;
          color: #fff;
          font-size: 25rpx;
          font-weight: bold;
          margin-left: 12.5rpx;
          ._text {
            line-height: 56.25rpx;
          }
        }
      }
    }
    .btm-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 21.25rpx;
      width: 750rpx;
      height: 80rpx;
      padding: 12.5rpx 0;
      box-sizing: border-box;
      margin-left: -16.25rpx;
      &>view {
        width: 275rpx;
        height: 55rpx;
        line-height: 55rpx;
        text-align: center;
        border-radius: 27.5rpx;
        border: 1px solid #1A1A1A;
        background-color: #fff;
        font-size: 21.25rpx;
      }
      .btn1 {
        margin-right: 12.5rpx;
      }
    }
  }
  @media screen and (max-width: 500px) {
    .container {
      font-size: 32rpx;
      padding: 36rpx 14rpx 130rpx 14rpx;
      .title {
        font-size: 40rpx;
        margin-bottom: 36rpx;
        padding-left: 26rpx;
        .tip {
          font-size: 32rpx;
          display: block;
          padding: 14rpx 0 0 0;
        }
        .cutdown {
          padding-left: 20rpx;
        }
      }
      .box-common {
        padding: 40rpx 25rpx;
        border-radius: 20rpx;
        margin-bottom: 16rpx;
        ._t {
          font-size: 36rpx;
          margin-bottom: 32rpx;
        }
        .tip {
          width: 530rpx;
          height: 60rpx;
          line-height: 60rpx;
          border-radius: 30rpx;
          font-size: 34rpx;
          margin-bottom: 26rpx;
        }
        .box-flex {
          font-size: 32rpx;
          padding-bottom: 26rpx;
          align-items: center;
          .flex-left {
            width: 150rpx;
            image {
              width: 120rpx;
              height: 120rpx;
              border-radius: 20rpx;
              flex: 0 0 120rpx;
            }
          }
          .flex-right {
            margin-left: 15rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .copy {
              font-size: 32rpx;
              padding: 5rpx 15rpx;
              border-radius: 35rpx;
              margin-left: 10rpx;
              flex: 0 0 70rpx;
            }
            .money {
              font-size: 40rpx;
            }
            .txt {
              max-width: 410rpx;
              // max-width: auto;
            }
          }
        }
        .text-weight {
          align-items: flex-start;
          .flex-right {
            font-size: 36rpx;
          }
        }
        .btn {
          &>view {
            width: 304rpx;
            height: 92rpx;
            line-height: 92rpx;
            border-radius: 12rpx;
            font-size: 34rpx;
          }
          &>view:nth-child(2) {
            width: 354rpx;
            margin-left: 12rpx;
            font-size: 40rpx;
          }
        }
      }
      .box-product {
        .box-flex {
          align-items: flex-start;
          .flex-right {
            display: block;
            margin-left: 0rpx;
            .sub-title {
              max-width: 530rpx;
              font-size: 40rpx;
            }
            .desc {
              font-size: 32rpx;
              padding-top: 25rpx;
            }
          } 
        }
      }
      .box-mobile-money {
        .box-flex {
          .flex-right {
            display: block;
            text-align: right;
            text {
              vertical-align: middle;
              padding-left: 22rpx;
            }
          }
        }
        
      }
      .fixed-bottom {
        height: 116rpx;
        border-radius: 0;
        padding: 14rpx 22rpx 14rpx 16rpx;
        .kf {
          font-size: 22rpx;
          image {
            width: 60rpx;
            height: 60rpx;
          }
        }
        .price {
          .amount {
            &>view:nth-child(1) {
              font-size: 28rpx;
              text {
                font-size: 44rpx;
              }
            }
            &>view:nth-child(2) {
              font-size: 24rpx;
            }
          }
          .pay-btn {
            width: 400rpx;
            height: 88rpx;
            border-radius: 12rpx;
            font-size: 34rpx;
            margin-left: 22rpx;
            ._text {
              line-height: 88rpx;
            }
          }
        }
      }
      .btm-btn {
        position: fixed;
        bottom: 0;
        margin-top: 28rpx;
        width: 750rpx;
        height: 116rpx;
        padding: 14rpx;
        margin-left: -14rpx;
        background-color: #fff;
        justify-content: flex-end;
        border-top: 1px solid rgba(0, 0, 0, 0.08);
        &>view {
          width: 252rpx;
          height: 88rpx;
          line-height: 88rpx;
          border-radius: 44rpx;
          font-size: 34rpx;
        }
        .btn1 {
          margin-right: 16rpx;
        }
      }
      .one-btm-btn {
        justify-content: center;
        &>view {
          width: 724rpx;
          height: 88rpx;
        }
      }
    }
  }
</style>