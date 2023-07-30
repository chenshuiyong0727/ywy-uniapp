<template>
  <view>
    
    <nav-bar title='推荐锻炼' :backUrl="specailBack == 1 ? '/pages/index/index' : ''"></nav-bar>
    
    <view class="container">
      <view class="top">
        <view class="_h6">
          <view>已为您生成推荐大脑锻炼方案：</view>
          <view @click="goToPage" v-if="isPad">什么是大脑锻炼？</view>
        </view>
        <view class="desc">我们推荐您进行大脑数字锻炼，更有效的锻炼大脑</view>
        <view v-if="!isPad" class="link" @click="goToPage">什么是大脑锻炼？</view>
        <image class="doctor" :src="imgPrefix + '/static/operateSteps/portalH5/pages/recommend-img-2.png'"></image>
      </view>
      <view class="production">
        <view class="list" v-for="item in productionList" :key="item.goodsId">
          <view class="top-img" v-if="item.businessType == '2210130902263070058'">
            <view class="img">
              <swiper class="swiper-img" circular :indicator-dots="false" :autoplay="true" interval="3000" duration="200">
                <swiper-item v-for="gameItme in gameImgList" :key="gameItme.id">
                  <image :src="imgPrefix + gameItme.imgUrl" mode="aspectFill"></image>
                </swiper-item>
              </swiper>
              
              <image class="shadow" :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-shadow.png'"></image>
            </view>
          </view>
          <view class="top-img top-img-2" v-else>
            <view class="img">
              <image :src="imgPrefix + '/static/operateSteps/icon-micromotion.png'"></image>
            </view>
          </view>
          <view class="list-btm">
            <view class="_tit">{{item.businessType == '2210130902263070058' ? '趣味健脑' : '健脑运动'}}</view>
            <view class="desc-content">
              <view class="desc">
                {{item.detail}}
              </view>
              <view class="_label">
                <text v-for="label in item.labelList" :key="label">{{label}}</text>
              </view>
            </view>
            
            <view class="btn" @click="goPageHandle(item.businessType == '2210130902263070058' ? 1 : 2)">{{item.businessType == '2210130902263070058' ? '立即锻炼' : '立即运动'}}</view>
          </view>
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
  import { navigateTo } from '@/utils/util'
  import {mixin} from '@/mixin/mixin'
  export default {
    mixins:[mixin],
    components: {
      navBar,
      fab
    },
    data() {
      return {
        userInfo: {},
        productionList: [],
        imgPrefix: this.$imgPrefix,
        isPad: this.$pad,
        isWechat: this.$isWechat,
        // 是否是从第三方页面跳回 0=>否 1=>是
        specailBack: 0,
        gameImgList: []
      }
    },
    onLoad(options) {
      if (options.specailBack) {
        this.specailBack = options.specailBack
      }
      this.getExeImgList()
    },
    mounted() {
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
      this.getExeGoods()
      this.getMicGoods()
      
    },
    methods: {
      getExeGoods() {
        this.requestGoodsList(4)
      },
      getMicGoods() {
        this.requestGoodsList(5)
      },
      requestGoodsList(type) {
        this.$request({
          url: '/gw/h5/v1/front/goods/goodsList',
          method: 'post',
          data: {
            userId: this.userInfo.userId,
            type,
            token: this.userInfo.token
          }
        }).then(res => {
          if (res.status === 1000) {
            if (res.data) {
              this.productionList = this.productionList.concat(res.data)
            }
            console.log('this.productionList', res.data)
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      goPageHandle(type) {
        getApp().loginStatus().then(() => {
          this.$request({
            url: '/gw/h5/v1/front/member/countPlanByUserId',
            method: 'post',
            data: {
              recordType: type,
              token: this.userInfo.token
            }
          }, false).then(res => {
            if (res.status === 1000) {
              if (res.data == 0) {
                // 首次进入，跳转到开启页面
                if (type == 1) {
                  navigateTo('/pages/exercise/begin')
                } else {
                  navigateTo('/pages/micromotion/begin')
                }
              } else {
                if (type == 1) {
                  navigateTo('/pages/exercise/list')
                } else {
                  navigateTo('/pages/micromotion/list')
                }
              }
            } else {
              uni.showToast({
                title: res.msg,
                icon: 'none',
                duration: 2000
              })
            }
          })
        })
      },
      getExeImgList() {
        this.$request({
          url: '/gw/h5/v1/front/index/trainingList'
        }, false).then(res => {
          if (res.status === 1000) {
            this.gameImgList = res.data ? res.data : []
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      goToPage() {
        navigateTo('/pages/exercise/begin?showBtm=false')
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
    overflow: hidden;
    margin: 0 auto;
    padding: 0rpx 11.72rpx 16.11rpx 11.72rpx;
    .top {
      padding: 10.25rpx 14.65rpx 14.65rpx 56.4rpx;
      background-color: #fff;
      border-radius: 14.65rpx;
      position: relative;
      margin-top: 17.58rpx;
    
      .doctor {
        width: 58.6rpx;
        height: 80.57rpx;
        position: absolute;
        bottom: 0;
        left: -7.32rpx;
      }
    
      ._h6 {
        font-size: 17.58rpx;
        font-weight: bold;
        padding-bottom: 7.32rpx;
        display: flex;
        align-items: center;
    
        &>view:nth-child(2) {
          color: #43C9A7;
          text-decoration: underline;
          font-size: 11.72rpx;
          font-weight: normal;
        }
      }
    
      .desc {
        font-size: 13.18rpx;
        color: #666;
      }
    }
    
    
    
    .production {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-top: 17.58rpx;
    }
    .list {
      
      // .top-img {
      //   width: 100%;
      //   height: 80.57rpx;
      //   border-top-left-radius: 10.25rpx;
      //   border-top-right-radius: 10.25rpx;
      //   image {
      //     width: 100%;
      //     height: 100%;
      //   }
      // }
      width: 357.51rpx;
      padding: 14.65rpx 17.58rpx 16.12rpx 17.58rpx;
      box-sizing: border-box;
      background-color: #fff;
      border-radius: 10.25rpx;
      .top-img {
        margin-bottom: 11.72rpx;
        .img {
          position: relative;
          width: 271.06rpx;
          height: 112.82rpx;
          image {
            width: 271.06rpx;
            height: 112.82rpx;
            border-radius: 14.65rpx;
            
          }
          .shadow {
            position: absolute;
            top: -2.2rpx;
            left: 95.24rpx;
            width: 238.83rpx;
            height: 117.22rpx;
          }
          .swiper-img {
            width: 271.06rpx;
            height: 112.82rpx;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 2;
            image {
              margin-left: 0px;
            }
          }
        }
      }
      .top-img-2 {
        .img {
          width: 329.67rpx;
          image:nth-child(1) {
            width: 329.67rpx;
          }
        }
      }
      .list-btm {
      }
      ._tit {
        font-size: 17.58rpx;
        font-weight: bold;
      }
      
      .desc-content {
        min-height: 91.58rpx;
      }
      
      .desc {
        font-size: 11.72rpx;
        line-height: 19.78rpx;
        color: #999;
        margin: 8.79rpx 0;
      }
      
      ._label {
        &>text {
          padding: 3.66rpx 7.32rpx;
          font-size: 11.72rpx;
          border-radius: 2.93rpx;
          background-color: #FFF6EB;
          color: #DF5C1D;
          margin-right: 4.39rpx;
        }
      }
      
      .btn {
        width: 215.34rpx;
        height: 35.16rpx;
        text-align: center;
        line-height: 35.16rpx;
        color: #fff;
        background-color: #43C9A7;
        border-radius: 7.32rpx;
        font-size: 13.18rpx;
        margin: 14.65rpx auto 0 auto;
      }
    }
  }
  @media screen and (max-width: 500px) {
    .container {
      max-width: 750rpx;
      padding: 0rpx 32rpx 32rpx 32rpx;
      .top {
        padding: 20rpx 20rpx 20rpx 164rpx;
        border-radius: 20rpx;
        margin-top: 32rpx;
      
        .doctor {
          width: 144rpx;
          height: 198rpx;
          left: 0rpx;
        }
      
        ._h6 {
          font-size: 30rpx;
          padding-bottom: 10rpx;
        }
      
        .desc {
          font-size: 26rpx;
          color: #999;
          padding-bottom: 18rpx;
        }
        .link {
          color: #43C9A7;
          text-decoration: underline;
          font-size: 26rpx;
          font-weight: normal;
        }
      }
      
      
      
      .production {
        flex-direction: column;
        margin-top: 32rpx;
      }
      .list {
        width: 686rpx;
        padding: 36rpx 26rpx;
        margin-bottom: 32rpx;
        border-radius: 20rpx;
        .top-img {
          margin-bottom: 30rpx;
          .img {
            position: relative;
            width: 518rpx;
            height: 216rpx;
            flex: 0 0 518rpx;
            image {
              width: 518rpx;
              height: 216rpx;
              border-radius: 20rpx;
              
            }
            .shadow {
              position: absolute;
              top: -2px;
              left: 176rpx;
              width: 468rpx;
              height: 224rpx;
            }
            .swiper-img {
              width: 518rpx;
              height: 224rpx;
              position: absolute;
              top: 0;
              left: 0;
              z-index: 2;
              image {
                margin-left: 0px;
              }
            }
          }
        }
        .top-img-2 {
          .img {
            width: 100%;
            image:nth-child(1) {
              width: 100%;
            }
          }
        }
        .list-btm {
          
        }
        ._tit {
          font-size: 40rpx;
        }
        
        .desc-content {
          min-height: 190rpx;
        }
        
        .desc {
          font-size: 28rpx;
          line-height: 40rpx;
          margin: 24rpx 0;
        }
        
        ._label {
          &>text {
            padding: 6rpx 12rpx;
            font-size: 28rpx;
            border-radius: 8rpx;
            margin-right: 12rpx;
          }
        }
        
        .btn {
          width: 636rpx;
          height: 96rpx;
          line-height: 96rpx;
          border-radius: 12rpx;
          font-size: 34rpx;
          margin: 24rpx auto 0 auto;
        }
      }
    }
  }
</style>
