<template>
  <view>
    
    <nav-bar title='认知障碍筛查' :backdelta="backdelta"></nav-bar>
    
    <view class="container" v-if="isPad">
      <view class="title"><text>根据您的基本情况，推荐您使用</text><text class="reset" @click="naveToPage('/pages/evaluation/sort')">重新填写基本情况</text></view>
      <view :class="[isGuidTip1 ? 'guid-tip' : '', 'box']">
        <view v-if="isGuidTip1" class="guid-top">
          
          <view class="content1">
            <image class="img" :src="imgPrefix + '/static/operateSteps/portalH5/pages/recommend-img-2.png'"></image>
            <view class="guid-middle">
              <view class="guid-desc">{{recommendGoods.businessType == "2210081722239380029" ? "如果您独立评估有困难，可以选择【认知评估】由专业评估师，1对1为您提供评估服务" : "根据您的基本情况，推荐您优先使用【认知障碍筛查】的方式，评估大脑是否存在认知风险"}}</view>
            </view>
          </view>
          <view class="content2">
            <view v-if="!isPad" class="guid-btn guid-btn-close" @click="closeGuid">退出引导</view>
            <view class="guid-btn" @click="showGuid(1)">了解下一步</view>
            <uni-icons v-if="isPad" class="guid-close" type="closeempty" size="20" color="#fff" @click="closeGuid"></uni-icons>
          </view>
        </view>
        <view class="img-content">
          <image class="img-1" :src="imgPrefix + recommendGoods.imgUrl" />
          <image class="recommend" :src="imgPrefix + '/static/operateSteps/portalH5/pages/recommend2.png'"></image>
        </view>
        <view class="_right">
          <view class="_r-top">
            <text class="_txt1">{{recommendGoods.title}}</text>
            <text class="_txt2">{{recommendGoods.subTitle}}</text>
          </view>
          <view class="desc">
            <rich-text :nodes="recommendGoods.detail"></rich-text>
          </view>
          <view class="_label" v-if="recommendGoods.labelList">
            <text v-for="item in recommendGoods.labelList" :key="item">{{item}}</text>
          </view>
          <view class="price">
            <view class="price-left">
              <text v-if="recommendGoods.amount / 100 > 0">￥{{recommendGoods.amount / 100}}</text>
              <text class="price-left-free" v-else>限时免费</text>
              <text>￥{{recommendGoods.originalAmount / 100}}</text>
            </view>
            <view class="price-right">
              <view class="_detail btn">
                <view @click="goDetail(recommendGoods.goodsId)">详情</view>
                <tip v-if="isGuidTip3" :isShowTopBtnRight="false" :gestureLeftPos="130" :gestureTopPos="-140" :leftPos="-170" :bottomPos="-150" :guidContent="guidList" :gestureType="3" @nextHandle="closeGuid" @closeHandle="closeGuid"></tip>
              </view>
              <view>
                <view :class="[recommendGoods.businessType == '2210081722239380029' && (recommendGoods.payStatus == 1) ? 'status-top' : '' ,'status']" v-if="recommendGoods.payStatus == 1">
                  <uni-icons type="checkbox" size="26" color="#BFBFBF" click="icon"></uni-icons>
                  <text>已购买</text>
                </view>
                <view class="appoint-time" v-if="recommendGoods.businessType == '2210081722239380029' && (recommendGoods.payStatus == 1)">预约时间：{{recommendGoods.appointmentTime}}</view>
                <block v-if="recommendGoods.businessType == '2210081722313010031'">
                  <view v-if="(!recommendGoods.payStatus || recommendGoods.payStatus == 0)">
                    <payment @nextHandle="nextHandle" @closePayResultHandle="closePayResultHandle" :price="recommendGoods.amount" :goodsId="recommendGoods.goodsId" :addressFlag="+recommendGoods.addressFlag" :buyType="recommendGoods.businessType == '2210081722239380029' ? '2' : '1'">
                      <text class="btn btn-buy">立即购买</text>
                    </payment>
                  </view>
                  <view class="btn btn-buy" @click="goEvaluation(recommendGoods.payOrderId)" v-else>立即评估</view>
                </block>
                <block v-else>
                  <view class="btn btn-buy" v-if="(!recommendGoods.payStatus || recommendGoods.payStatus == 0)" @click="appointmentHandle(recommendGoods)">立即预约</view>
                  <view class="btn btn-buy" v-else @click="goAppointmentDetail(recommendGoods.payOrderId)">查看预约</view>
                </block>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="title"><text>其他评估方式</text></view>
      <view :class="[isGuidTip2 ? 'guid-tip' : '', 'box']" v-for="item in otherGoodsList" :key="item.goodsId">
        <view v-if="isGuidTip2" class="guid-top">
          <image class="img" :src="imgPrefix + '/static/operateSteps/portalH5/pages/recommend-img-2.png'"></image>
          <view class="guid-desc">{{item.businessType == "2210081722239380029" ? "如果您独立评估有困难，可以选择【认知评估】由专业评估师，1对1为您提供评估服务" : "根据您的基本情况，推荐您优先使用【认知障碍筛查】的方式，评估大脑是否存在认知风险"}}</view>
          <view class="guid-btn" @click="showGuid(2)">了解下一步</view>
          <uni-icons class="guid-close" type="closeempty" size="20" color="#fff" @click="closeGuid"></uni-icons>
        </view>
        <view class="img-content"><image class="img-1" :src="imgPrefix + item.imgUrl" /></view>
        <view class="_right">
          <view class="_r-top">
            <text class="_txt1">{{item.title}}</text>
            <text class="_txt2 _color">{{item.subTitle}}</text>
          </view>
          <view class="desc">
            <rich-text :nodes="item.detail"></rich-text>
          </view>
          <view class="_label" v-if="item.labelList">
            <text v-for="label in item.labelList" :key="label">{{label}}</text>
          </view>
          <view class="price">
            <view class="price-left">
              <text v-if="item.amount / 100 > 0">￥{{item.amount / 100}}</text>
              <text class="price-left-free" v-else>限时免费</text>
              <text>￥{{item.originalAmount / 100}}</text>
            </view>
            <view class="price-right">
              <view class="_detail btn"><text @click="goDetail(item.goodsId)">详情</text></view>
              <view>
                <view :class="[item.businessType == '2210081722239380029' && (item.payStatus == 1) ? 'status-top' : '', 'status']" v-if="item.payStatus == 1">
                  <uni-icons type="checkbox" size="26" color="#BFBFBF" click="icon"></uni-icons>
                  <text>已购买</text>
                </view>
                <view class="appoint-time" v-if="item.businessType == '2210081722239380029' && (item.payStatus == 1)">预约时间：{{item.appointmentTime}}</view>
                <block v-if="item.businessType == '2210081722313010031'">
                  <view v-if="(!item.payStatus || item.payStatus == 0)">
                    <payment @nextHandle="nextHandle" @closePayResultHandle="closePayResultHandle" :price="item.amount" :goodsId="item.goodsId" :addressFlag="+item.addressFlag" :buyType="item.businessType == '2210081722239380029' ? '2' : '1'">
                      <text class="btn btn-buy">立即购买</text>
                    </payment>
                  </view>
                  <view class="btn btn-buy" @click="goEvaluation(item.payOrderId)" v-else>立即评估</view>
                </block>
                <block v-else>
                  <view class="btn btn-buy" v-if="(!item.payStatus || item.payStatus == 0)" @click="appointmentHandle(item)">立即预约</view>
                  <view class="btn btn-buy" v-else @click="goAppointmentDetail(item.payOrderId)">查看预约</view>
                </block>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="container container-mobile" v-else>
      <view class="title"><text>根据您的基本情况，推荐您使用</text><text class="reset" @click="naveToPage('/pages/evaluation/sort')">重新填写基本情况</text></view>
      <view :class="[isGuidTip1 ? 'guid-tip' : '', 'box']">
        <!--引导弹层-->
        <view v-if="isGuidTip1" class="guid-top">
          
          <view class="content1">
            <image class="img" :src="imgPrefix + '/static/operateSteps/portalH5/pages/recommend-img-2.png'"></image>
            <view class="guid-middle">
              <view class="guid-desc">{{recommendGoods.businessType == "2210081722239380029" ? "如果您独立评估有困难，可以选择【认知评估】由专业评估师，1对1为您提供评估服务" : "根据您的基本情况，推荐您优先使用【认知障碍筛查】的方式，评估大脑是否存在认知风险"}}</view>
            </view>
          </view>
          <view class="content2">
            <view v-if="!isPad" class="guid-btn guid-btn-close" @click="closeGuid">退出引导</view>
            <view class="guid-btn" @click="showGuid(1)">了解下一步</view>
            <uni-icons v-if="isPad" class="guid-close" type="closeempty" size="20" color="#fff" @click="closeGuid"></uni-icons>
          </view>
        </view>
        <!--end-->
        <view class="m-box-top">
          <view class="img-1">
            <image :src="imgPrefix + recommendGoods.appImgUrl" />
            <view class="m-subtitle" v-if="recommendGoods.subTitle">{{recommendGoods.subTitle}}</view>
            <image class="recommend" :src="imgPrefix + '/static/operateSteps/portalH5/pages/recommend2.png'"></image>
          </view>
          <view class="m-desc">
            <view class="title">
              <view>{{recommendGoods.title}}</view>
              <view>
                <text class="_txt1" >￥{{recommendGoods.originalAmount / 100}}</text>
                <text class="_txt2" v-if="recommendGoods.amount / 100 > 0">￥{{recommendGoods.amount / 100}}</text>
                <text class="_txt2 _txt3" v-else>限时免费</text>
              </view>
            </view>
            <view>
              <rich-text :nodes="recommendGoods.detail"></rich-text>
            </view>
            <view class="_label" v-if="recommendGoods.labelList">
              <text v-for="item in recommendGoods.labelList" :key="item">{{item}}</text>
            </view>
            <view class="m-button">
              <view class="m-btn m-btn-detail" >
                <view @click="goDetail(recommendGoods.goodsId)">查看详情</view>
                <tip v-if="isGuidTip3" :isShowTopBtnBtm="true" :isShowTopBtnRight="false" :gestureLeftPos="isPad ? 130 : 90" :gestureTopPos="isPad ? -140 : -230" :leftPos="isPad ? -170 : 60" :bottomPos="isPad ? -150 : -240" :guidContent="guidList" :gestureType="3" @nextHandle="closeGuid" @closeHandle="closeGuid"></tip>
              </view>
              <block v-if="recommendGoods.businessType == '2210081722313010031'">
                <view v-if="(!recommendGoods.payStatus || recommendGoods.payStatus == 0)">
                  <payment @nextHandle="nextHandle" @closePayResultHandle="closePayResultHandle" :price="recommendGoods.amount" :goodsId="recommendGoods.goodsId" :addressFlag="+recommendGoods.addressFlag" :buyType="recommendGoods.businessType == '2210081722239380029' ? '2' : '1'">
                    <text class="m-btn">立即购买</text>
                  </payment>
                </view>
                <view class="m-btn" @click="goEvaluation(recommendGoods.payOrderId)" v-else>立即评估</view>
              </block>
              <block v-else>
                <view class="m-btn" v-if="(!recommendGoods.payStatus || recommendGoods.payStatus == 0)" @click="appointmentHandle(recommendGoods)">立即预约</view>
                <view class="m-btn" v-else @click="goAppointmentDetail(recommendGoods.payOrderId)">查看预约</view>
              </block>
            </view>
          </view>
        </view>
        <view class="m-box-bottom brToHalfTop" v-if="recommendGoods.payStatus == 1">
          <uni-icons type="checkbox" size="26" color="#BFBFBF" click="icon"></uni-icons>
          <text>已购买</text>
          <text class="m-appoint-time" v-if="recommendGoods.businessType == '2210081722239380029' && (recommendGoods.payStatus == 1)">预约时间：{{recommendGoods.appointmentTime}}</text>
        </view>
      </view>
      
      <view class="title"><text>其他评估方式</text></view>
      <view :class="[isGuidTip2 ? 'guid-tip' : '', 'box']" v-for="item in otherGoodsList" :key="item.goodsId">
        <!--引导弹层-->
        <view v-if="isGuidTip2" class="guid-top">
          
          <view class="content1">
            <image class="img" :src="imgPrefix + '/static/operateSteps/portalH5/pages/recommend-img-2.png'"></image>
            <view class="guid-middle">
              <view class="guid-desc">{{item.businessType == "2210081722239380029" ? "如果您独立评估有困难，可以选择【认知评估】由专业评估师，1对1为您提供评估服务" : "根据您的基本情况，推荐您优先使用【认知障碍筛查】的方式，评估大脑是否存在认知风险"}}</view>
            </view>
          </view>
          <view class="content2">
            <view v-if="!isPad" class="guid-btn guid-btn-close" @click="closeGuid">退出引导</view>
            <view class="guid-btn" @click="showGuid(2)">了解下一步</view>
            <uni-icons v-if="isPad" class="guid-close" type="closeempty" size="20" color="#fff" @click="closeGuid"></uni-icons>
          </view>
        </view>
        <!--end-->
        <view class="m-box-top">
          <view class="img-1">
            <image :src="imgPrefix + item.appImgUrl" />
            <view class="m-subtitle m-subtitle-color" v-if="item.subTitle">{{item.subTitle}}</view>
          </view>
          <view class="m-desc">
            <view class="title">
              <view>{{item.title}}</view>
              <view>
                <text class="_txt1">￥{{item.originalAmount / 100}}</text>
                <text class="_txt2" v-if="item.amount / 100 > 0">￥{{item.amount / 100}}</text>
                <text class="_txt2 _txt3" v-else>限时免费</text>
              </view>
            </view>
            <view>
              <rich-text :nodes="item.detail"></rich-text>
            </view>
            <view class="_label" v-if="item.labelList">
              <text v-for="label in item.labelList" :key="label">{{label}}</text>
            </view>
            <view class="m-button">
              <view class="m-btn m-btn-detail" @click="goDetail(item.goodsId)">查看详情</view>
              <block v-if="item.businessType == '2210081722313010031'">
                <view v-if="(!item.payStatus || item.payStatus == 0)">
                  <payment @nextHandle="nextHandle"  @closePayResultHandle="closePayResultHandle" :price="item.amount" :goodsId="item.goodsId" :addressFlag="+item.addressFlag" :buyType="item.businessType == '2210081722239380029' ? '2' : '1'">
                    <text class="m-btn">立即购买</text>
                  </payment>
                </view>
                <view class="m-btn" @click="goEvaluation(item.payOrderId)" v-else>立即评估</view>
              </block>
              <block v-else>
                <view class="m-btn" v-if="(!item.payStatus || item.payStatus == 0)" @click="appointmentHandle(item)">立即预约</view>
                <view class="m-btn" v-else @click="goAppointmentDetail(item.payOrderId)">查看预约</view>
              </block>
            </view>
          </view>
        </view>
        <view class="m-box-bottom brToHalfTop" v-if="item.payStatus == 1">
          <uni-icons type="checkbox" size="26" color="#BFBFBF" click="icon"></uni-icons>
          <text>已购买</text>
          <text class="m-appoint-time" v-if="item.businessType == '2210081722239380029' && (item.payStatus == 1)">预约时间：{{item.appointmentTime}}</text>
        </view>
      </view>
    </view>
    <pay-result v-if="isShowPayResult" @closeHandle="closeHandle" @goNextHandle="goNextHandle" :payReturnMsg="payReturnMsg">
    </pay-result>
    <guid-tip v-if="guidTipMask"></guid-tip>
    <back-home v-if="isWechat"></back-home>
  </view>
</template>

<script>
  import navBar from '@/components/nav-bar'
  import payment from '@/components/payment'
  import payResult from '@/components/pay-result'
  import guidTip from '@/components/guid-tip/guid-mask'
  import tip from '@/components/guid-tip/tip'
  import backHome from '@/components/common-page/back-home'

  import {
    navigateTo,
    getQueryString,
    isTimeExpire
  } from '@/utils/util'
  export default {
    components: {
      navBar,
      payResult,
      payment,
      guidTip,
      tip,
      backHome
    },
    data() {
      return {
        isWechat: this.$isWechat,
        userInfo: {},
        backdelta: 1,
        paySuccess: false,
        payOrderId: '',
        isShowPayResult: false,
        payMsg: '',
        otherGoodsList: [],
        recommendGoods: {},
        imgPrefix: this.$imgPrefix,
        isPad: this.$pad,
        payReturnMsg: {},
        isGuidTip1: false,
        isGuidTip2: false,
        isGuidTip3: false,
        guidTipMask: false,
        guidList: {
          title: '如果您想了解更多',
          descList: ['可以点击【 计划详情】']
        }
      }
    },
    onShow() {
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
      this.getGoodsList()
    },
    onLoad(options) {
      if (options.backdelta) {
        this.backdelta = options.backdelta
      } else if (options.fromPage) {
        this.backdelta = 2
      }
    },
    mounted() {
      // #ifdef H5 || APP-PLUS
      if (!this.$pad) {
        // let payStatus = getQueryString(window.location.href, 'status')
        let routes = getCurrentPages()
        let curRoute = routes[routes.length - 1].route
        let curParam = routes[routes.length - 1].options || routes[routes.length - 1].$route.query
        let payStatus = curParam.status
        let payOrderId = curParam.payOrderId
        if (payStatus) {
          //payStatus存在 => 支付页面回来的
          if (payStatus == 2) {
            // 2 => 支付成功
            this.payReturnMsg = {
              payRes: true,
              payOrderId
            }
          } else {
            this.payReturnMsg = {
              payRes: false,
              payOrderId
            }
          }
          this.isShowPayResult = true
        }
      }
      // #endif
      // if (uni.getStorageSync('hasEvaGuid') && isTimeExpire()) {
      //   // 如果已经弹窗引导并且在7天内登录过，不再弹窗
      //   this.isGuidTip1 = false
      //   this.guidTipMask = false
      // } else {
      //   this.isGuidTip1 = true
      //   this.guidTipMask = true
      // }
    },
    methods: {
      nextHandle(res) {
        // this.getGoodsList()
        // this.paySuccess = res.payRes
        // this.payOrderId = res.payOrderId
        this.goEvaluation(res.payOrderId)
      },
      goEvaluation(payOrderId = '') {
        getApp().goEvalution({
          token: this.userInfo.token,
          requestType: 1,
          payOrderId: payOrderId ? payOrderId : this.payOrderId,
          backType: 2
        })
      },
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
            if (this.userInfo.info.education == 10 || this.userInfo.info.education == 11 || this.userInfo.info.education == 1) {
              // 推荐认知评估（小学三年级及以下）
              let resArr = res.data ? res.data.filter(item => item.businessType == '2210081722239380029') : []
              this.recommendGoods = resArr.length ? resArr[0] : {}
              this.otherGoodsList = res.data ? res.data.filter(item => item.businessType !=
                '2210081722239380029') : []
            } else {
              // 推荐认知障碍筛查(小学三年级以上)
              let resArr = res.data ? res.data.filter(item => item.businessType == '2210081722313010031') : []
              this.recommendGoods = resArr.length ? resArr[0] : {}
              this.otherGoodsList = res.data ? res.data.filter(item => item.businessType !=
                '2210081722313010031') : []
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
      appointmentHandle(item) {
        navigateTo(`/pages/evaluation/artificial?goodsId=${item.goodsId}&amount=${item.amount}&originalAmount=${item.originalAmount}&addressFlag=${item.addressFlag}`)
      },
      goAppointmentDetail(payOrderId) {
        getApp().goHealthConsulting({
          payOrderId: payOrderId,
          token: this.userInfo.token,
          type: 2
        })
      },
      goDetail(goodsId) {
        navigateTo('/pages/evaluation/detail?goodsId=' + goodsId)
      },
      naveToPage(url) {
        navigateTo(url)
      },
      closePayResultHandle(res) {
        // this.isShowPayResult = false
        this.getGoodsList()
        this.payOrderId = res.payOrderId
      },
      goNextHandle() {
        
        this.isShowPayResult = false
        // #ifdef APP-PLUS
        let routes = getCurrentPages()
        let curRoute = routes[routes.length - 1].route
        let curParam = routes[routes.length - 1].options || routes[routes.length - 1].$route.query
        let buyType = curParam.buyType
        if (buyType == 2) {
          // 查看预约
          this.goAppointmentDetail(this.payReturnMsg.payOrderId)
        } else {
          // 立即评估
          this.goEvaluation(this.payReturnMsg.payOrderId)
        }
        // #endif
        // #ifdef H5
        if (getQueryString(window.location.href, 'buyType') == 2) {
          // 查看预约
          this.goAppointmentDetail(this.payReturnMsg.payOrderId)
          // 替换浏览器的url值，防止刷新页面后出现支付结果弹窗
          window.history.replaceState(null, null, window.location.href.split('?')[0])
        } else {
          // 立即评估
          this.goEvaluation(this.payReturnMsg.payOrderId)
        }
        // #endif
        
        
      },
      closeHandle() {
        // this.isShowPayResult = false
        // // #ifdef H5
        // // 替换浏览器的url值，防止刷新页面后出现支付结果弹窗
        // window.history.replaceState(null, null, window.location.href.split('?')[0])
        // // #endif
        this.isShowPayResult = false
        // #ifdef H5
        // 替换浏览器的url值，防止刷新页面后出现支付结果弹窗
        window.history.replaceState(null, null, window.location.href.split('?')[0])
        // #endif
        
        // #ifdef APP-PLUS
        // 重定向url值，防止刷新页面后出现支付结果弹窗
        
        uni.redirectTo({
          url: '/pages/evaluation/result?backdelta=2'
        })
        // #endif
      },
      showGuid(num) {
        this['isGuidTip' + num] = false
        this['isGuidTip' + (num + 1)] = true
        if (num == 2) {
          this.guidTipMask = false
        }
        if (num == 1) {
          uni.pageScrollTo({
            scrollTop: 400
          })
        } else if (num == 2) {
          uni.pageScrollTo({
            scrollTop: 10
            // selector: '.more-production .list'
          })
        } else if (num == 3) {
          this.guidTipMask = false
          uni.pageScrollTo({
            scrollTop: 0
          })
        }
      },
      closeGuid() {
        // 关闭引导
        this.isGuidTip1 = false
        this.isGuidTip2 = false
        this.isGuidTip3 = false
        this.guidTipMask = false
        uni.setStorageSync('hasEvaGuid', true)
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
    padding: 0rpx 11.72rpx 16.11rpx 11.72rpx;
    overflow: hidden;
    margin: 0 auto;

    .title {
      font-size: 17.58rpx;
      color: #333;
      font-weight: bold;
      margin: 21.97rpx 0 13.18rpx 0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .reset {
        font-weight: normal;
        font-size: 13.18rpx;
        color: #502459;
        text-decoration: underline;
      }
    }

    .box {
      background-color: #fff;
      border-radius: 14.65rpx;
      padding: 17.58rpx 0 17.58rpx 17.58rpx;
      box-sizing: border-box;
      display: flex;
      
      .img-content {
        position: relative;
        .img-1 {
          width: 229.99rpx;
          height: 168.46rpx;
          border-radius: 8.79rpx;
          margin-right: 8.79rpx;
        }
        .recommend {
          width: 87.91rpx;
          height: 87.91rpx;
          position: absolute;
          top: 0;
          left: 0;
        }
      }
      
      ._right {
        flex: 1;
      }

      ._r-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: bold;

        ._txt1 {
          font-size: 20.51rpx;
        }

        ._txt2 {
          font-size: 13.18rpx;
          width: 188.97rpx;
          text-align: center;
          height: 29.3rpx;
          line-height: 29.3rpx;
          background-color: #783B85;
          border-top-left-radius: 14.65rpx;
          border-bottom-left-radius: 14.65rpx;
          color: #fff;
        }

        ._color {
          background-color: #fff;
          border-top: 1px solid #753C81;
          border-bottom: 1px solid #753C81;
          border-left: 1px solid #753C81;
          color: #753C81;
          
        }
      }

      .desc {
        font-size: 14.65rpx;
        color: #999;
        padding: 8.79rpx 0 11.72rpx 0;
      }

      ._label {
        display: flex;
        flex-wrap: wrap;

        text {
          padding: 8.79rpx 11.72rpx;
          background-color: #F5F5F5;
          border-radius: 5.86rpx;
          display: block;
          font-size: 14.65rpx;
          margin-right: 10.25rpx;
        }
      }

      .price {
        padding-right: 17.58rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 21.98rpx;

        .price-left {
          text:nth-child(1) {
            font-size: 24.9rpx;
            color: #DF5C1D;
            padding-right: 14.65rpx;
            font-weight: bold;
          }

          text:nth-child(2) {
            font-size: 11.72rpx;
            color: #999;
            text-decoration: line-through;
          }
          .price-left-free {
            font-size: 20rpx !important;
          }
        }

        .price-right {
          display: flex;
          align-items: center;

          .btn {
            display: block;
            width: 155.28rpx;
            height: 49.81rpx;
            text-align: center;
            line-height: 49.81rpx;
            color: #fff;
            background-color: #753C81;
            border: 1px solid #753C81;
          }
          .btn-buy {
            border-top-right-radius: 7.32rpx;
            border-bottom-right-radius: 7.32rpx;
          }

          &>view {
            position: relative;

            .status {
              position: absolute;
              font-size: 13.18rpx;
              color: #BFBFBF;
              top: -36.63rpx;
              left: 40%;
              transform: translateX(-50%);

              .icon {
                vertical-align: middle;
              }

              &>text {
                vertical-align: middle;
                padding-left: 3.66rpx;
              }
            }
            .status-top {
              top: -58.61rpx;
            }
          }

          &>._detail {
            font-size: 21.98rpx;
            color: #DF5C1D;
            position: relative;
            background-color: #fff;
            color: #753C81;
            border: 1px solid #753C81;
            border-top-left-radius: 7.32rpx;
            border-bottom-left-radius: 7.32rpx;
          }
          .appoint-time {
            
            position: absolute;
            font-size: 13.18rpx;
            color: #502459;
            top: -25.64rpx;
            left: -20.99rpx;
          }
        }
      }
    }
    .guid-tip {
      position: relative;
      z-index: 3;
      margin-top: 51.28rpx;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      border: 4.4rpx solid #336CEA;
    }
    .guid-top {
      height: 79.12rpx;
      background-color: #336CEA;
      font-size: 19.05rpx;
      padding: 12.45rpx 0;
      box-sizing: border-box;
      width: 726.74rpx;
      position: absolute;
      top: -79.12rpx;
      left: 0;
      border: 4.4rpx solid #336CEA;
      border-top-left-radius: 14.65rpx;
      border-top-right-radius: 14.65rpx;
      z-index: 999;
      display: flex;
      align-items: center;
      .content1 {
        display: flex;
        align-items: center;
      }
      .content2 {
        display: flex;
        align-items: center;
      }
      .img {
        width: 69.6rpx;
        height: 95.97rpx;
        margin-top: -24rpx;
      }
      .guid-desc {
        font-size: 19.05rpx;
        font-weight: bold;
        color: #fff;
        width: 399.27rpx;
        line-height: 27.11rpx;
        margin: 0 29.3rpx 0 21.98rpx;
      }
      .guid-btn {
        width: 144.32rpx;
        height: 42.49rpx;
        line-height: 42.49rpx;
        text-align: center;
        border-radius: 7.33rpx;
        background-color: #B0E9FF;
        font-size: 20.51rpx;
        color: #336CEA;
        font-weight: bold;
      }
      .guid-close {
        padding: 10rpx;
        align-self: flex-start;
        margin-top: -12rpx;
        margin-left: 20rpx;
      }
    }
  }
  
  .container-mobile {
    padding: 0 30rpx 30rpx 30rpx;
    .title {
      font-size: 30rpx;
      .reset {
        font-size: 26rpx;
      }
    }
    .guid-tip {
      position: relative;
      z-index: 3;
      margin-top: 310rpx;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      border: 6rpx solid #336CEA;
    }
    .guid-top {
      height: auto;
      background-color: #336CEA;
      font-size: 32rpx;
      padding: 28rpx 0;
      box-sizing: border-box;
      width: 690rpx;
      position: absolute;
      top: -310rpx;
      left: -3px;
      border: 6rpx solid #336CEA;
      border-top-left-radius: 20rpx;
      border-top-right-radius: 20rpx;
      z-index: 999;
      display: flex;
      align-items: center;
      flex-direction: column;
      .content1 {
        width: 690rpx;
        display: flex;
        align-items: center;
      }
      .content2 {
        width: 690rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 30rpx;
        box-sizing: border-box;
      }
      .img {
        width: 140rpx;
        height: 194rpx;
        margin-top: -110rpx;
      }
      .guid-desc {
        font-size: 32rpx;
        font-weight: bold;
        color: #fff;
        width: 500rpx;
        line-height: 44rpx;
        margin: 0 0rpx 0 15rpx;
      }
      .guid-btn {
        width: 224rpx;
        height: 84rpx;
        line-height: 84rpx;
        text-align: center;
        border-radius: 12rpx;
        background-color: #B0E9FF;
        font-size: 36rpx;
        color: #336CEA;
        font-weight: bold;
        margin-top: 24rpx;
      }
      .guid-close {
        padding: 10rpx;
        align-self: flex-start;
        margin-top: -12rpx;
        margin-left: 20rpx;
        display: none;
      }
    }
    .box {
      display: block;
      position: relative;
      padding: 0;
      .m-box-top {
        padding: 30rpx;
       
      }
      .img-1 {
        width: 626rpx;
        height: 348rpx;
        
        margin-right: 0rpx;
        position: relative;
        image {
          width: 626rpx;
          height: 348rpx;
          border-radius: 12rpx;
        }
        .recommend {
          width: 144rpx;
          height: 144rpx;
          position: absolute;
          top: 0;
          left: 0;
        }
      }
      .m-subtitle {
        position: absolute;
        top: 0;
        right: 0;
        font-size: 28rpx;
        font-weight: bold;
        padding: 0rpx 30rpx;
        height: 66rpx;
        line-height: 66rpx;
        color: #fff;
        border-top-left-radius: 33rpx;
        border-top-right-radius: 12rpx;
        border-bottom-left-radius: 33rpx;
        background-color: #783B85;
      }
      .m-subtitle-color {
        background-color: #fff;
        color: #753C81;
        border-top: 1px solid #753C81;
        border-bottom: 1px solid #753C81;
        border-left: 1px solid #753C81;
      }
      .m-desc {
        .title {
          display: flex;
          justify-content: space-between;
          &>view:nth-child(1) {
            font-size: 34rpx;
          }
          ._txt1 {
            font-size: 24rpx;
            text-decoration: line-through;
            color: #999;
          }
          ._txt2 {
            font-size: 52rpx;
            padding-left: 16rpx;
            color: #DF5C1D;
          }
          ._txt3 {
            font-size: 42rpx;
          }
        }
      }
      ._label {
        margin: 16rpx 0 26rpx 0;
        text {
          padding: 12rpx 16rpx;
          border-radius: 8rpx;
          font-size: 26rpx;
          margin-right: 8rpx;
        }
      }
      .m-button {
        display: flex;
        // justify-content: space-between;
        .m-btn {
          width: 308rpx;
          height: 96rpx;
          text-align: center;
          line-height: 96rpx;
          font-size: 34rpx;
          border-top-right-radius: 12rpx;
          border-bottom-right-radius: 12rpx;
          background-color: #753C81;
          color: #fff;
          display: block;
        }
        .m-btn-detail {
          border-top-right-radius: 0rpx;
          border-bottom-right-radius: 0rpx;
          border-top-left-radius: 12rpx;
          border-bottom-left-radius: 12rpx;
          color: #753C81;
          background-color: #fff;
          border: 1px solid #753C81;
          box-sizing: border-box;
        }
      }
      .m-box-bottom {
        padding: 10rpx 0;
        text-align: center;
        font-size: 28rpx;
        position: relative;
        color: #BFBFBF;
        text {
          vertical-align: middle;
          padding-left: 6rpx;
        }
        .m-appoint-time {
          font-size: 14rpx;
          color: #502459;
          padding-left: 12rpx;
        }
      }
    }
  }
</style>
