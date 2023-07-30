<template>
  <view class="list-container"  v-if="isShowAddressSelect">
    <view :class="[isShowContentFlag ? 'content-show' : 'content-close','content']">
      <view class="close" @click="closeHandle"><uni-icons type="closeempty" size="20"></uni-icons></view>
      <view class="address-list" v-if="addressListArr.length">
        <scroll-view scroll-y="true" class="scroll-Y">
          <view class="item" v-for="(item, index) in addressListArr" :key="item.id" @click="chooseItemHandle(item, index)">
            <image :src="index == currentIndex ? imgPrefix + '/static/operateSteps/portalH5/pages/radio-checked.png' : imgPrefix + '/static/operateSteps/portalH5/pages/radio.png'"></image>
            <view class="detail">
              <view>
                <text>{{item.receiveUserName}}</text>
                <text>{{item.receiveUserPhone}}</text>
              </view>
              <view>{{item.province}} {{item.city}} {{item.area}} {{item.town}} {{item.detailAddress}}</view>
            </view>
          </view>
        </scroll-view>
        
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        isShowContentFlag: false,
        isShowAddressSelect: false,
        addressListArr: [],
        currentIndex: -1,
        imgPrefix: this.$imgPrefix
      }
    },
    mounted() {
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
      this.getAddressList()
    },
    methods: {
      closeHandle() {
        this.isShowContentFlag = false
        setTimeout(() => {
          this.isShowAddressSelect = false
        }, 200)
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
          if (res.status == 1000) {
            this.addressListArr = res.data
            if (this.addressListArr.length == 1) {
              this.currentIndex = 0
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
      chooseItemHandle(item, index) {
        this.currentIndex = index
        this.$emit('chooseAddressHandle', item)
        this.closeHandle()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .list-container {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    z-index: 9999;
    color: #333;
    text-align: left;
    .content {
      width: 750rpx;
      max-width: 750rpx;
      background-color: #fff;
      border-top-left-radius: 25rpx;
      border-top-right-radius: 25rpx;
      font-size: 21.25rpx;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
      transition: height 0.2s;
      .close {
        position: absolute;
        right: 15rpx;
        top: 5rpx;
        padding: 10rpx;
      }
      .address-list {
        padding: 65rpx 20rpx 37.5rpx 20rpx;
        .scroll-Y {
          height: 520rpx;
        }
        .item {
          display: flex;
          align-items: center;
          width: 710rpx;
          height: 115rpx;
          background-color: #f7f7f7;
          border-radius: 12.5rpx;
          padding: 21.25rpx;
          box-sizing: border-box;
          margin-bottom: 12.5rpx;
          line-height: initial;
          image {
            width: 22.5rpx;
            height: 22.5rpx;
            margin-right: 21.25rpx;
          }
          .detail {
            text {
              font-size: 22.5rpx;
              font-weight: bold;
              padding-right: 25rpx;
            }
            &>view:nth-child(2) {
              font-size: 20rpx;
              color: #666;
              margin-top: 15rpx;
            }
          }
        }
      }
    }
    .content-close {
      height: 0;
    }
    .content-show {
      // height: 562.5rpx;
      height: 620rpx;
    }
  }
  @media screen and (max-width: 500px) {
    .list-container {
      .content {
       
        border-top-left-radius: 40rpx;
        border-top-right-radius: 40rpx;
        font-size: 32rpx;
        .address-list {
          padding: 94rpx 26rpx 30rpx 26rpx;
          .scroll-Y {
            height: 780rpx;
          }
          .item {
            width: 698rpx;
            height: 214rpx;
            border-radius: 20rpx;
            padding: 22rpx 30rpx;
            margin-bottom: 20rpx;
            image {
              width: 36rpx;
              height: 36rpx;
              margin-right: 30rpx;
              flex: 0 0 36rpx;
            }
            .detail {
              text {
                font-size: 36rpx;
                padding-right: 25rpx;
              }
              &>view:nth-child(2) {
                font-size: 32rpx;
                margin-top: 15rpx;
              }
            }
          }
        }
      }
      .content-close {
        height: 0;
      }
      .content-show {
        height: 970rpx;
      }
    }
  }
</style>