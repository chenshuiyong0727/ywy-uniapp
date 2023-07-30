<template>
  <list title="健脑运动" :pageType="2" @getSwiperDataHanlde="getSwiperDataHanlde" ref="child">
    <!--今日数据-->
    <view class="game-list" slot="today" v-if="todayList.data.length">
      <view :class="[item.status == 0 ? 'lock': '','item']" v-for="item in todayList.data" :key="item.id" @click="beginMicromotion(item)">
        <view class="img">
          <image class="img-1" :mode="item.imgUrl.indexOf('../') > -1 ? 'aspectFill' : 'scaleToFill'" :src="isPad ? item.imgUrl : item.imgUrlPhone" lazy-load @error="imgLoadErrorHandle(item)"></image>
          <image :class="[item.status == 2 ? 'img-unlock' : '','img-2']" v-if="item.exerciseStatus != 1" :src="item.status == 0 ? imgPrefix + '/static/operateSteps/portalH5/pages/exercise-img-1.png' : item.status == 1 ? imgPrefix + '/static/operateSteps/portalH5/pages/exercise-img-2.png' : imgPrefix + '/static/operateSteps/portalH5/pages/exercise-img-5.png'"></image>
          <image class="img-lock" v-if="item.status == 0" src="../../static/images/applet/icon_lock.png"></image>
          <image class="img-today" v-if="item.exerciseStatus == 1" :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-today.png'"></image>
          <view class="count">
            <view>{{item.timesOfPlayStr || '0'}}次</view>
            <view>{{item.videoLengthTime}}</view>
          </view>
        </view>
        <view class="item-btm">
          <view class="title">{{item.title}}</view>
          <view class="btn-go" v-if="isPad"><text>{{item.exerciseStatus == 1 ? '再次跟练' : '立即跟练'}}</text><image :src="item.status == 0 ? imgPrefix + '/static/operateSteps/portalH5/pages/right-icon.png' : imgPrefix + '/static/operateSteps/portalH5/pages/exercise-img-3.png'"></image></view>
        </view>
      </view>
    </view>
    <!--end 今日数据-->
    <!--全部数据-->
    <view class="game-list" slot="all" v-if="allList.data.length">
      <view :class="[item.status == 0 ? 'lock': '','item']" v-for="item in allList.data" :key="item.id" @click="beginMicromotion(item)">
        <view class="img">
          <image class="img-1" :mode="item.imgUrl.indexOf('../') > -1 ? 'aspectFill' : 'scaleToFill'" :src="isPad ? item.imgUrl : item.imgUrlPhone" lazy-load @error="imgLoadErrorHandle(item)"></image>
          <image :class="[item.status == 2 ? 'img-unlock' : '','img-2']" v-if="item.exerciseStatus != 1" :src="item.status == 0 ? imgPrefix + '/static/operateSteps/portalH5/pages/exercise-img-1.png' : item.status == 1 ? imgPrefix + '/static/operateSteps/portalH5/pages/exercise-img-2.png' : imgPrefix + '/static/operateSteps/portalH5/pages/exercise-img-5.png'"></image>
          <image class="img-lock" v-if="item.status == 0" src="../../static/images/applet/icon_lock.png"></image>
          <image class="img-today" v-if="item.exerciseStatus == 1" :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-today.png'"></image>
          <view class="count">
            <view>{{item.timesOfPlayStr || '0'}}次</view>
            <view>{{item.videoLengthTime}}</view>
          </view>
        </view>
        <view class="item-btm">
          <view class="title">{{item.title}}</view>
          <view class="btn-go" v-if="isPad"><text>{{item.exerciseStatus == 1 ? '再次跟练' : '立即跟练'}}</text><image :src="item.status == 0 ? imgPrefix + '/static/operateSteps/portalH5/pages/right-icon.png' : imgPrefix + '/static/operateSteps/portalH5/pages/exercise-img-3.png'"></image></view>
        </view>
      </view>
    </view>
    <!--end 全部数据-->
    <!--侧边栏-->
    <fab slot="fab" v-if="isShowFab" :isOpenFabMenu="isPad ? true : false"></fab>
    <!--end 侧边栏-->
  </list>
</template>

<script>
  import fab from '@/components/fab'
  import { navigateTo } from '../../utils/util'
  import list from '@/components/common-page/list'
  import {mixin} from '@/mixin/mixin'
  export default {
    mixins:[mixin],
    components: {
      list,
      fab
    },
    data() {
      return {
        userInfo: {},
        imgPrefix: this.$imgPrefix,
        isPad: this.$pad,
        swiperIndex: 1,
        pageSize: 10,
        todayList: {
          pageNum: 1,
          totalCount: 0,
          data: []
        },
        allList: {
          pageNum: 1,
          totalCount: 0,
          data: []
        }
      }
    },
    onShow() {
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {},
      this.todayList.data = []
      this.todayList.totalCount = 0
      this.todayList.pageNum = 1
      this.allList.data = []
      this.allList.totalCount = 0
      this.allList.pageNum = 1
      this.getMicromotionList(this.swiperIndex)
    },
    methods: {
      getSwiperDataHanlde(index) {
        this.pageNum = 1
        this.swiperIndex = index + 1
        if (index == 0 && !this.todayList.data.length) {
          this.getMicromotionList(this.swiperIndex)
        }
        if (index == 1 && !this.allList.data.length) {
          this.getMicromotionList(this.swiperIndex)
        }
        
      },
      getMicromotionList(type) {
        this.$request({
          url: '/gw/h5/v1/front/ucServicePack/microSport',
          method: 'get',
          data: {
            token: this.userInfo.token,
            pageSize: this.pageSize,
            pageNum: type == 1 ? this.todayList.pageNum : this.allList.pageNum,
            type
          }
        }).then(res => {
          if (res.status === 1000) {
            let dataList = res.data ? res.data.list : []
            dataList.forEach((item, index, array) => {
              array[index].imgUrl = `${this.imgPrefix}${item.imgUrl}`
              array[index].imgUrlPhone = `${this.imgPrefix}${item.imgUrlPhone}`
            })
            if (type == 1) {
              this.todayList.totalCount = res.data ? res.data.pageInfo.totalCount : 0
              this.todayList.data = this.todayList.data.concat(dataList)
            } else {
              this.allList.totalCount = res.data ? res.data.pageInfo.totalCount : 0
              this.allList.data = this.allList.data.concat(dataList)
            }
            // 调用子组件方法动态设置swiper的高度
            // this.$nextTick(() => {
            //   this.$refs.child.setSwiperHeight()
            // })
            setTimeout(() => {
              this.$refs.child.setSwiperHeight()
            }, 200)
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      beginMicromotion(item) {
        if (item.status != 0) {
          // 已解锁
          this.$request({
            url: '/gw/h5/v1/front/ucServicePack/addPortalExerciseRecord',
            data: {
              token: this.userInfo.token,
              detailId: item.id,
              recordType: 2
            }
          }).then(res => {
            if (res.status === 1000) {
              navigateTo(`/pages/micromotion/detail?id=${item.id}`)
            } else {
              uni.showToast({
                title: res.msg,
                icon: 'none',
                duration: 2000
              })
            }
          })
          
        } else {
          navigateTo('/pages/micromotion/open-service-package')
        }
      },
      onReachBottom() {
        // 触底加载更多
        if (this.swiperIndex == 1) {
          // 今日数据加载
          if (Math.ceil(this.todayList.totalCount / this.pageSize) > this.todayList.pageNum) {
            // 有下一页
            // this.pageNum++
            this.todayList.pageNum++
            this.getMicromotionList(this.swiperIndex)
          }
        } else {
          // 全部数据加载
          if (Math.ceil(this.allList.totalCount / this.pageSize) > this.allList.pageNum) {
            // 有下一页
            // this.pageNum++
            this.allList.pageNum++
            this.getMicromotionList(this.swiperIndex)
          }
        }
      },
      imgLoadErrorHandle(item) {
        item['imgUrl'] = '../../static/images/pages/load-fail.png'
        item['imgUrlPhone'] = '../../static/images/pages/load-fail.png'
      }
    }
  
  }
</script>

<style lang="scss" scoped>
  .game-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .item {
      width: 357.43rpx;
      box-sizing: border-box;
      background-color: #fff;
      border-radius: 14.65rpx;
      padding-bottom: 21.97rpx;
      margin-bottom: 16.11rpx;
      .img {
        position: relative;
        height: 201.42rpx;
        .img-1 {
          width: 357.43rpx;
          height: 201.42rpx;
          border-top-left-radius: 10.25rpx;
          border-top-right-radius: 10.25rpx;
        }
        .img-2 {
          width: 71.05rpx;
          height: 19.04rpx;
          position: absolute;
          top: 11.72rpx;
          left: 11.72rpx;
          z-index: 2;
        }
        .img-unlock {
          width: 60.81rpx;
        }
        .count {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 50.54rpx;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%);
          padding: 0 11.72rpx 10.25rpx 11.72rpx;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          font-size: 11.72rpx;
          color: #fff;
        }
        .img-today {
          width: 49.82rpx;
          height: 47.62rpx;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;
        }
      }
      .item-btm {
        padding: 0 21.97rpx;
      }
      .title {
        font-size: 19.04rpx;
        color: #222;
        font-weight: bold;
        padding: 11.72rpx 0 7.32rpx 0;
      }
      .desc {
        padding-bottom: 13.18rpx;
        font-size: 14.65rpx;
        color: #666;
        width: 202.15rpx;
        overflow:hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow:ellipsis;
      }
      .btn-go {
        font-size: 16.11rpx;
        color: #DF5C1D;
        image {
          width: 20.51rpx;
          height: 15.38rpx;
          vertical-align: middle;
          margin-left: 3.66rpx;
        }
        text {
          vertical-align: middle;
          
        }
      }
    }
    .lock {
      .img {
        &::after {
          content: '';
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.4);
          border-radius: 10.25rpx;
          position: absolute;
          top: 0;
          left: 0;
        }
        .img-lock {
          width: 35.16rpx;
          height: 35.16rpx;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 3;
        }
      }
      .btn-go {
        color: #43C9A7;
      }
    }
  }
  @media screen and (max-width: 500px) {
    .game-list {
      flex-direction: column;
      .item {
        width: 100%;
        border-radius: 20rpx;
        padding: 0rpx 0rpx 32rpx 0rpx;
        margin: 0 0rpx 20rpx 0rpx;
        
        .img {
          position: relative;
          height: 396rpx;
          margin-bottom: 20rpx;
          .img-1 {
            width: 698rpx;
            height: 396rpx;
            border-radius: 12rpx;
          }
          .img-2 {
            width: 120rpx;
            height: 32rpx;
            top: 6rpx;
            left: 6rpx;
          }
          .img-unlock {
            width: 102rpx;
          }
          .img-today {
            width: 96rpx;
            height: 92rpx;
          }
        }
        .title {
          font-size: 36rpx;
          padding: 0rpx 0 8rpx 0;
          max-width: 650rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .desc {
          padding-bottom: 32rpx;
          font-size: 28rpx;
          color: #666;
          width: 370rpx;
        }
        .btn-go {
          font-size: 28rpx;
          image {
            width: 40rpx;
            height: 30rpx;
            margin-left: 8rpx;
          }
        }
      }
      .lock {
        .img {
          &::after {
            border-radius: 12rpx;
          }
          .img-lock {
            width: 48rpx;
            height: 48rpx;
          }
        }
      }
    }
  }
</style>