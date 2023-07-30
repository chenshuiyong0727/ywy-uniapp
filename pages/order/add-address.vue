<template>
  <view>
    <nav-bar title='地址管理'></nav-bar>
    <view class="container">
      <view class="top">
        <view>请填写收货地址，用于购买商品后寄送</view>
        <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/renwu.png'"></image>
      </view>
      <view class="form-box">
        <view class="form-input">
          <view>收货人</view>
          <view><input v-model="queryParam.receiveUserName" placeholder="名字"/></view>
        </view>
        <view class="form-input">
          <view>手机号码</view>
          <view><input v-model="queryParam.receiveUserPhone" placeholder="请填写联系电话" maxlength="11" type="number" /></view>
        </view>
        <view class="form-input">
          <view>所在地区</view>
          <view @click="showCityListHandle"><input disabled :value="showAddress" placeholder="省、市、区、县、乡镇等"/></view>
        </view>
        <view class="form-input form-input-2">
          <view>详细地址</view>
          <view><textarea v-model="queryParam.detailAddress" class="_textarea" placeholder-style="color: #C9C9C9" placeholder="街道、小区、楼号、门牌号等"/></view>
        </view>
      </view>
      <view class="operate">
        <view class="return" @click="returnBack">返回</view>
        <view class="confirm" @click="confirm">确定</view>
      </view>
      <!--侧边栏-->
      <!-- <fab :isOpenFabMenu="isPad ? true : false"></fab> -->
      <!--end 侧边栏-->
    </view>
    <city ref="city" @getAddressHandle="getAddressHandle" :isShowMask="true"></city>
  </view>
</template>

<script>
  import fab from '@/components/fab'
  import navBar from '@/components/nav-bar'
  import { navigateTo } from '../../utils/util'
  import city from '@/components/city'
  export default {
    components: {
      navBar,
      fab,
      city
    },
    data() {
      return {
        isPad: this.$pad,
        imgPrefix: this.$imgPrefix,
        addressId: '',
        userInfo: {},
        queryParam: {
          receiveUserName: '',
          receiveUserPhone: '',
          province: '',
          city: '',
          area: '',
          town: '',
          detailAddress: ''
        },
        showAddress: ''
      }
    },
    onLoad(options) {
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
      this.addressId = options.addressid ? options.addressid : ''
      if (this.addressId) {
        // 修改地址
        this.getAddressList()
      }
    },
    methods: {
      showCityListHandle() {
        this.$refs.city.isShowAddressSelect = true
        setTimeout(() => {
         this.$refs.city.isShowContentFlag = true  
        }, 10)
      },
      getAddressHandle(addressData) {
        this.queryParam.province = addressData.province.name
        this.queryParam.city = addressData.city.name
        this.queryParam.area = addressData.area.name
        this.queryParam.town = addressData.street.name
        this.showAddress = `${addressData.province.name}/${addressData.city.name}/${addressData.area.name}/${addressData.street.name}`
      },
      returnBack() {
        uni.navigateBack({
          delta: 1
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
          if (res.status == 1000) {
            this.queryParam = res.data ? res.data.filter(item => item.id === this.addressId)[0] : {}
            this.showAddress = `${this.queryParam.province}/${this.queryParam.city}/${this.queryParam.area}/${this.queryParam.town}`
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      confirm() {
        let reg = /^1[3,4,5,6,7,8,9][0-9]{9}$/
        if (!this.queryParam.receiveUserName) {
          return uni.showToast({
            title: '请填写收货人姓名',
            icon: 'none',
            duration: 2000
          })
        } else if (!this.queryParam.receiveUserPhone) {
          return uni.showToast({
            title: '请填写收货人电话',
            icon: 'none',
            duration: 2000
          })
        } else if (!reg.test(this.queryParam.receiveUserPhone)) {
          return uni.showToast({
            title: '手机号码格式错误',
            icon: 'none',
            duration: 2000
          })
        } else if (!this.queryParam.province && !this.queryParam.city) {
          return uni.showToast({
            title: '请选择所在地区',
            icon: 'none',
            duration: 2000
          })
        }
        let requestUrl = ''
        if (this.addressId) {
          // 修改，走修改接口
          requestUrl = '/gw/h5/v1/front/user/address/update'
        } else {
          // 新增，走新增接口
          requestUrl = '/gw/h5/v1/front/user/address/add'
        }
        this.$request({
          url: requestUrl,
          method: 'post',
          data: {
            ...this.queryParam,
            token: this.userInfo.token,
            userId: this.userInfo.userId
          }
        }).then(res => {
          if (res.status == 1000) {
            uni.showToast({
              title: this.addressId ? '修改地址成功' : '新增地址成功',
              icon: 'success',
              duration: 2000
            })
            setTimeout(() => {
               navigateTo('/pages/order/address-manage')
            }, 2000)
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
    background-color: #F7F7F7;
    min-height: calc(100vh - 50rpx);
    .top {
      padding-top: 35rpx;
      position: relative;
      &>view:nth-child(1) {
        font-size: 22.5rpx;
        font-weight: bold;
        color: #333;
        width: 462.5rpx;
        height: 50rpx;
        line-height: 50rpx;
        background: linear-gradient(90deg, #F2F9F8 0%, #D7F1EA 100%);
        border-radius: 25rpx;
        text-align: right;
        margin: 0 auto;
        padding-right: 12.5rpx;
        box-sizing: border-box;
      }
      &>image {
        width: 53.75rpx;
        height: 75rpx;
        position: absolute;
        bottom: 0rpx;
        left: 125rpx;
      }
    }
    .form-box {
      padding: 21.25rpx 56.25rpx 0 56.25rpx;
      .form-input {
        display: flex;
        align-items: center;
        justify-content: space-around;
        margin-bottom: 10rpx;
        &>view:nth-child(1) {
          width: 87.5rpx;
          font-size: 21.25rpx;
          font-weight: bold;
        }
        &>view:nth-child(2) {
          margin-left: 17.5rpx;
          flex: 1;
          width: 537.5rpx;
          height: 55rpx;
          line-height: 55rpx;
          font-size: 22.5rpx;
          border: 1px solid #D1D1D1;
          border-radius: 7.5rpx;
          input {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            padding-left: 20rpx;
            padding-right: 20rpx;
          }
          
          .uni-input-placeholder {
            font-size: 22.5rpx;
          }
        }
      }
      .form-input-2 {
        &>view:nth-child(2) { 
          height: 87.5rpx;
          line-height: auto;
          ._textarea {
            width: 100%;
            padding: 11.25rpx 15rpx;
            height: 87.5rpx;
            box-sizing: border-box;
          }
        }
      }
    }
    .operate {
      padding: 0 56.25rpx;
      display: flex;
      margin: 43.75rpx 0 0 105rpx;
      &>view {
        font-size: 22.5rpx;
        font-weight: bold;
        text-align: center;
        height: 60rpx;
        line-height: 60rpx;
        border-radius: 5rpx;
        border: 1px solid #43C9A7;
      }
      .return {
        width: 212.5rpx;
        margin-right: 7.5rpx;
        color: #43C9A7;
      }
      .confirm {
        width: 315rpx;
        background-color: #43C9A7;
        color: #fff;
      }
    }
  }
  @media screen and (max-width: 500px) {
    .container {
      font-size: 36rpx;
      padding: 0rpx;
      min-height: calc(100vh - 92rpx);
      .top {
        padding-top: 60rpx;
        &>view:nth-child(1) {
          font-size: 36rpx;
          width: 740rpx;
          height: 78rpx;
          line-height: 78rpx;
          border-radius: 40rpx;
          padding-right: 20rpx;
          
        }
        &>image {
          width: 86rpx;
          height: 120rpx;
          left: 10rpx;
        }
      }
      .form-box {
        padding: 40rpx 25rpx 0 25rpx;
        margin-top: 20rpx;
        .form-input {
          margin-bottom: 16rpx;
          &>view:nth-child(1) {
            width: 145rpx;
            font-size: 34rpx;
          }
          &>view:nth-child(2) {
            margin-left: 25rpx;
            width: 530rpx;
            height: 88rpx;
            line-height: 88rpx;
            font-size: 36rpx;
            border-radius: 12rpx;
            
            .uni-input-placeholder {
              font-size: 36rpx;
            }
          }
        }
        .form-input-2 {
          &>view:nth-child(2) { 
            height: 192rpx;
            ._textarea {
              padding: 18rpx 24rpx;
              height: 192rpx;
            }
          }
        }
      }
      .operate {
        padding: 0 25rpx;
        margin: 60rpx 0 0 0rpx;
        &>view {
          font-size: 36rpx;
          height: 96rpx;
          line-height: 96rpx;
          border-radius: 8rpx;
        }
        .return {
          width: 338rpx;
          margin-right: 20rpx;
        }
        .confirm {
          width: 338rpx;
        }
      }
    }
  }
</style>