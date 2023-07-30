<template>
  <view class="address-container" v-if="isShowAddressSelect">
    <view :class="[isShowContentFlag ? 'content-show' : 'content-close','content']">
      <view class="close" @click="closeHandle"><uni-icons type="closeempty" size="20"></uni-icons></view>
      <view class="content-top">
        <view>您购买的数字疗法，包含训练平板{{addressFlag == 1 ? '租赁' : ''}}</view>
        <view>请选择收货地址，用于平板的寄送</view>
        <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/renwu.png'"></image>
      </view>
      <view class="select-address" @click="showAddressListHandle" v-if="addressListArr.length">选择收货地址</view>
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
      <view class="protocol">
        <checkbox-group @change="checkAgreement">
          <view class="check-box">
            <checkbox value="1" :checked="boxChecked" /> 
            <view>我已阅读并同意<text class="link" @click="showProtocolHandle">《租赁服务协议》</text><text class="link link2" @click="showProtocolHandle">立即查看</text></view>
          </view>
        </checkbox-group>
        <view class="error-tip" v-if="isShowProtocolTip" @click="showProtocolHandle">
          <text>请先阅读并同意协议</text>
        </view>
      </view>
      <view class="btn" @click="confrimHandle">确认</view>
    </view>
    <city @touchmove.prevent ref="city" @getAddressHandle="getAddressHandle"></city>
    <address-list @touchmove.prevent ref="addressList" @chooseAddressHandle="chooseAddressHandle"></address-list>
    <protocol ref="protocol" @closeProtocolHandle="closeProtocolHandle"></protocol>
  </view>
</template>

<script>
  import city from '@/components/city'
  import addressList from '@/components/city/address-list'
  import protocol from '@/components/city/protocol'
  export default {
    components: {
      city,
      addressList,
      protocol
    },
    props: {
      addressFlag: {
        type: Number,
        default: -1 // -1=>不需要填写地址 1=>需要填写地址(租赁) 2=>需要填写地址(附带)
      },
    },
    data() {
      return {
        imgPrefix: this.$imgPrefix,
        isShowContentFlag: false,
        isShowAddressSelect: false,
        queryParam: {
          receiveUserName: '',
          receiveUserPhone: '',
          province: '',
          city: '',
          area: '',
          town: '',
          detailAddress: ''
        },
        showAddress: '',
        addressListArr: [],
        isShowProtocolTip: false,
        boxChecked: false
      }
    },
    mounted() {
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
      this.getAddressList()
    },
    methods: {
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
              let val = this.addressListArr[0]
              this.chooseAddressHandle(val)
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
      showCityListHandle() {
        this.$refs.city.isShowAddressSelect = true
        setTimeout(() => {
         this.$refs.city.isShowContentFlag = true  
        }, 10)
      },
      showAddressListHandle() {
        this.$refs.addressList.isShowAddressSelect = true
        setTimeout(() => {
         this.$refs.addressList.isShowContentFlag = true  
        }, 10)
      },
      showProtocolHandle() {
        this.$refs.protocol.isShowAddressSelect = true
        setTimeout(() => {
         this.$refs.protocol.isShowContentFlag = true  
        }, 10)
      },
      closeHandle() {
        this.isShowContentFlag = false
        setTimeout(() => {
          this.isShowAddressSelect = false
          this.$emit('closeAddressBox')
        }, 200)
      },
      getAddressHandle(addressData) {
        this.queryParam.province = addressData.province.name
        this.queryParam.city = addressData.city.name
        this.queryParam.area = addressData.area.name
        this.queryParam.town = addressData.street.name
        this.showAddress = `${addressData.province.name}/${addressData.city.name}/${addressData.area.name}/${addressData.street.name}`
      },
      chooseAddressHandle(val) {
        this.queryParam.receiveUserName = val.receiveUserName
        this.queryParam.receiveUserPhone = val.receiveUserPhone
        this.queryParam.province = val.province
        this.queryParam.city = val.city
        this.queryParam.area = val.area
        this.queryParam.town = val.town
        this.showAddress = `${val.province}/${val.city}/${val.area}/${val.town}`
        this.queryParam.detailAddress = val.detailAddress
      },
      confrimHandle() {
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
        } else if (!this.boxChecked) {
          // return uni.showToast({
          //   title: '请先阅读并同意用户租赁协议',
          //   icon: 'none',
          //   duration: 2000
          // }) 
          return this.isShowProtocolTip = true
        }
        this.$emit('getAddressFormVal', this.queryParam)
        this.closeHandle()
      },
      checkAgreement(e) {
        this.boxChecked = e.detail.value.length ? true : false
        if (this.boxChecked) {
          this.isShowProtocolTip = false
        }
      },
      closeProtocolHandle(type) {
        if (type == 2) {
          this.boxChecked = true
        }
        this.isShowProtocolTip = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .address-container {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    z-index: 9999;
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
      font-weight: normal;
      color: #333;
      text-align: left;
      .close {
        position: absolute;
        right: 15rpx;
        top: 5rpx;
        padding: 10rpx;
      }
      .content-top {
        
        padding-top: 35rpx;
        &>view:nth-child(1) {
          font-size: 20rpx;
          color: #666;
          width: 407.5rpx;
          margin: 0 auto;
          box-sizing: border-box;
          padding-left: 45rpx;
        }
        &>view:nth-child(2) {
          font-size: 22.5rpx;
          font-weight: bold;
          color: #333;
          width: 407.5rpx;
          height: 41.25rpx;
          line-height: 41.25rpx;
          background: linear-gradient(90deg, #F2F9F8 0%, #D7F1EA 100%);
          border-radius: 21.25rpx;
          padding-left: 45rpx;
          margin: 6.25rpx auto 0 auto;
          box-sizing: border-box;
        }
        &>image {
          width: 53.75rpx;
          height: 75rpx;
          position: absolute;
          top: 31.25rpx;
          left: 145rpx;
        }
      }
      .select-address {
        font-size: 21.25rpx;
        padding: 18.75rpx 0 0 56.25rpx;
        color: #43C9A7;
        text-decoration: underline;
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
            font-weight: normal;
            
            input {
              width: 100%;
              height: 100%;
              padding-left: 20rpx;
              padding-right: 20rpx;
              box-sizing: border-box            
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
      .protocol {
        padding: 10rpx 56.25rpx 0 175rpx;
        position: relative;
        font-size: 17.5rpx;
        .check-box {
          display: flex;
          align-items: center;
        }
        .link {
          color: #43C9A7;
        }
        .link2 {
          text-decoration: underline;
        }
        .error-tip {
          position: absolute;
          top: -25rpx;
          left: 98rpx;
          text-align: center;
          width: 175rpx;
          height: 35rpx;
          font-size: 17.5rpx;
          color: #fff;
          background: url('../../static/images/pages/error-tip.png') no-repeat;
          background-size: 175rpx 35rpx;
          padding-top: 2.5rpx;
        }
      }
      .btn {
        width: 397.5rpx;
        height: 60rpx;
        background-color: #43C9A7;
        border-radius: 5rpx;
        font-size: 22.5rpx;
        color: #fff;
        text-align: center;
        line-height: 60rpx;
        font-weight: bold;
        margin: 15rpx auto 0 auto;
      }
    }
    .content-close {
      height: 0;
    }
    .content-show {
      height: 620rpx;
    }
  }
  @media screen and (max-width: 500px) {
    .address-container {
      .content {
        border-top-left-radius: 40rpx;
        border-top-right-radius: 40rpx;
        font-size: 32rpx;
        .content-top {
          padding-top: 30rpx;
          &>view:nth-child(1) {
            font-size: 32rpx;
            width: 652rpx;
            padding-left: 80rpx;
            
          }
          &>view:nth-child(2) {
            font-size: 36rpx;
            width: 652rpx;
            height: 66rpx;
            line-height: 66rpx;
            border-radius: 34rpx;
            margin: 8rpx auto 0 auto;
            padding-left: 80rpx;
            box-sizing: border-box;
           
          }
          &>image {
            width: 86rpx;
            height: 120rpx;
            position: absolute;
            top: 26rpx;
            left: 30rpx;
          }
        }
        .select-address {
          padding: 40rpx 0 0 26rpx;
          font-size: 34rpx;
        }
        .form-box {
          padding: 36rpx 26rpx 0 26rpx;
          .form-input {
            margin-bottom: 16rpx;
            &>view:nth-child(1) {
              width: 140rpx;
              font-size: 34rpx;
            }
            &>view:nth-child(2) {
              margin-left: 28rpx;
              width: 532rpx;
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
              height: 162rpx;
              ._textarea {
                width: 100%;
                padding: 18rpx 24rpx;
                height: 162rpx;
              }
            }
          }
        }
        .protocol {
          padding: 20rpx 26rpx 0 58rpx;
          font-size: 28rpx;
          .error-tip {
            top: -40rpx;
            left: 30rpx;
            width: 280rpx;
            height: 56rpx;
            font-size: 28rpx;
            color: #fff;
            background: url('../../static/images/pages/error-tip-mobile.png') no-repeat;
            background-size: 280rpx 56rpx;
            padding-top: 4rpx;
          }
        }
        .btn {
          width: 636rpx;
          height: 96rpx;
          border-radius: 8rpx;
          font-size: 36rpx;
          line-height: 96rpx;
          font-weight: bold;
          margin: 25rpx auto 0 auto;
        }
      }
      .content-close {
        height: 0;
      }
      .content-show {
        height: 980rpx;
      }
    }
  }
</style>