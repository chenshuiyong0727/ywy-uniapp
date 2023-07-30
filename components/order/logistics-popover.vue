<template>
  <view class="pop-box">
    <view class="content">
      <view class="close" @click="closeHandle"><uni-icons type="closeempty" :size="isPad ? '25' : '20'"></uni-icons></view>
      <view class="form-box">
        <view class="title">物流商</view>
        <view class="input-container">
          <!-- <input type="text" placeholder-class="_placeholder" placeholder="请选择物流商" disabled /> -->
          <uni-data-select
            v-model="logisticsSupplier"
            :localdata="range"
          ></uni-data-select>
        </view>
      </view>
      <view class="form-box">
        <view class="title">物流单号</view>
        <view class="input-container"><input type="text" v-model="logisticsNumber" placeholder-class="_placeholder" placeholder="请输入物流单号" /></view>
      </view>
      <view class="btn" @click="updateReturnLogistics">提交</view>
    </view>
  </view>
</template>

<script>
  export default {
    props: {
      payOrderId: {
        type: String,
        default: ''
      },
      logisticsParam: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        isPad: this.$pad,
        logisticsSupplier: 0,
        range: [],
        logisticsNumber: ''
      }
    },
    mounted() {
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
      let sysDictList = uni.getStorageSync('sysDictList') ? JSON.parse(uni.getStorageSync('sysDictList')) : []
      let range = sysDictList.filter(item => item.typeValue == '600017')
      this.range = JSON.parse(JSON.stringify(range).replace(/fieldName/g, "text").replace(/fieldValue/g, "value"))
      if (this.logisticsParam.logisticsSupplier) {
        this.logisticsSupplier = this.logisticsParam.logisticsSupplier
      }
      if (this.logisticsParam.logisticsNumber) {
        this.logisticsNumber = this.logisticsParam.logisticsNumber
      }
    },
    methods: {
      closeHandle() {
        this.$emit('closeLogisticsPop')
      },
      updateReturnLogistics() {
        if (!this.logisticsSupplier) {
          return uni.showToast({
            title: '请选择物流商',
            icon: 'none',
            duration: 2000
          })
        } else if (!this.logisticsNumber) {
          return uni.showToast({
            title: '请填写物流单号',
            icon: 'none',
            duration: 2000
          })
        }
        this.$request({
          url: '/gw/h5/v1/front/order/updateReturnLogistics',
          method: 'post',
          data: {
            token: this.userInfo.token,
            returnLogisticsNumber: this.logisticsNumber,
            returnLogisticsSupplier: this.logisticsSupplier,
            payOrderId: this.payOrderId
          }
        }).then(res => {
          if (res.status == 1000) {
            this.$emit('updateLogisticsSuccess')
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
  .pop-box {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    .content {
      width: 343.75rpx;
      padding: 20rpx 25rpx;
      box-sizing: border-box;
      background-color: #fff;
      border-radius: 12.5rpx;
      position: relative;
      .close {
        position: absolute;
        right: 0rpx;
        top: 0rpx;
        padding: 10rpx;
      }
      .form-box {
        margin-top: 25rpx;
        position: relative;
        .title {
          font-size: 20rpx;
          color: #1A1A1A;
          padding-bottom: 12.5rpx;
        }
        .input-container {
          height: 31.25rpx;
          padding-bottom: 12.5rpx;
          border-bottom: 1px solid #1A1A1A;
          ._placeholder {
            font-size: 22.5rpx;
            color: #C9C9C9;
            input {
              font-size: 22.5rpx;
            }
          }
        }
        .input-select {
          position: relative;
          &::after {
            content: '';
            width: 10rpx;
            height: 10rpx;
            border-top: 2px solid #999999;
            border-right: 2px solid #999999;
            transform: rotate(45deg);
            position: absolute;
            right: 0;
            top: 5rpx;
          }
        }
      }
      .form-box:last-child {
        margin-top: 37.5rpx;
      }
      .btn {
        width: 292.5rpx;
        height: 50rpx;
        line-height: 50rpx;
        text-align: center;
        background-color: #43C9A7;
        font-size: 21.25rpx;
        color: #fff;
        font-weight: bold;
        border-radius: 25rpx;
        margin-top: 37.5rpx;
      }
    }
    ::v-deep .uni-select {
      border: 1px solid #fff;
      padding: 0;
      font-size: 22.5rpx;
      height: 31.25rpx;
    }
    ::v-deep .uni-select__input-placeholder {
      font-size: 22.5rpx;
      color: #C9C9C9;
    }
  }
  @media screen and (max-width: 500px) {
    .pop-box {
      .content {
        width: 545rpx;
        padding: 30rpx;
        border-radius: 20rpx;
        .form-box {
          margin-top: 60rpx;
          .title {
            font-size: 32rpx;
            padding-bottom: 20rpx;
          }
          .input-container {
            height: 50rpx;
            padding-bottom: 20rpx;
            ._placeholder {
              font-size: 36rpx;
              input {
                font-size: 36rpx;
              }
            }
          }
          .input-select {
            &::after {
              content: '';
              width: 15rpx;
              height: 15rpx;
              transform: rotate(45deg);
              top: 10rpx;
            }
          }
        }
        .btn {
          width: 470rpx;
          height: 84rpx;
          line-height: 84rpx;
          font-size: 34rpx;
          border-radius: 42rpx;
          margin-top: 60rpx;
        }
      }
      ::v-deep .uni-select {
        font-size: 36rpx;
        height: 50rpx;
      }
      ::v-deep .uni-select__input-placeholder {
        font-size: 36rpx;
      }
    }
  }
</style>