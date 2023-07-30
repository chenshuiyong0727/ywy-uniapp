<template>
  <view>
    <nav-bar title="注销账号须知"></nav-bar>
    <view class="container">
      <view class="box">
        <view class="title">
          <view class="icon-img left-icon-img"></view>
          <view class="span">注销账号的风险</view>
          <view class="icon-img"></view>
        </view>
        <view class="tip">温馨提示，注销账号存在一定风险：</view>
        <view class="p">1．账号一旦注销，将永久删除您的所有信息，包含但不限于账号信息，训练进度，已购评估/训练/咨询等。</view>
        <view class="p">2．注销后您在此平台所购买的产品将不可恢复，若想再次使用，需要重新购买。</view>
        <view class="p">3.若提交申请代表您同意以上观点，且将中止一切与平台相关的服务。</view>
        <view class="p">4.点击提交申请将视为同意并授权平台对此账号永久注销的相关操作，请确认是否注销。</view>
      </view>
      <view class="box">
        <view class="title">
          <view class="icon-img left-icon-img"></view>
          <view class="span">如何注销账号？</view>
          <view class="icon-img"></view>
        </view>
        <view class="tip2">拨打客服电话：<text>400 962 2120</text></view>
        <view class="p">由人工审核后，会在7-15个工作日内，完成账号注销，并及时反馈给您。</view>
      </view>
    </view>
  </view>
</template>

<script>
  import navBar from '@/components/nav-bar'
  export default {
    components: {
      navBar,
    }
  }
</script>

<style scoped lang="scss">
  .container {
    padding-bottom: 30rpx;
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      .icon-img {
        width: 60rpx;
        height: 2.5rpx;
        background: linear-gradient(270deg, rgba(153,153,153,0) 0%, #999999 100%);
        border-radius: 1px;
      }
      .left-icon-img {
        background: linear-gradient(-270deg, rgba(153,153,153,0) 0%, #999999 100%);
      }
      .span {
        font-size: 25rpx;
        color: #333333;
        font-weight: bold;
        margin: 0 17.5rpx;
      }
    }
    .box {
      width: 712.5rpx;
      background-color: #F8F8F8;
      font-size: 21.25rpx;
      color: #333;
      line-height: 37.5rpx;
      border-radius: 12.5rpx;
      padding: 25rpx;
      box-sizing: border-box;
      margin: 17.5rpx auto 0 auto;
      .tip {
        font-size: 21.25rpx;
        color: #DF2F1D;
        padding: 17.5rpx 0 15rpx 0;
      }
      .tip2 {
        color: #333333;
        font-size: 21.25rpx;
        font-weight: bold;
        margin-top: 15rpx;
        text {
          font-size: 27.5rpx;
        }
      }
      .p {
        margin-bottom: 12.5rpx;
      }
      .p:last-child {
        margin-bottom: 0;
      }
    }
  }
  @media screen and (max-width: 500px) and (min-width: 100px) {
    .container {
      .title {
        .icon-img {
          width: 96rpx;
          height: 4rpx;
          border-radius: 2px;
        }
        .span {
          font-size: 40rpx;
          margin: 0 26rpx;
        }
      }
      .box {
        width: 694rpx;
        font-size: 34rpx;
        line-height: 60rpx;
        border-radius: 20rpx;
        padding: 30rpx;
        margin: 26rpx auto 0 auto;
        .tip {
          font-size: 34rpx;
          padding: 28rpx 0 24rpx 0;
        }
        .tip2 {
          font-size: 34rpx;
          margin-top: 15rpx;
          text {
            font-size: 44rpx;
          }
        }
        .p {
          margin-bottom: 20rpx;
        }
      }
    }
  }
</style>