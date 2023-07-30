<template>
  <view>
   
    <nav-bar title='认知症数字疗法' :backUrl="specailBack == 1 ? '/pages/index/index' : ''"></nav-bar>
   
    <view class="container">
      <view class="top">
        <image class="doctor" :src="imgPrefix + '/static/operateSteps/portalH5/pages/recommend-img-2.png'"></image>
        <view class="top-desc">
          <view class="_h6">
            <view>已为您生成专属认知症数字疗法</view>
            <view class="what" @click="goToPage" v-if="isPad"><text>什么是认知症数字疗法？</text><image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-go.png'"></image></view>
          </view>
          <view>我们为您制定了个性化的认知症数字疗法方案，更有效的进行针对训练</view>
          <view class="what" @click="goToPage" v-if="!isPad"><text>什么是认知症数字疗法？</text><image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-go.png'"></image></view>
        </view>
      </view>
      
     <!-- <view class="_p1" v-if="isPad">根据您的筛查结果，推荐方案为：</view> -->
      <block v-if="recommendGoods.length">
        <view class="recommendation-bit">
          <view class="list" v-for="(item, index) in recommendGoods" :key="item.goodsId">
            <view class="title">
              <view>
                <image v-if="isPad" :src="imgPrefix + item.imgUrl"></image>
                <image v-else :src="imgPrefix + item.appImgUrl"></image>
                <text>{{item.title}}</text>
              </view>
              <image v-if="!item.payStatus || item.payStatus == 0" class="img-recommend" :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-recommend-flag.png'"></image>
              <image v-else class="img-recommend img-buy-flag" :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-buy-flag.png'"></image>
            </view>
            <view class="desc">
              <view class="desc-left">
                <view class="d-l-content">
                  <rich-text :nodes="item.detail"></rich-text>
                </view>
                <view class="_label">
                  <text v-for="label in item.labelList" :key="label">{{label}}</text>
                </view>
              </view>
              <image class="desc-mobile" :src="isPad ? imgPrefix + '/static/operateSteps/portalH5/pages/img-jl.png' : imgPrefix + '/static/operateSteps/portalH5/pages/img-jl-2.png'"></image>
              <view class="desc-right">
                <view class="fl-list">
                  <view class="fl-list-top">
                    <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-kfs.png'"></image>
                    <text>专属健康管理师</text>
                  </view>
                  <view class="fl-list-item">
                    <view class="item">
                      <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-dg.png'"></image>
                      <text>健康管理师全程指导</text>
                    </view>
                    <view class="item">
                      <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-dg.png'"></image>
                      <text>1对1咨询帮助</text>
                    </view>
                    <view class="item">
                      <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-dg.png'"></image>
                      <text>健康管理师定期关怀</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <view class="btm">
              <view :class="[!isPad && (item.payStatus && item.payStatus == 1) ? 'mobile-price' : '', 'price']">
                <view class="price-left">
                  <view v-if="item.amount / 100 > 0">¥<text>{{item.amount / 100}}</text></view>
                  <view v-else><text>限时免费</text></view>
                  <view>¥{{item.originalAmount / 100}}</view>
                </view>
                <view class="health-consulting" v-if="!isPad && (item.payStatus && item.payStatus == 1)" @click="showKfCode">
                  <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-gls.png'"></image>
                  <view>健康管理师</view>
                </view>
              </view>
              <view class="btm-right">
                <view class="health-consulting" v-if="isPad && (item.payStatus && item.payStatus == 1)" @click="showKfCode">
                  <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-gls.png'"></image>
                  <view>健康管理师</view>
                </view>
                <view class="button-group">
                  <view class="_view">
                    <text class="_text" @click="goDetail(item.goodsId)">计划详情</text>
                  </view>
                  <view class="_view">
                    <view v-if="!item.payStatus || item.payStatus == 0">
                      <payment @nextHandle="nextHandle" @closePayResultHandle="closePayResultHandle" :price="item.amount" :goodsId="item.goodsId" buyType="5" :addressFlag="+item.addressFlag" btnText="训练">
                        <text class="_text">立即购买</text>
                      </payment>
                    </view>
                    <view @click="goCognitiveTraining(item.payOrderId)" v-else><text class="_text">立即训练</text></view>
                  </view>
                </view>
              </view>
            </view>
          </view>

        </view>
      </block>
      <view class="more-production">
        <view class="title">更多产品</view>
        <image class="split" :src="imgPrefix + '/static/operateSteps/portalH5/pages/split.png'"></image>
        <view class="production">
          <view class="list" v-for="item in otherGoodsList" :key="item.goodsId">
            <view class="list-top">
              <image class="img-bg" :src="imgPrefix + '/static/operateSteps/portalH5/pages/img-bg-2.png'"></image>
              <view class="_tit">
                <image v-if="isPad" :src="imgPrefix + item.imgUrl"></image>
                <image v-else :src="imgPrefix + item.appImgUrl"></image>
                <text>{{item.title}}</text>
              </view>
              <view class="desc-content">
                <view class="desc">
                  <rich-text :nodes="item.detail"></rich-text>
                </view>
                <view class="_label">
                  <text v-for="label in item.labelList" :key="label">{{label}}</text>
                </view>
              </view>
            </view>
            
            <view class="list-btm">
              <view class="price" v-if="!item.payStatus || item.payStatus == 0">
                <view v-if="item.amount / 100 > 0">¥<text>{{item.amount / 100}}</text></view>
                <view v-else><text>限时免费</text></view>
                <view>¥{{item.originalAmount / 100}}</view>
              </view>
              <view class="button-group">
                <view class="_view" v-if="!item.payStatus || item.payStatus == 0">
                  <text class="_text" @click="goDetail(item.goodsId)">计划详情</text>
                </view>
                <view class="_view" v-else @click="showKfCode">添加健康管理师</view>
                <view class="_view">
                  <view v-if="!item.payStatus || item.payStatus == 0">
                    <!-- <text class="_text" @click="goToPay(item)">立即购买</text> -->
                    <payment @nextHandle="nextHandle" @closePayResultHandle="closePayResultHandle" :price="item.amount" :goodsId="item.goodsId" buyType="5" :addressFlag="+item.addressFlag" btnText="训练">
                      <text class="_text">立即购买</text>
                    </payment>
                  </view>
                  <view @click="goCognitiveTraining(item.payOrderId)" v-else>立即训练</view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <kf-code v-if="isShowKfCode" @closeKfHandle="closeKfHandle" ewmName="szlf-tjjkgls"></kf-code>
    <!--侧边栏-->
    <fab v-if="isShowFab" :isOpenFabMenu="isPad ? true : false"></fab>
    <!--end 侧边栏-->
  </view>
</template>

<script>
  import fab from '@/components/fab'
  import navBar from '@/components/nav-bar'
  import payment from '@/components/payment'
  import kfCode from '@/components/kf-code'
  import { navigateTo } from '@/utils/util'
  import {mixin} from '@/mixin/mixin'
  export default {
    mixins:[mixin],
    components: {
      navBar,
      payment,
      kfCode,
      fab
    },
    data() {
      return {
        isWechat: this.$isWechat,
        userInfo: {},
        // paySuccess: false,
        payOrderId: '',
        // isShowPayResult: false,
        isShowKfCode: false,
        // payMsg: '',
        recommendGoods: [],
        otherGoodsList: [],
        isPad: this.$pad,
        // 是否是从第三方页面跳回 0=>否 1=>是
        specailBack: 0,
        imgPrefix: this.$imgPrefix
      }
    },
    onLoad(options) {
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
      if (options.specailBack) {
        this.specailBack = options.specailBack
      }
      if (options.isRefresh == 'true') {
        this.getGoodsList()
      }
    },
    onShow() {
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
      this.getGoodsList()
      getApp().globalData.canMounted = true
    },
    methods: {
      getGoodsList() {
        this.$request({
          url: '/gw/h5/v1/front/goods/goodsList',
          method: 'post',
          data: {
            token: this.userInfo.token,
            type: 2,
            userId: this.userInfo.userId
          }
        }).then(res => {
          if (res.status === 1000) {
            let hasPaied = res.data ? res.data.filter(item => item.payStatus == '1') : []
            if (hasPaied.length) {
              // 如果有已支付订单
              this.recommendGoods = res.data ? res.data.filter(item => item.payStatus == '1' && item.businessType == '2210081722147310027') : []
              this.otherGoodsList = res.data ? res.data.filter(item => item.payStatus == '0') : []
              
            } else {
              // 没有已支付订单
              this.recommendGoods = res.data ? res.data.filter(item => item.recommend == '1') : []
              this.otherGoodsList = res.data ? res.data.filter(item => item.recommend != '1') : []
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
      // goToPay(item) {
      //   navigateTo('/pages/pre-pay/index')
      // },
      closePayResultHandle(res) {
        this.getGoodsList()
        this.payOrderId = res.payOrderId
      },
      nextHandle(res) {
        this.payOrderId = res.payOrderId
        this.getGoodsList()
        this.goCognitiveTraining()
      },
      goCognitiveTraining(payOrderId = '') {
        let routes = getCurrentPages() //获取加载的页面
        let curRoute = routes[routes.length - 1].route //获取当前页面的对象
        let backUrl = encodeURIComponent(`/${curRoute}?specailBack=1`)
        getApp().goCognitiveTraining({
          token: this.userInfo.token,
          isNeedLandscape: 'yes',
          redirectUrl: backUrl,
          payOrderId: payOrderId ? payOrderId : this.payOrderId
        })
      },
      goDetail(goodsId) {
        navigateTo('/pages/cognitive-training/detail?goodsId=' + goodsId  +'&isRcommend=true')
      },
      closeKfHandle() {
        this.isShowKfCode = false
      },
      showKfCode() {
        this.isShowKfCode = true
      },
      goToPage() {
        navigateTo('/pages/cognitive-training/guid?showBtm=false')
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
    margin: 0 auto;

    .top {
      padding: 8.06rpx 29.3rpx 0rpx 19.78rpx;
      background-color: #F2F2F2;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .doctor {
        width: 112.82rpx;
        height: 155.31rpx;
      }
      .top-desc {
        margin-left: 7.33rpx;
        font-size: 17.58rpx;
        color: #5A5BBB;
        flex: 1;
        .what {
          width: 207.33rpx;
          height: 30.04rpx;
          line-height: 30.04rpx;
          border-radius: 20.51rpx;
          background-color: #fff;
          text-align: center;
          font-size: 16.12rpx;
          color: #333;
          text {
            vertical-align: middle;
          }
          image {
            width: 16.12rpx;
            height: 16.12rpx;
            vertical-align: middle;
            margin-left: 7.33rpx;
          }
        }
        ._h6 {
          font-size: 26.37rpx;
          font-weight: bold;
          padding-bottom: 14.65rpx;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }
    }
    .button-group {
      display: flex;
      align-items: center;

      &>view._view {
        width: 208.06rpx;
        height: 55.68rpx;
        text-align: center;
        font-size: 21.98rpx;
        border-top: 1px solid #43C9A7;
        border-bottom: 1px solid #43C9A7;
        ._text {
          line-height: 55.68rpx;
          font-size: 21.98rpx;
        }
      }

      &>view._view:nth-child(1) {
        border-left: 1px solid #43C9A7;
        border-top-left-radius: 7.32rpx;
        border-bottom-left-radius: 7.32rpx;
        color: #43C9A7;
        position: relative;
      }

      &>view._view:nth-child(2) {
        border-right: 1px solid #43C9A7;
        border-top-right-radius: 7.32rpx;
        border-bottom-right-radius: 7.32rpx;
        background-color: #43C9A7;
        color: #fff;
      }
    }

    .recommendation-bit {
      padding: 18.32rpx 11.72rpx 17.58rpx 11.72rpx;
      background: #F5F5F5;
      box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.07);
      border-radius: 14.65rpx 14.65rpx 0px 0px;
      box-sizing: border-box;
      position: relative;
      margin: -21.98rpx 0 24.18rpx 0;
      .list {
        margin-bottom: 29.3rpx;
        
        .title {
          font-size: 26.37rpx;
          font-weight: bold;
          display: flex;
          align-items: center;
          margin-bottom: 13.19rpx;
          image {
            width: 54.21rpx;
            height: 54.21rpx;
            margin-right: 8.79rpx;
            vertical-align: middle;
          }
          text {
            vertical-align: middle;
            display: inline-block;
            max-width: 549.45rpx;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
             -o-text-overflow: ellipsis;
          }
          .img-recommend {
            width: 77.66rpx;
            height: 32.23rpx;
            margin-left: 11.72rpx;
          }
          .img-buy-flag {
            width: 102.56rpx;
            height: 32.23rpx;
          }
        }
        .desc {
          display: flex;
          align-items: center;
          .desc-left {
            width: 443.96rpx;
            height: 246.89rpx;
            flex: 0 0 443.96rpx;
            background: url('https://hjom-oss.yimed.cn/static/operateSteps/portalH5/pages/img-bg.png') no-repeat;
            background-size: 443.96rpx 246.89rpx;
            padding: 19.05rpx 35.16rpx 19.05rpx 30.77rpx;
            box-sizing: border-box;
            font-size: 19.05rpx;
            color: #4D4EA9;
            .d-l-content {
              line-height: 27.11rpx;
              font-weight: bold;
              max-height: 87.91rpx;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
            }
            ._label {
              font-size: 17.58rpx;
              margin-top: 21.98rpx;
              color: #CC7635;
              font-weight: bold;
              &>text {
                padding: 4.4rpx 17.58rpx;
                display: inline-block;
                margin: 0 7.33rpx 7.33rpx 0;
                border-radius: 4.4rpx;
                background-color: #FFF5EF;
              }
            }
          }
          .desc-mobile {
            width: 39.56rpx;
            height: 153.11rpx;
            margin: 0 -16.85rpx;
            flex: 0 0 39.56rpx;
          }
          .desc-right {
            width: 276.92rpx;
            height: 246.89rpx;
            background: url('https://hjom-oss.yimed.cn/static/operateSteps/portalH5/pages/img-fl.png') no-repeat;
            background-size: 276.92rpx 246.89rpx;
            box-sizing: border-box;
            padding: 60.07rpx 0 19.78rpx 36.63rpx;
            .fl-list {
              display: flex;
              flex-direction: column;
              .fl-list-top {
                image {
                  width: 41.03rpx;
                  height: 41.03rpx;
                  display: inline-block;
                  vertical-align: middle;
                }
                text {
                  vertical-align: middle;
                  font-weight: bold;
                  color: #C78861;
                  font-size: 23.44rpx;
                  padding-left: 5.86rpx;
                }
              }
              .fl-list-item {
                margin: 21.98rpx 0 0 21.98rpx;
                .item {
                  padding-bottom: 13.19rpx;
                  image {
                    width: 17.58rpx;
                    height: 17.58rpx;
                    vertical-align: middle;
                  }
                  text {
                    font-size: 17.58rpx;
                    padding-left: 11.72rpx;
                    color: #C78861;
                    vertical-align: middle;
                  }
                }
              }
            }
          }
        }
        .btm {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 18.32rpx;
          .price {
            display: flex;
            align-items: center;
            .price-left {
              margin-right: 25.64rpx;
              display: flex;
              align-items: baseline;
              &>view:nth-child(1) {
                font-size: 16.12rpx;
                color: #F06F6F;
                text {
                  font-size: 32.23rpx;
                  line-height: 23.44rpx;
                  font-weight: bold;
                  padding-right: 13.18rpx;
                }
               
              }       
              &>view:nth-child(2) {
                font-size: 17.58rpx;
                color: #B3B3B3;
                text-decoration: line-through;
              }
            }
          }
          .btm-right {
            display: flex;
            align-items: center;
          }
          .health-consulting {
            font-size: 13.19rpx;
            color: #43C9A7;
            display: flex;
            align-items: center;
            flex-direction: column;
            margin-right: 21.98rpx;
            image {
              width: 38.1rpx;
              height: 38.1rpx;
            }
          }
        }
      }
      .list:last-child {
        margin-bottom: 0rpx;
      }
    }

    .more-production {
      padding: 0 11.72rpx;
      .title {
        text-align: center;
        font-size: 21.98rpx;
        font-weight: bold;
        color: #333;
      }

      .split {
        width: 236.58rpx;
        height: 14.65rpx;
        margin: 5.86rpx auto 10.99rpx auto;
        display: block;
      }

      .production {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;

        .button-group {
          &>view._view {
            width: 161.17rpx;
          }
        }
      }
      .list {
        width: 357.51rpx;
        box-sizing: border-box;
        background-color: #fff;
        border-radius: 14.65rpx;
        color: #666;
        flex: 0 0 357.51rpx;
        margin-bottom: 16.12rpx;
        ._label {
          &>text {
            padding: 3.66rpx 7.32rpx;
            font-size: 17.58rpx;
            font-weight: bold;
            border-radius: 2.93rpx;
            border: 1px solid #77ABFF;
            color: #5DA3F7;
            margin: 0 4.39rpx 7.33rpx 0;
            display: inline-block;
          }
          
        }
        .list-top {
          height: 256.41rpx;
          border-top-left-radius: 14.65rpx;
          border-top-right-radius: 14.65rpx;
          padding: 23.44rpx 17.58rpx 0rpx 17.58rpx;
          box-sizing: border-box;
          background: linear-gradient(360deg, #F6F6FF 0%, #FFFFFF 100%);
          position: relative;
          .img-bg {
            width: 127.47rpx;
            height: 127.47rpx;
            position: absolute;
            right: 0;
            top: 0;
          }
          ._tit {
            font-size: 23.44rpx;
            font-weight: bold;
            display: flex;
            align-items: center;
            color: #333;
            text {
              padding-left: 7.33rpx;
            }
            image {
              width: 48.35rpx;
              height: 48.35rpx;
            }
          }
      
          .desc {
            font-size: 17.58rpx;
            margin: 14.65rpx 0;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            word-break: break-all;
          }
        }
        
        
        .list-btm {
          border-bottom-left-radius: 14.65rpx;
          border-bottom-right-radius: 14.65rpx;
          padding: 17.58rpx;
          border-top: 1px solid;
          border-image: radial-gradient(circle, rgba(119, 120, 250, 1), rgba(119, 120, 250, 0)) 1 1;
          .price {
            margin-bottom: 14.65rpx;
            display: flex;
            align-items: baseline;
            justify-content: center;
            &>view:nth-child(1) {
              
              padding-right: 7.33rpx;
              font-size: 16.12rpx;
              color: #F06F6F;
              text {
                font-size: 27.84rpx;
                font-weight: bold;
              }
            }
            &>view:nth-child(2) {
              color: #B3B3B3;
              font-size: 17.58rpx;
              text-decoration: line-through;
            }
          }
          .buy-flag {
            margin-bottom: 8.79rpx;
            color: #BFBFBF;
            font-size: 13.18rpx;
            text {
              vertical-align: middle;
              padding-left: 5.86rpx;
            }
          }
        }
      }
      .list:nth-child(odd) {
        margin-right: 11.72rpx;
      }
    }
  }
  @media screen and (max-width: 500px) {
    .container {
      max-width: 750rpx;
      font-size: 28rpx;
      .top {
        padding: 20rpx 20rpx 0rpx 14rpx;
        .doctor {
          width: 168rpx;
          height: 232rpx;
        }
        .top-desc {
          margin-left: 10rpx;
          font-size: 28rpx;
          .what {
            width: 352rpx;
            height: 56rpx;
            line-height: 56rpx;
            border-radius: 28rpx;
            font-size: 26rpx;
            margin-top: 26rpx;
            margin-bottom: 38rpx;
            image {
              width: 36rpx;
              height: 36rpx;
              margin-left: 14rpx;
            }
          }
          ._h6 {
            font-size: 36rpx;
            padding-bottom: 16rpx;
          }
        }
      }
      .button-group {
        &>view._view {
          width: 350rpx;
          height: 96rpx;
          font-size: 34rpx;
          ._text {
            line-height: 96rpx;
            font-size: 34rpx;
          }
        }
    
        &>view._view:nth-child(1) {
          border-top-left-radius: 12rpx;
          border-bottom-left-radius: 12rpx;
        }
    
        &>view._view:nth-child(2) {
          border-top-right-radius: 12rpx;
          border-bottom-right-radius: 12rpx;
        }
      }
    
      .recommendation-bit {
        padding: 30rpx 20rpx 35rpx 20rpx;
        box-shadow: 0px 4px 20px 0px rgba(0,0,0,0.07);
        border-radius: 20rpx 20rpx 0px 0px;
        margin: -20rpx 0 60rpx 0;
        .list {
          margin-bottom: 40rpx;
          .title {
            font-size: 40rpx;
            margin-bottom: 22rpx;
            image {
              width: 82rpx;
              height: 82rpx;
              margin-right: 4rpx;
            }
            text {
              max-width: 450rpx;
            }
            .img-recommend {
              width: 106rpx;
              height: 44rpx;
              margin-left: 20rpx;
            }
            .img-buy-flag {
              width: 140rpx;
              height: 44rpx;
            }
          }
          .desc {
            display: flex;
            align-items: flex-start;
            flex-direction: column;
            .desc-left {
              width: 708rpx;
              height: 384rpx;
              flex: 0 0 384rpx;
              background-size: 708rpx 384rpx;
              padding: 32rpx 36rpx;
              font-size: 32rpx;
              .d-l-content {
                line-height: 44rpx;
                max-height: 140rpx;
              }
              ._label {
                font-size: 30rpx;
                margin-top: 30rpx;
                &>text {
                  padding: 16rpx 32rpx;
                  margin: 0 12rpx 12rpx 0;
                  border-radius: 12rpx;
                }
              }
            }
            .desc-mobile {
              width: 390rpx;
              height: 70rpx;
              margin: -15rpx 0rpx;
              flex: 0 0 70;
              align-self: flex-end;
              margin-right: 30rpx;
            }
            .desc-right {
              width: 708rpx;
              height: 280rpx;
              background: url('https://hjom-oss.yimed.cn/static/operateSteps/portalH5/pages/img-fl-2.png') no-repeat;
              background-size: 708rpx 280rpx;
              flex: 0 0 260rpx;
              padding: 80rpx 0 40rpx 0rpx;
              .fl-list {
                flex-direction: row;
                .fl-list-top {
                  display: flex;
                  align-items: center;
                  flex-direction: column;
                  padding: 0 36rpx;
                  image {
                    width: 100rpx;
                    height: 100rpx;
                    margin-bottom: 24rpx;
                  }
                  text {
                    font-size: 36rpx;
                    padding-left: 0rpx;
                  }
                }
                .fl-list-item {
                  margin-top: 0rpx;
                  .item {
                    padding-bottom: 16rpx;
                    image {
                      width: 36rpx;
                      height: 36rpx;
                    }
                    text {
                      font-size: 30rpx;
                      padding-left: 16rpx;
                    }
                  }
                }
              }
            }
          }
          .btm {
            flex-direction: column;
            margin-top: 22rpx;
            .price {
              justify-content: space-between;
              .price-left {
                margin: 22rpx 0rpx 18rpx 0;
                &>view:nth-child(1) {
                  font-size: 34rpx;
                  text {
                    font-size: 60rpx;
                    line-height: 60rpx;
                    padding-right: 18rpx;
                  }
                }        
                &>view:nth-child(2) {
                  font-size: 30rpx;
                }
              }
            }
            .mobile-price {
              width: 100%;
            }
            .health-consulting {
              font-size: 26rpx;
              margin-right: 0rpx;
              flex-direction: row;
              image {
                width: 68rpx;
                height: 68rpx;
                margin-right: 10rpx;
              }
            }
          }
        }
        .list:last-child {
          margin-bottom: 0rpx;
        }
      }
    
      .more-production {
        padding: 0 18rpx;
        .title {
          font-size: 36rpx;
        }
    
        .split {
          width: 326rpx;
          height: 20rpx;
          margin: 8rpx auto 14rpx auto;
        }
    
        .production {
          flex-direction: column;
          .button-group {
            &>view._view {
              width: 316rpx;
            }
          }
        }
        .list {
          width: 712rpx;
          border-radius: 20rpx;
          color: #666;
          flex: 0 0 712rpx;
          margin-bottom: 20rpx;
          ._label {
            &>text {
              padding: 12rpx 22rpx;
              font-size: 30rpx;
              border-radius: 12rpx;
              margin: 0 20rpx 10rpx 0;
            }
            
          }
          .list-top {
            height: 484rpx;
            border-top-left-radius: 20rpx;
            border-top-right-radius: 20rpx;
            padding: 40rpx 40rpx 0rpx 40rpx;
            .img-bg {
              width: 288rpx;
              height: 288rpx;
            }
            ._tit {
              font-size: 40rpx;
              text {
                padding-left: 16rpx;
              }
              image {
                width: 100rpx;
                height: 100rpx;
              }
            }
        
            .desc {
              font-size: 32rpx;
              margin: 14rpx 0 36rpx 0;
              -webkit-line-clamp: 2;
            }
          }
          
          
          .list-btm {
            border-bottom-left-radius: 20rpx;
            border-bottom-right-radius: 20rpx;
            padding: 30rpx;
            .price {
              margin-bottom: 34rpx;
              &>view:nth-child(1) {
                padding-right: 18rpx;
                font-size: 34rpx;
                text {
                  font-size: 60rpx;
                }
              }
              &>view:nth-child(2) {
                font-size: 30rpx;
              }
            }
          }
        }
        .list:nth-child(odd) {
          margin-right: 0rpx;
        }
      }
    }
  }
</style>
