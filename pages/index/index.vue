<template>
  <view>
    <!-- #ifndef H5 -->
    <nav-bar title='和家健脑' :isShowRightIcon="false" :isShowLeftIcon="false"></nav-bar>
    <!-- #endif -->
    <view class="container">
      <view class="evalution-wrap">
        <view class="evalution-wrap-left">
          <view @click="goFastSieve">
            <view class="title">认知<text class="text-style">障碍筛查</text></view>
            <view class="content">
              <view class="img"><image :src="imgPrefix + '/static/operateSteps/icon-pg.gif'"></image></view>
              <view class="content-right">
                <view class="p1">已筛查<text>{{fastSieveNum}}</text></view>
                <view class="button" v-if="isPad">
                  <text>立即筛查</text>
                  <image :src="imgPrefix +'/static/operateSteps/portalH5/pages/index-img-7.png'"></image>
                </view>
              </view>
            </view>
            <view class="button" v-if="!isPad">
              <text>立即筛查</text>
              <image :src="imgPrefix +'/static/operateSteps/portalH5/pages/index-img-7.png'"></image>
            </view>
          </view>
          <view class="dh-tip-wrap" v-if="isShowDhTip">
            <view class="dh-content">
              <view>您已完成筛查，立即</view>
              <view @click.stop="goDhHandle">兑换报告</view>
            </view>
            <view class="dh-close" @click.stop="DhCloseHandle">
              <image :src="imgPrefix +'/static/operateSteps/portalH5/pages/close-new.png'"></image>
            </view>
          </view>
        </view>
        <view class="evalution-wrap-right">
          <view class="item" @click="goEvalution">
            <view class="item-left">
              <view class="title">认知评估</view>
              <view class="button">
                <text>去评估</text>
                <image :src="imgPrefix +'/static/operateSteps/portalH5/pages/index-img-8.png'"></image>
              </view>
            </view>
            <image class="img" :src="imgPrefix +'/static/operateSteps/portalH5/pages/index-img-2.png'"></image>
          </view>
          <view class="item item2" @click="naveToPageByLogin('/pages/consulting-service/index')">
            <view class="item-left">
              <view class="title">咨询专家</view>
              <view class="button">
                <text>去咨询</text>
                <image :src="imgPrefix +'/static/operateSteps/portalH5/pages/index-img-10.png'"></image>
              </view>
            </view>
            <image class="img" :src="imgPrefix +'/static/operateSteps/portalH5/pages/index-img-3.png'"></image>
          </view>
        </view>
      </view>
      <view class="train-wrap" @click="goCognitiveTraining">
        <view class="train-wrap-left">
          <view class="title">认知症<text>数字疗法</text></view>
          <view class="p1">药品监管局已认证</view>
          <view class="button" v-if="isPad">
            <text>立即训练</text>
            <image :src="imgPrefix +'/static/operateSteps/portalH5/pages/index-img-9.png'"></image>
          </view>
        </view>
        <view class="train-wrap-right">
          <image class="img-1" :src="isPad ? imgPrefix + '/static/operateSteps/portalH5/pages/index-img-pad-4.png' : imgPrefix + '/static/operateSteps/portalH5/pages/index-img-mobile-4.png'"></image>
        </view>
        <view class="button" v-if="!isPad">
          <text>立即训练</text>
          <image :src="imgPrefix +'/static/operateSteps/portalH5/pages/index-img-9.png'"></image>
        </view>
      </view>
      <view class="game-wrap">
        <view class="title"><text>益脑锻炼</text><text>好玩又健脑，有趣又益脑</text></view>
        <view class="content">
          <view class="item item-game" @click="goPageHandle(1)">
            <view class="item-left">
              <swiper class="swiper-img" circular :indicator-dots="false" :autoplay="true" interval="3000" duration="200">
                <swiper-item v-for="item in gameImgList" :key="item.frontId">
                  <image :src="imgPrefix + item.imgUrl" mode="aspectFill"></image>
                </swiper-item>
              </swiper>
              <view class="bg-shadow"></view>
            </view>
            <view class="item-right">
              <view class="title">趣味健脑</view>
              <view class="desc">
                <text>去锻炼</text>
                <image :src="imgPrefix +'/static/operateSteps/portalH5/pages/index-img-9.png'"></image>
              </view>
            </view>
          </view>
          <view class="item item-exercise" @click="goPageHandle(2)">
            <view class="item-left">
              <image class="img-exercise" :src="imgPrefix +'/static/operateSteps/portalH5/pages/index-img-6.png'"></image>
            </view>
            <view class="item-right">
              <view class="title">健脑运动</view>
              <view class="desc">
                <text>去运动</text>
                <image :src="imgPrefix +'/static/operateSteps/portalH5/pages/index-img-9.png'"></image>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <swiper class="swiper" circular :indicator-dots="false" :autoplay="true" v-if="bannerList.length">
        <swiper-item v-for="item in bannerList" :key="item.id" @click="goToPage(item)">
          <image :src="imgPrefix + item.imgUrl"></image>
        </swiper-item>
      </swiper>

      
      <view class="news-wrap">
        <view class="title">大脑科普</view>
        <view class="content">
          <view :class="['item']" v-for="(item, index) in articleList" :key="item.id" @click="goArticleDetail(item.id, item.title)">
            <image :src="imgPrefix + item.imgUrl"></image>
            <view class="detail">
              {{item.title}}
            </view>
          </view>
        </view>
      </view>
      <!-- #ifdef H5 -->
      <view class="link" @click="goLink">闽ICP备2023002903号</view>
      <!-- #endif -->
      <!-- 绑定推荐码后的弹窗 -->
      <view class="popupWrap" v-if="isShowBindedPopup">
        <view class="popup">
					<image 
						src="https://natt.yimed.cn:11902/static/operateSteps/close11-15.png" 
						class="close"
						@click.stop="isShowBindedPopup = false">
					</image>
					<image 
						src="https://natt.yimed.cn:11902/static/operateSteps/experienceNowBtn11-15.png" 
						class="experienceNowBtn"
						@click.stop="isShowBindedPopup = false;judgeLogin()">
					</image>
        </view>
      </view>
      <view class="box-alert" v-if="isShowBoxAlert">
        <view class="content">
          <view @click="closeBoxAlert"><uni-icons class="close" type="closeempty" size="25"></uni-icons></view>
          <view>参与抽奖，请先完成认知障碍筛查！</view>
          <view class="btn" @click="goFastSieve">立即评估</view>
        </view>
      </view>
      <!--侧边栏-->
      <fab v-if="isShowFab" ref="fab" :isShowBackHome="false" :isOpenFabMenu="isPad ? true : false"></fab>
      <!--end 侧边栏-->
    </view>
  </view>

</template>

<script>
  import { navigateTo, getUserInfoGlobal, getQueryString } from '@/utils/util'
  import navBar from '@/components/nav-bar'
  import fab from '@/components/fab'
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
        isPad: this.$pad,
        imgPrefix: this.$imgPrefix,
        articleList: [],
        scrollTop: 10,
        pageSize: 10,
        pageNum: 1,
        articlTotalCount: 0,
        gameImgList: [
          {imgUrl: '/static/operateSteps/portalH5/game-poster/game1.png', fronId: 1},
          {imgUrl: '/static/operateSteps/portalH5/game-poster/game2.png', fronId: 2},
          {imgUrl: '/static/operateSteps/portalH5/game-poster/game3.png', fronId: 3}
        ],
        bannerList: [],
        btnDescribeList: [],
        btnDescribeListMobile: [],
        isShowGuidTip1: false,
        fastSieveNum: 0,
        // isShowGuidTip2: false,
        isShowBoxAlert: false,
				crossLoad: false, // 是否触发onload方法
				isShowBindedPopup: false, // 是否显示绑定推荐码后的提示弹窗
        isShowDhTip: false,
        // 是否惠夏宝用户
        isHuiXiaUser: false,
        // 惠夏宝用户数据
        huiXiaUserData: {},
        evaluationData: {}
      }
    },
    onLoad(param) {
    	this.param = param || {}
    	this.crossLoad = true
      // #ifdef H5
      if (!param.promoteCode && getQueryString(window.location.href, 'promoteCode')) {
        this.param.promoteCode = getQueryString(window.location.href, 'promoteCode').split('#/')[0]
      }
      // #endif
      this.getArticleList()
      //this.getExeImgList()
      this.getBannerList()
      // this.queryBtnDescribe()
      this.queryFastSieveNum()
      
    },
    async onShow() {
      
			if (!this.crossLoad) { // 第二次进来清除掉参数
				this.param = {}
			} else {
				this.crossLoad = false
			}
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
			await getUserInfoGlobal()
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
			this.promoteCodeHandle() // 推荐码处理逻辑
      
      if (this.userInfo && JSON.stringify(this.userInfo) != '{}') {
        // 是否惠夏宝用户
        this.queryHuiXiaScreening()
        // 已登录
        let hasplatform = uni.getStorageSync('hasplatform')
        if (!hasplatform) {
          let systemInfo = uni.getSystemInfoSync()
          this.$request({
            url: '/gw/h5/v1/front/user/userDevice',
            method: 'post',
            data: {
              token: this.userInfo.token,
              deviceBrand: systemInfo.brand,
              deviceModel: systemInfo.model,
              osName: systemInfo.osName
            }
          }, false).then(res => {
            if (res.status === 1000) {
              uni.setStorageSync('hasplatform', true)
              console.log('系统信息获取成功')
            }
          })
        }
      }
    },
    methods: {
      naveToPage(url) {
        navigateTo(url)
      },
      naveToPageByLogin(url) {
        // 跳转之前判断是否登录
        getApp().loginStatus().then(() => {
          navigateTo(url)
        })
      },
			// 判断是否登录没登录的话要跳转登录
			judgeLogin () {
				getApp().loginStatus()
			},
      queryFastSieveNum() {
        this.$request({
          url: '/gw/h5/v1/front/fastSieveNum',
          method: 'get'
        }, false).then(res => {
          if (res.status === 1000) {
            this.fastSieveNum = res.data ? res.data : 0
          }
        })
      },
      DhCloseHandle() {
        this.isShowDhTip = false
      },
      goDhHandle() {
        // 解锁报告
        if (this.evaluationData.orderNum == 1) {
          // 仅有一个订单，跳转筛查解锁页
          navigateTo('/pages/evaluation/lock-report?payOrderId='+this.evaluationData.lastFastSieve.payOrderId+'&autoShowBox=1')
        } else {
          // 多个订单，跳转至筛查报告列表
          navigateTo('/pages/evaluation/evaluation-list')
        }
      },
      queryHuiXiaScreening() {
        this.$request({
          url: '/gw/h5/v1/front/user/huiXiaScreeningReportStatus',
          method: 'get',
          data: {
            token: this.userInfo.token
          }
        }, false).then(res => {
          if (res.status === 1000) {
            if (res.data.isHuiXiaUser == 1) {
              this.isHuiXiaUser = true
              this.huiXiaUserData = res.data
              if (res.data.isHuiXiaUser == 1 && res.data.allTimes - res.data.useTimes > 0) {
                // 惠夏宝用户，并且可兑换次数大于0
                this.$request({
                  url: '/gw/h5/v1/front/goods/queryFastSieveOverview',
                  method: 'post',
                  data: {
                    token: this.userInfo.token,
                    userId: this.userInfo.userId
                  }
                }, false).then(res => {
                  if (res.status === 1000) {
                    if (res.data.orderNum > 0) {
                      // 有已完成的报告
                      this.isShowDhTip = true
                    }
                    this.evaluationData = res.data
                  } else {
                    uni.showToast({
                      title: res.msg,
                      icon: 'none',
                      duration: 2000
                    })
                  }
                })
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
      },
      // queryBtnDescribe() {
      //   this.$request({
      //     url: '/gw/h5/v1/front/queryBtnDescribe',
      //     method: 'get'
      //   }, false).then(res => {
      //     if (res.status === 1000) {
      //       //this.btnDescribeList = res.data
      //       if (this.$pad) {
      //         for (let i = 0; i < res.data.length; i++) {
      //           let data = {
      //             fieldName: res.data[i].fieldName,
      //             fieldValue: res.data[i].fieldValue.replace(/\|/g, '')
      //           }
      //           this.btnDescribeList.push(data)
      //         }
      //       } else {
      //         for (let i = 0; i < res.data.length; i++) {
      //           let data = {
      //             fieldName: res.data[i].fieldName,
      //             fieldValue: res.data[i].fieldValue.split('|')
      //           }
      //           this.btnDescribeListMobile.push(data)
      //         }
      //       }
      //     } else {
      //       uni.showToast({
      //         title: res.msg,
      //         icon: 'none',
      //         duration: 2000
      //       })
            
      //     }
      //   })
      // },
			// 推荐码处理逻辑 
			promoteCodeHandle () {
				let promoteInfo = uni.getStorageSync('promoteInfo') || {}
				if (this.param.promoteCode) {
					promoteInfo.promoteCode = this.param.promoteCode
				}
				// 参数和缓存都没有推荐码信息的话，直接返回
				if (JSON.stringify(promoteInfo) === '{}') {
					return
				}
				uni.setStorageSync('promoteInfo', promoteInfo) // 缓存更新下，有可能参数里面有新的promoteCode
				if (JSON.stringify(this.userInfo) === '{}') { // 未登录时直接跳转登录页面
					if (this.param.promoteCode) { // 地址参数有推荐码，代表第一次进来，则弹窗
						// this.showBindedPopup()
					}
				} else if (this.userInfo.info?.promoteCode) { // 已登录且已绑定码
					uni.removeStorageSync('promoteInfo')
				} else { // 已登录，未绑定推荐码
					if (this.param.promoteCode) { // 地址参数有推荐码，代表第一次进来，则弹窗
						this.updatePromoteCode({'showPop': true})
					} else { // 后面进来不弹窗
						this.updatePromoteCode()
					}
				}
			},
			// 绑定推荐码接口
			updatePromoteCode (param = {}) {
				let promoteInfo = uni.getStorageSync('promoteInfo') || {}
				let data = {
					promoteCode: promoteInfo.promoteCode,
					token: this.userInfo.token,
				}
				let root = this
				this.$request({
					url: '/gw/h5/v1/front/user/updatePromoteCode',
					method: 'put',
					data: data
				}).then((res) => {
					uni.removeStorageSync('promoteInfo')
					if (res.status === 1000) {
						if (param.showPop) { // 是否显示弹窗
							// root.showBindedPopup()
						}
						getUserInfoGlobal()
					} else {
						uni.removeStorageSync('promoteInfo')
					}
				})
			},
      
			// 显示绑定推荐码后的弹窗
			showBindedPopup () {
				this.isShowBindedPopup = false
			},
      goPageHandle(type) {
        if (type == 1) {
          navigateTo('/pages/exercise/begin')
        } else {
          navigateTo('/pages/micromotion/begin')
        }
      },
      goFastSieve() {
        getApp().loginStatus().then(() => {
          navigateTo('/pages/evaluation/explain')
          this.isShowBoxAlert = false
        })
      },
      goCognitiveTraining() {
        navigateTo('/pages/cognitive-training/guid?pageFrom=index')
      },
      getArticleList() {
        this.$request({
          url: '/gw/h5/v1/front/brainScience',
          data: {
            pageSize: this.pageSize,
            pageNum: this.pageNum
          }
        }, false).then(res => {
          if (res.status === 1000) {
            // this.articleList = res.data.list ? res.data.list : []
            this.articleList = this.articleList.concat(res.data.list ? res.data.list : [])
            this.articlTotalCount = res.data.pageInfo ? res.data.pageInfo.totalCount : 0
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      goArticleDetail(id, title) {
        navigateTo(`/pages/article/detail?id=${id}&title=${title}`)
      },
      goLink() {
        window.location.href = 'https://beian.miit.gov.cn/'
      },
      // getExeImgList() {
      //   this.$request({
      //     url: '/gw/h5/v1/front/index/trainingList'
      //   }, false).then(res => {
      //     if (res.status === 1000) {
      //       this.gameImgList = res.data ? res.data : []
      //     } else {
      //       uni.showToast({
      //         title: res.msg,
      //         icon: 'none',
      //         duration: 2000
      //       })
      //     }
      //   })
      // },
      getBannerList() {
        this.$request({
          url: '/gw/h5/v1/front/index/bannerList'
        }, false).then(res => {
          if (res.status === 1000) {
            this.bannerList = res.data ? res.data : []
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      goToPage(item) {
        getApp().loginStatus().then((res) => {
          let param = ''
          let link = item.jumpUrl
          // #ifdef H5
          if (window.location.href.indexOf('?') > -1) {
            param = '?' + window.location.href.split('?')[1] + '&userId=' + this.userInfo.userId
          } else {
            param = '?userId=' + this.userInfo.userId
          }
          // #endif
          
          // #ifdef APP-PLUS
          let routes = getCurrentPages()
          let curRoute = routes[routes.length - 1].route
          let curParam = routes[routes.length - 1].options || routes[routes.length - 1].$route.query
          if (curParam && JSON.stringify(curParam) != '{}') {
            for (let key in curParam) {
              param += '&' + key + '=' + curParam[key]
            }
            param += '&userId=' + this.userInfo.userId
          } else {
            param = '?userId=' + this.userInfo.userId
          }
          // #endif
          link = link + param
          if (item.jumpUrl.indexOf('http') > -1) {
            // 为http链接，跳转到H5页面需要用到webview
            navigateTo('/pages/web-view/web-view', {
              link: link
            })
          } else {
            // 跳门户页面
            navigateTo(item.jumpUrl)
          }
        })
      },
      onReachBottom() {
        if (Math.ceil(this.articlTotalCount / this.pageSize) > this.pageNum) {
          // 有下一页
          // this.pageNum++
          this.pageNum++
          this.getArticleList()
        }
      },
      // #ifdef APP-PLUS
      onPullDownRefresh() {
        this.articleList = []
        this.articlTotalCount = 0
        this.pageSize = 10
        this.pageNum = 1
        this.getArticleList()
        // this.getExeImgList()
        this.getBannerList()
        // this.queryBtnDescribe()
        setTimeout(() => {
         uni.stopPullDownRefresh()  
        }, 1500)
      },
      // #endif
      
      queryMyOrderNum() {
        return new Promise((resolve) => {
          this.$request({
            url: '/gw/h5/v1/front/user/queryMyOrderNum',
            method: 'post',
            data: {
              token: this.userInfo.token,
              userId: this.userInfo.userId
            }
          }, false).then(res => {
            if (res.status === 1000) {
              // this.orderNum = res.data ? res.data : {},
              if (res.data) {
                resolve(res.data)
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
      closeBoxAlert() {
        this.isShowBoxAlert = false
      },
      goEvalution() {
        // 走认知评估
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
            if (goods.payStatus == 1) {
              // 已付款，跳第三方页面
              this.goToEvalution()
            } else {
              navigateTo(`/pages/evaluation/artificial?goodsId=${goods.goodsId}&amount=${goods.amount}&originalAmount=${goods.originalAmount}&addressFlag=${goods.addressFlag}`)
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
      goToEvalution() {
        getApp().goAppointmentDetail({
          token: this.userInfo.token,
          type: 2,
          cameraPermission: true
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    overflow-x: hidden;
    width: 750rpx;
    max-width: 750rpx;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 20rpx 13.75rpx 51.27rpx 13.75rpx;
    background-image: linear-gradient(180deg, #E6F9F6 0%, #F3F4F5 100%) no-repeat;
    background-size: 750rpx 702.5rpx;
    background-color: #F3F8F8;
    
    .evalution-wrap {
      display: flex;
      .evalution-wrap-left {
        width: 417.5rpx;
        height: 200rpx;
        background-color: #fff;
        border-radius: 12.5rpx;
        margin-right: 12.5rpx;
        padding: 18.75rpx 0 0 18.75rpx;
        box-sizing: border-box;
        position: relative;
        .title {
          font-size: 31.25rpx;
          font-weight: 600;
          .text-style {
            font-size: 32.5rpx;
            color: #2A87F5;
          }
        }
        .content {
          display: flex;
          align-items: center;
          margin-top: 5rpx;
          .img {
            width: 120rpx;
            height: 120rpx;
            margin-right: 8.75rpx;
            image {
              width: 100%;
              height: 100%;
            }
          }
          .content-right {
            .p1 {
              font-size: 25rpx;
              color: #999999;
              padding-left: 6.25rpx;
              text {
                font-size: 27.5rpx;
                color: #2A87F5;
                font-weight: bold;
                padding-left: 6.25rpx;
              }
            }
          }
        }
        
        .button {
          width: 150rpx;
          height: 45rpx;
          line-height: 45rpx;
          font-size: 21.25rpx;
          color: #0D72FF;
          background-color: #DCEBFF;
          border-radius: 22.5rpx;
          margin-top: 18.75rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          image {
            width: 12.5rpx;
            height: 12.5rpx;
            margin-left: 2.5rpx;
          }
        }
        .dh-tip-wrap {
          position: absolute;
          left: 148.75rpx;
          bottom: -50rpx;
          z-index: 99;
          display: flex;
          align-items: center;
          .dh-content {
            padding: 15rpx 11.25rpx 16.25rpx 16.25rpx;
            background-color: #FFE0B5;
            border-radius: 10rpx;
            box-sizing: border-box;
            box-shadow: 0px 2px 15px 0px rgba(86,69,45,0.14);
            width: 290rpx;
            display: flex;
            align-items: center;
            font-size: 18.75rpx;
            color: #653F0B;
            font-weight: 400;
            position: relative;
            &>view:nth-child(2) {
              width: 88.75rpx;
              height: 37.5rpx;
              text-align: center;
              line-height: 37.5rpx;
              border-radius: 5rpx;
              background-color: #F0683A;
              font-size: 20rpx;
              color: #fff;
              margin-left: 5rpx;
            }
            &::after {
              position: absolute;
              top: -10rpx;
              left: 60rpx;
              content: '';
              width: 0;
              height: 0;
              border-left: 15rpx solid transparent;  
              border-right: 15rpx solid transparent;  
              border-bottom: 15rpx solid #FFE0B5; 
            }
          }
          .dh-close {
            width: 132.5rpx;
            height: 40rpx;
            image {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .evalution-wrap-right {
        .item {
          width: 292.5rpx;
          height: 93.75rpx;
          padding: 12.5rpx 0 12.5rpx 35rpx;
          box-sizing: border-box;
          background-color: #fff;
          border-radius: 12.5rpx;
          display: flex;
          align-items: center;
          .item-left {
            margin-right: 37.5rpx;
            text-align: right;
            .title {
              font-size: 27.5rpx;
              line-height: 37.5rpx;
              margin-bottom: 6.25rpx;
            }
            .button {
              font-size: 17.5rpx;
              color: #45BBDB;
              display: flex;
              align-items: center;
              justify-content: flex-end;
              image {
                width: 12.5rpx;
                height: 12.5rpx;
              }
            }
          }
          .img {
            width: 62.5rpx;
            height: 62.5rpx;
          }
        }
        .item2 {
          margin-top: 12.5rpx;
          .item-left {
            .button {
              color: #5DCFB1;
            }
          }
        }
      }
    }
    .train-wrap {
      height: 200rpx;
      padding: 27.5rpx 27.5rpx 22.5rpx 27.5rpx;
      background-color: #fff;
      border-radius: 12.5rpx;
      box-sizing: border-box;
      margin-top: 12.5rpx;
      display: flex;
      align-items: center;
      .train-wrap-left {
        margin-right: 52.5rpx;
        .title {
          font-size: 32.5rpx;
          font-weight: bold;
          line-height: 46.25rpx;
          padding-bottom: 6.25rpx;
          text {
            color: #259779;
          }
        }
        .p1 {
          font-size: 17.5rpx;
          color: #E0B04A;
          padding-bottom: 25rpx;
        }
        
      }
      .train-wrap-right {
        .img-1 {
          width: 353.75rpx;
          height: 200rpx;
        }
      }
      .button {
        width: 167.5rpx;
        height: 47.5rpx;
        color: #18A480;
        font-size: 21.25rpx;
        border-radius: 23.75rpx;
        background-color: #E1F7F1;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        image {
          width: 12.5rpx;
          height: 12.5rpx;
          margin-left: 2.5rpx;
        }
      }
    }
    .game-wrap {
      height: 193.75rpx;
      background-color: #fff;
      border-radius: 12.5rpx;
      margin-top: 20rpx;
      padding: 20rpx 27.5rpx 27.5rpx 27.5rpx;
      box-sizing: border-box;
      .title {
        display: flex;
        align-items: flex-end;
        font-size: 20rpx;
        color: #666666;
        text:nth-child(1) {
          font-size: 22.5rpx;
          color: #333333;
          padding-right: 10rpx;
        }
      }
      .content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 15rpx;
        .item {
          background-color: #EFFAF7;
          width: 327.5rpx;
          height: 100rpx;
          border-radius: 12.5rpx;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          .item-left {
            position: relative;
          }
          .item-right {
            margin-left: 18.75rpx;
            .title {
              font-size: 25rpx;
              font-weight: bold;
              padding-bottom: 2.5rpx;
              color: #333;
            }
            .desc {
              display: flex;
              align-items: center;
              font-size: 17.5rpx;
              color: #2BAB8A;
              image {
                width: 12.5rpx;
                height: 12.5rpx;
              }
            }
          }
        }
        .item-game {
          padding: 12.5rpx 0 12.5rpx 25rpx;
          .item-left {
            .swiper-img {
              width: 75rpx;
              height: 75rpx;
              position: relative;
              z-index: 3;
              image {
                width: 75rpx;
                height: 75rpx;
                border-radius: 5rpx;
              }
            }
            .bg-shadow {
              width: 65rpx;
              height: 65rpx;
              background-color: #B7B7B7;
              position: absolute;
              top: 50%;
              right: -6.25rpx;
              transform: translateY(-50%);
              border-radius: 5rpx;
            }
          }
        }
        .item-exercise {
          padding: 12.5rpx 0 7.5rpx 18.75rpx;
          .item-left {
            .img-exercise {
              width: 100rpx;
              height: 100rpx;
            }
          }
        }
      }
    }
    .news-wrap {
      margin-top: 18.75rpx;
      border-radius: 12.5rpx;
      background-color: #fff;
      padding: 13.75rpx 27.5rpx 26.25rpx 27.5rpx;
      box-sizing: border-box;
      .title {
        font-size: 22.5rpx;
        margin-bottom: 12.5rpx;
      }
      .content {
        .item {
          padding: 26.25rpx 0;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #E5E5E5;
          image {
            width: 112.5rpx;
            height: 82.5rpx;
            border-radius: 7.5rpx;
            margin-right: 25rpx;
          }
          .detail {
            max-width: 531.25rpx;
            font-size: 22.5rpx;
            overflow:hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            -o-text-overflow:ellipsis;
          }
        }
        .item:last-child {
          border-bottom: 1px solid #fff;
        }
      }
    }
    
    .swiper {
      width: 100%;
      height: 131.87rpx;
      margin-top: 20rpx;
      image {
        width: 100%;
        height: 100%;
        border-radius: 14.65rpx;
      }
    }

    .link {
      width: 750.02rpx;
      max-width: 750.02rpx;
      margin-left: -11.72rpx;
      text-align: center;
      font-size: 10.25rpx;
      padding: 30rpx 0;
      color: #999;
    }
    
    .box-alert {
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.6);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 99;
      .content {
        width: 347.69rpx;
        padding: 28.32rpx 18.32rpx 28.32rpx 18.32rpx;
        box-sizing: border-box;
        border-radius: 14.65rpx;
        background-color: #fff;
        font-size: 17.58rpx;
        text-align: center;
        &>view:nth-child(1) {
          width: 100%;
          text-align: right;
        }
        .btn {
          width: 271.06rpx;
          height: 43.96rpx;
          background-color: #502459;
          border-radius: 7.33rpx;
          color: #fff;
          text-align: center;
          line-height: 43.96rpx;
					margin: auto;
          margin-top: 27.84rpx;
        }
        .close {
					position: relative;
          padding: 10rpx;
          top: -10rpx;
        }
      }
    }
  }
  @media screen and (max-width: 500px) {
    .container {
      padding: 22rpx 22rpx 100rpx 22rpx;
      background-size: 750rpx 764rpx;
      .evalution-wrap {
        .evalution-wrap-left {
          width: 398rpx;
          height: 380rpx;
          border-radius: 20rpx;
          margin-right: 16rpx;
          padding: 30rpx 16rpx 0 26rpx;
          .title {
            padding-left: 0rpx;
            font-size: 40rpx;
            .text-style {
              font-size: 40rpx;
            }
          }
          .content {
            margin-top: 20rpx;
            
            .img {
              width: 150rpx;
              height: 150rpx;
              margin-right: 0rpx;
            }
            .content-right {
              .p1 {
                font-size: 30rpx;
                padding: 38rpx 0 0 6rpx;
                text {
                  font-size: 32rpx;
                  padding-left: 4rpx;
                  display: block;
                  margin-top: 20rpx;
                }
              }
              
            }
          }
          .button {
            width: 346rpx;
            height: 72rpx;
            line-height: 72rpx;
            font-size: 34rpx;
            border-radius: 36rpx;
            margin: 20rpx auto 0 auto;
            
            image {
              width: 20rpx;
              height: 20rpx;
              margin-left: 4rpx;
            }
          }
          .dh-tip-wrap {
            left: 50rpx;
            bottom: -70rpx;
            .dh-content {
              padding: 14rpx 18rpx 14rpx 26rpx;
              border-radius: 10rpx;
              box-shadow: 0px 4px 30px 0px rgba(86,69,45,0.14);
              width: 464rpx;
              font-size: 30rpx;
              &>view:nth-child(2) {
                width: 142rpx;
                height: 60rpx;
                line-height: 60rpx;
                border-radius: 8rpx;
                font-size: 32rpx;
                margin-left: 8rpx;
              }
              &::after {
                position: absolute;
                top: -10rpx;
                left: 120rpx;
                content: '';
                width: 0;
                height: 0;
                border-left: 20rpx solid transparent;  
                border-right: 20rpx solid transparent;  
                border-bottom: 20rpx solid #FFE0B5; 
              }
            }
            .dh-close {
              width: 106rpx;
              height: 32rpx;
            }
          }
        }
        .evalution-wrap-right {
          .item {
            width: 295rpx;
            height: 182rpx;
            padding: 40rpx 24rpx;
            border-radius: 20rpx;
            justify-content: space-between;
            .item-left {
              margin-right: 18rpx;
              .title {
                font-size: 36rpx;
                line-height: 50rpx;
              }
              .button {
                font-size: 28rpx;
                margin-top: 12rpx;
                image {
                  width: 20rpx;
                  height: 20rpx;
                }
              }
            }
            .img {
              width: 80rpx;
              height: 80rpx;
            }
          }
          .item2 {
            margin-top: 16rpx;
          }
        }
      }
      .train-wrap {
        height: 460rpx;
        padding: 38rpx 26rpx 20rpx 26rpx;
        border-radius: 20rpx;
        margin-top: 16rpx;
        flex-direction: column;
        .train-wrap-left {
          width: 100%;
          margin-right: 0rpx;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .title {
            font-size: 40rpx;
            line-height: 56rpx;
            padding-bottom: 0rpx;
            text {
              color: #259779;
            }
          }
          .p1 {
            width: 286rpx;
            height: 74rpx;
            font-size: 28rpx;
            text-align: center;
            color: #E0B04A;
            padding: 14rpx 0rpx 0rpx 0rpx;
            background: url('../../static/images/pages/index-img-5.png') no-repeat;
            background-size: 286rpx 74rpx;
            box-sizing: border-box;
            margin-right: -34rpx;
          }
          
        }
        .train-wrap-right {
          flex: 0 0 320rpx;
          .img-1 {
            width: 580rpx;
            height: 320rpx;
            margin-top: -38rpx;
          }
        } 
        .button {
          width: 648rpx;
          height: 72rpx;
          font-size: 32rpx;
          border-radius: 36rpx;
          margin-top: -70rpx;
          flex: 0 0 72rpx;
          image {
            width: 20rpx;
            height: 20rpx;
            margin-left: 4rpx;
          }
        }
      }
      .game-wrap {
        height: 280rpx;
        border-radius: 20rpx;
        margin-top: 44rpx;
        padding: 26rpx;
        .title {
          font-size: 32rpx;
          text:nth-child(1) {
            font-size: 36rpx;
            padding-right: 16rpx;
          }
        }
        .content {
          margin-top: 18rpx;
          .item {
            width: 322rpx;
            height: 160rpx;
            border-radius: 12rpx;
            .item-right {
              margin-left: 34rpx;
              .title {
                font-size: 34rpx;
                padding-bottom: 0rpx;
              }
              .desc {
                font-size: 28rpx;
                image {
                  width: 20rpx;
                  height: 20rpx;
                }
              }
            }
          }
          .item-game {
            padding: 30rpx 0 32rpx 26rpx;
            .item-left {
              .swiper-img {
                width: 98rpx;
                height: 98rpx;
                image {
                  width: 98rpx;
                  height: 98rpx;
                  border-radius: 8rpx;
                }
              }
              .bg-shadow {
                width: 84rpx;
                height: 84rpx;
                right: -6rpx;
                border-radius: 8rpx;
              }
            }
          }
          .item-exercise {
            padding: 10rpx 0 12rpx 16rpx;
            .item-left {
              flex: 0 0 140rpx;
              .img-exercise {
                width: 140rpx;
                height: 140rpx;
              }
            }
            .item-right {
              margin-left: 0rpx;
            }
          }
        }
      }
      .news-wrap {
        margin-top: 24rpx;
        border-radius: 20rpx;
        padding: 28rpx 26rpx;
        .title {
          font-size: 36rpx;
          margin-bottom: 22rpx;
        }
        .content {
          .item {
            padding: 42rpx 0;
            flex-direction: row-reverse;
            justify-content: space-between;
            image {
              width: 180rpx;
              height: 132rpx;
              border-radius: 12rpx;
              margin-right: 0rpx;
              flex: 0 0 180rpx;
            }
            .detail {
              max-width: 442rpx;
              font-size: 34rpx;
              text-overflow: ellipsis;
              -webkit-line-clamp: 2;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              white-space: normal;
            }
          }
        }
      }
      
      
      .swiper {
        width: 100%;
        height: 140rpx;
        margin-bottom: 30rpx;
        image {
          width: 100%;
          height: 100%;
          border-radius: 20rpx;
        }
      }
    
      .link {
        width: 750rpx;
        max-width: 750rpx;
        margin-left: -30rpx;
        font-size: 16rpx;
        padding: 20rpx 0;
      }
    }
    .container .box-alert {
      .content {
        width: 490rpx;
        padding: 30rpx;
        border-radius: 30rpx;
        font-size: 34rpx;
       
        .btn {
          width: 422rpx;
          height: 84rpx;
         
          border-radius: 10rpx;
          line-height: 84rpx;
          margin-top: 40rpx;
        }
        .close {
          
          padding: 15rpx;
          margin-bottom: 40rpx;
        }
      }
    }
  }
	// 绑定推荐码后的弹窗
	.popupWrap {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 100;
		background: rgba(0, 0, 0, 0.3);
		.popup {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			width: 772rpx;
			height: 713rpx;
			background: url('https://natt.yimed.cn:11902/static/operateSteps/codeContentPop11-15.png');
			background-size: 100% 100%;
			// background: white;
			// border-radius: 20rpx;
			.close{
				position: absolute;
				top: 65rpx;
				right: 130rpx;
				width: 57rpx;
				height: 57rpx;
			}
			.experienceNowBtn{
				position: absolute;
				bottom: 100rpx;
				left: 50%;
				width: 301rpx;
				height: 95rpx;
				transform: translate(-50%,0);
			}
		}
  }
  @media screen and (width: 360px) {
    .container {
     
      .evalution-wrap {
        .evalution-wrap-left {
          .content {
            .content-right {
              .p1 {
                padding: 38rpx 0 0 0rpx;
                text {
                  font-size: 30rpx;
                  padding-left: 0rpx;
                }
              }
            }
          }
        }
        .evalution-wrap-right {
          .item {
            width: 310rpx;
          }
        }
      }
    }
  }
</style>
