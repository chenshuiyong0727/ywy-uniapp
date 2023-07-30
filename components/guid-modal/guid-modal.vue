<template>
  <view
    class="tip-container"
    :style="{
      left: leftPos + 'rpx',
      bottom: bottomPos + 'rpx',
      position: positionType,
      width: width + 'px',
      height: height + 'px',
    }"
  >
    <view class="content">
      <image
        v-if="isShowGesture"
        :class="['gesture-ani-' + gestureType, 'gesture']"
        :animation="animationData"
        :style="{ left: gestureLeftPos + 'rpx', top: gestureTopPos + 'rpx' }"
        :src="imgPrefix + '/static/operateSteps/portalH5/pages/gesture' + gestureType + '.png'"
      ></image>
      <div class="flex-box">
        <image
          class="left-img"
          :src="imgPrefix + '/static/operateSteps/portalH5/pages/renwu.png'"
        ></image>
        <view
          class="title"
          >{{ title }}</view
        >
      </div>
      <!-- <view class="list">
        <view v-for="(item, index) in guidContent.descList" :key="index">{{
          item
        }}</view>
      </view> -->
      <view
        :class="[
          (isShowCloseBtn && !isShowNextBtn) ||
          (!isShowCloseBtn && isShowNextBtn)
            ? 'btn-center'
            : '',
          'button-group',
        ]"
      >
        <view class="close" v-if="isShowCloseBtn" @click.stop="closeHandle"
          >退出引导</view
        >
        <view class="next" v-if="isShowNextBtn" @click.stop="nextHandle"
          >知道了</view
        >
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    },
    leftPos: {
      type: Number,
      default: 0,
    },
    bottomPos: {
      type: Number,
      default: 0,
    },
    gestureLeftPos: {
      type: Number,
      default: 0,
    },
    gestureTopPos: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: '',
    },
    gestureType: {
      type: Number,
      default: 1,
    },
    isShowGesture: {
      type: Boolean,
      default: true,
    },
    isShowNextBtn: {
      type: Boolean,
      default: true,
    },
    isShowCloseBtn: {
      type: Boolean,
      default: true,
    },
    positionType: {
      type: String,
      default: 'absolute',
    },
  },
  data() {
    return {
      animationData: {},
      imgPrefix: this.$imgPrefix,
    }
  },
  mounted() {
    // let animation = uni.createAnimation({
    //   duration: 1000,
    //   timingFunction: 'ease',
    // })
    // this.animation = animation
    // animation.translate(30, 30).step()
    // this.animationData = animation.export()
  },
  methods: {
    closeHandle() {
      this.$emit('closeHandle')
    },
    nextHandle() {
      this.$emit('nextHandle')
    },
  },
}
</script>

<style lang="scss" scoped>
.flex-box {
}
.tip-container {
  border-radius: 8.79rpx;
  background-color: #336cea;
  font-size: 14.65rpx;
  color: #fff;
  font-weight: bold;
  padding: 10.26rpx 11.72rpx;
  box-sizing: border-box;
  position: relative;
  bottom: -100rpx;
  z-index: 9;
  .content {
    position: relative;
    .gesture {
      width: 54.95rpx;
      height: 67.4rpx;
      position: absolute;
      top: -36.63rpx;
      left: 0rpx;
    }

    .gesture-ani-1 {
      animation: mymove 1s infinite alternate;
    }
    .gesture-ani-2 {
      animation: mymove2 1s infinite alternate;
    }
    .gesture-ani-3 {
      animation: mymove3 1s infinite alternate;
    }
    @keyframes mymove {
      from {
        transform: translate(0, 0);
      }
      to {
        transform: translate(30rpx, 30rpx);
      }
    }
    @-webkit-keyframes mymove {
      from {
        transform: translate(0, 0);
        -webkit-transform: translate(0, 0);
      }
      to {
        transform: translate(30rpx, 30rpx);
        -webkit-transform: translate(30rpx, 30rpx);
      }
    }
    @keyframes mymove2 {
      from {
        transform: translate(0, 0);
      }
      to {
        transform: translate(-40rpx, 20rpx);
      }
    }
    @-webkit-keyframes mymove2 {
      from {
        transform: translate(0, 0);
        -webkit-transform: translate(0, 0);
      }
      to {
        transform: translate(-40rpx, 20rpx);
        -webkit-transform: translate(-40rpx, 20rpx);
      }
    }
    @keyframes mymove3 {
      from {
        transform: translate(0, 0);
      }
      to {
        transform: translate(-40rpx, -20rpx);
      }
    }
    @-webkit-keyframes mymove3 {
      from {
        transform: translate(0, 0);
        -webkit-transform: translate(0, 0);
      }
      to {
        transform: translate(-40rpx, -20rpx);
        -webkit-transform: translate(-40rpx, -20rpx);
      }
    }
    .img {
      width: 109.16rpx;
      height: 150.18rpx;
      position: absolute;
      right: -30rpx;
      top: -60.93rpx;
    }
    .left-img {
      width: 109.16rpx;
      height: 150.18rpx;
      position: absolute;
      left: -30rpx;
      bottom: 50rpx;
    }
    .title {
      margin-right: 10rpx;
      margin-left: 100rpx;
      font-size: 31rpx;
      width: auto;
      padding-bottom: 8.79rpx;
      line-height: 44rpx;
    }
    .list {
      width: 263.74rpx;
      font-size: 19.05rpx;
      font-weight: bold;
      margin-bottom: 9.52rpx;
      min-height: 58.61rpx;
      & > view {
        position: relative;
        padding-left: 14.65rpx;
        padding-bottom: 7.33rpx;
        &::before {
          content: '';
          width: 5.13rpx;
          height: 5.13rpx;
          border-radius: 50%;
          background-color: #fff;
          position: absolute;
          top: 10.99rpx;
          left: 0;
        }
        &:last-child {
          padding-bottom: 0;
        }
      }
    }
    .button-group {
      display: flex;
      justify-content: space-between;
      & > view {
        background: #b0e9ff;
        border-radius: 4.4rpx;
        width: 99.77rpx;
        height: 33.7rpx;
        text-align: center;
        font-size: 19.05rpx;
        font-weight: bold;
        color: #336cea;
        border: 1px solid #b0e9ff;
        line-height: 33.7rpx;
        margin-right: 7.33rpx;
        box-shadow: border-box;
      }
      & > view:nth-child(1) {
        background-color: #336cea;
        color: #87deff;
      }
    }
    .btn-center {
      justify-content: center;
    }
  }
}
</style>