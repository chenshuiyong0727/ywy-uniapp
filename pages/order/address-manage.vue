<template>
  <view>
    <nav-bar title='地址管理'></nav-bar>
    <view class="container">
      <block v-if="requestDone && addressList.length">
        <view class="address-list">
          <view class="item" v-for="item in addressList" :key="item.id">
            <view class="item-left">
              <view>{{item.receiveUserName}} {{item.receiveUserPhone}}</view>
              <view>{{item.province}} {{item.city}} {{item.area}} {{item.town}} {{item.detailAddress}}</view>
            </view>
            <view class="item-right">
              <view class="operate edit" @click="editHandle(item)">
                <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/edit.png'"></image>
                <view>修改</view>
              </view>
              <view class="operate delete" @click="showDeleteBox(item)">
                <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/delete.png'"></image>
                <view>删除</view>
              </view>
            </view>
          </view>
        </view>
      </block>
      <block v-if="requestDone && !addressList.length">
        <view class="empty"><empty-data tips="当前暂无收货地址"></empty-data></view>
      </block>
      <view class="add-btn" @click="goToPage('/pages/order/add-address')"><image :src="imgPrefix + '/static/operateSteps/portalH5/pages/add.png'"></image><text>新增收货地址</text></view>
      <view class="delete-box" v-if="isShowDeleteBox">
        <view class="delete-box-content">
          <view class="title">确定要删除该地址吗？</view>
          <view class="btn-group">
            <view @click="cancelDelete">取消</view>
            <view @click="deleteHandle">删除</view>
          </view>
        </view>
      </view>
      <!--侧边栏-->
      <!-- <fab :isOpenFabMenu="isPad ? true : false"></fab> -->
      <!--end 侧边栏-->
    </view>
  </view>
</template>

<script>
  import { navigateTo } from '../../utils/util'
  import fab from '@/components/fab'
  import navBar from '@/components/nav-bar'
  import emptyData from '@/components/empty-data'
  export default {
    components: {
      navBar,
      fab,
      emptyData
    },
    data() {
      return {
        isPad: this.$pad,
        imgPrefix: this.$imgPrefix,
        userInfo: {},
        addressList: [],
        isShowDeleteBox: false,
        deleteAddressId: '',
        requestDone: false
      }
    },
    mounted() {
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
      this.getAddressList()
    },
    methods: {
      goToPage(url) {
        // 跳转之前判断是否登录
        getApp().loginStatus().then(() => {
          navigateTo(url)
        })
      },
      getAddressList() {
        this.$request({
          url: '/gw/h5/v1/front/user/address/list',
          method: 'post',
          data: {
            token: this.userInfo.token,
            userId: this.userInfo.userId
          }
        }).then(res => {
          this.requestDone = true
          if (res.status == 1000) {
            this.addressList = res.data
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      editHandle(item) {
        navigateTo('/pages/order/add-address?addressid='+item.id)
      },
      showDeleteBox(item) {
        this.isShowDeleteBox = true
        this.deleteAddressId = item.id
      },
      cancelDelete() {
        this.isShowDeleteBox = false
        this.deleteAddressId = ''
      },
      deleteHandle() {
        this.$request({
          url: '/gw/h5/v1/front/user/address/remove',
          method: 'post',
          data: {
            token: this.userInfo.token,
            id: this.deleteAddressId
          }
        }).then(res => {
          if (res.status == 1000) {
            // 删除成功
            this.addressList = this.addressList.filter(item => item.id != this.deleteAddressId)
            this.isShowDeleteBox = false
            uni.showToast({
              title: '删除地址成功',
              icon: 'success',
              duration: 2000
            })
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
  }
</script>

<style lang="scss" scoped>
  .container {
    width: 750rpx;
    max-width: 750rpx;
    box-sizing: border-box;
    font-size: 20rpx;
    color: #333;
    padding: 25rpx 12.5rpx;
    margin: 0 auto;
    .address-list {
      .item {
        padding: 22.5rpx 17.5rpx;
        background-color: #F7F7F7;
        border-radius: 12.5rpx;
        margin-bottom: 12.5rpx;
        display: flex;
        align-items: center;
        justify-content: space-around;
        .item-left {
          width: 525rpx;
          &>view:nth-child(1) {
            font-size: 22.5rpx;
            color: #333;
            font-weight: bold;
            padding-bottom: 15rpx;
          }
          &>view:nth-child(2) {
            font-size: 20rpx;
            color: #666;
          }
        }
        .item-right {
          display: flex;
          .operate {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-right: 40rpx;
            image {
              width: 25rpx;
              height: 25rpx;
              margin-bottom: 3.75rpx;
            }
          }
          .operate:last-child {
            margin-right: 0;
          }
          .edit {
            color: #43C9A7;
          }
          .delete {
            color: #FC6666;
          }
        }
      }
    }
    .empty {
      margin-bottom: 100rpx;
    }
    .add-btn {
      width: 397.5rpx;
      height: 60rpx;
      font-size: 22.5rpx;
      font-weight: bold;
      color: #fff;
      background-color: #43C9A7;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 5rpx;
      margin: 31.25rpx auto 0 auto;
      image {
        width: 30rpx;
        height: 30rpx;
        margin-right: 10rpx;
      }
    }
    .delete-box {
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 13;
      .delete-box-content {
        width: 445rpx;
        height: 206.25rpx;
        background-color: #fff;
        border-radius: 12.5rpx;
        padding: 37.5rpx 25rpx 30rpx 25rpx;
        box-sizing: border-box;
        .title {
          text-align: center;
          font-size: 27.5rpx;
          font-weight: bold;
          padding-bottom: 37.5rpx;
        }
        .btn-group {
          display: flex;
          justify-content: space-between;
          &>view {
            width: 185rpx;
            height: 62.5rpx;
            border-radius: 7.5rpx;
            text-align: center;
            line-height: 62.5rpx;
            border: 1px solid #43C9A7;
            font-size: 25rpx;
            color: #fff;
            font-weight: bold;
            background-color: #43C9A7;
            
          }
          &>view:nth-child(1) {
            color: #43C9A7;
            background-color: #fff;
          }
        }
      }
    }
  }
  @media screen and (max-width: 500px) {
    .container {
      font-size: 32rpx;
      padding: 32rpx 26rpx;
      .address-list {
        .item {
          padding: 0rpx 0rpx 0rpx 28rpx;
          border-radius: 20rpx;
          margin-bottom: 22rpx;
          .item-left {
            padding-top: 22rpx;
            width: 490rpx;
            flex: 0 0 490rpx;
            box-sizing: border-box;
            padding-right: 20rpx;
            &>view:nth-child(1) {
              font-size: 36rpx;
              padding-bottom: 15rpx;
            }
            &>view:nth-child(2) {
              font-size: 32rpx;
            }
          }
          .item-right {
            display: flex;
            width: 175rpx;
            flex: 0 0 175rpx;
            flex-direction: column;
            border-left: 1px solid #D9D9D9;
            .operate {
              display: flex;
              width: 175;
              padding: 45rpx 0;
              flex-direction: row;
              align-items: center;
              justify-content: center;
              margin-right: 0rpx;
              image {
                width: 35rpx;
                height: 35rpx;
                margin-bottom: 0rpx;
                margin-right: 20rpx;
              }
            }
            .operate:last-child {
              margin-right: 0;
            }
            .edit {
              color: #43C9A7;
              border-bottom: 1px solid #D9D9D9;
            }
            .delete {
              color: #FC6666;
            }
          }
        }
      }
      .add-btn {
        width: 698rpx;
        height: 96rpx;
        font-size: 36rpx;
        border-radius: 8rpx;
        margin: 30rpx auto 0 auto;
        image {
          width: 50rpx;
          height: 50rpx;
          margin-right: 25rpx;
        }
      }
      .delete-box {
        .delete-box-content {
          width: 648rpx;
          height: 304rpx;
          border-radius: 20rpx;
          padding: 60rpx 20rpx 20rpx 20rpx;
          .title {
            font-size: 44rpx;
            padding-bottom: 60rpx;
          }
          .btn-group {
            &>view {
              width: 296rpx;
              height: 100rpx;
              border-radius: 12rpx;
              line-height: 100rpx;
              font-size: 40rpx;
              
            }
          }
        }
      }
    }
  }
</style>