<template>
  <view :class="[styles.paddingLeft ? 'tip-pad-left' : 'tip-pad-right' ,'tip-container']" 
    :style="{ left: leftPos + 'rpx', bottom: bottomPos + 'rpx', position: positionType, width: styles.width, height: styles.height, backgroundImage: 'url('+imgPrefix +'/static/operateSteps/'+styles.bgImgName+'.png)', backgroundSize: '100% 100%' }">
    <view class="content">
      <!-- <image v-if="isShowGesture" :class="['gesture-ani-'+gestureType, 'gesture']" :animation="animationData" :style="{ left: gestureLeftPos + 'rpx', top: gestureTopPos + 'rpx' }" :src="imgPrefix + '/static/operateSteps/gesture'+gestureType+'.png'"></image> -->
      <view v-if="isShowGesture" class="gesture" :style="{ left: gestureLeftPos + 'rpx', top: gestureTopPos + 'rpx' }">
        <view class="gesture-shadow">
          <image class="gesture-img" :src="imgPrefix + '/static/operateSteps/gesture'+gestureType+'.gif'"></image>
          <image :class="[gestureType == 2 ? 'shadow-img-2' : '' ,'shadow-img']" :src="imgPrefix + '/static/operateSteps/img-guid-shadow'+gestureType+'.png'"></image>
        </view>
      </view>
      <view class="type-1" :style="styles.specialPadding ? styles.specialPadding : ''">
        <view>
          <view class="title" v-if="guidContent.title">{{guidContent.title}}</view>
          <view class="list">
            <view v-for="(item, index) in guidContent.descList" :key="index">{{item}}</view>
          </view>
        </view>
        <view 
        :class="[styles.paddingLeft ? 'guid-close-left' : 'guid-close-right', 'guid-close']" 
        @click="closeGuidHandle"
        :style="styles.closePos ? styles.closePos : ''">
        <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/guid-close.png'"></image>
      </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    props: {
      leftPos: {
        type: Number,
        default: 0
      },
      bottomPos: {
        type: Number,
        default: 0
      },
      gestureLeftPos: {
        type: Number,
        default: 0
      },
      gestureTopPos: {
        type: Number,
        default: 0
      },
      guidContent: {
        type: Object,
        default: () => {}
      },
      gestureType: {
        type: Number,
        default: 1
      },
      isShowGesture: {
        type: Boolean,
        default: true
      },
      positionType: {
        type: String,
        default: 'absolute'
      },
      styles: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        animationData: {},
        imgPrefix: this.$imgPrefix
      }
    },
    methods: {
      closeGuidHandle() {
        this.$emit('closeGuidHandle')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tip-container {
    width: 367.03rpx;
    font-size: 14.65rpx;
    color: #333;
    font-weight: bold;
    box-sizing: border-box;
    position: absolute;
    bottom: -100rpx;
    z-index: 10;
    .content {
      position: relative;
      text-align: left;
      .gesture {
        width: 87.18rpx;
        height: 87.18rpx;
        position: absolute;
        top: -36.63rpx;
        left: 0rpx;
        .gesture-shadow {
          position: relative;
          .gesture-img {
            width: 87.18rpx;
            height: 87.18rpx;
            position: relative;
            z-index: 2;
          }
          .shadow-img {
            width: 96.7rpx;
            height: 96.7rpx;
            position: absolute;
            right: -10rpx;
            bottom: 0;
          }
        }
        
      }
      
      // .gesture-ani-1 {
      //   animation:mymove 1s infinite alternate;
      // }
      // .gesture-ani-2 {
      //   animation:mymove2 1s infinite alternate;
      // }
      // .gesture-ani-3 {
      //   animation:mymove3 1s infinite alternate;
      // }
      // .gesture-ani-4 {
      //   animation:mymove4 1s infinite alternate;
      // }
      // .gesture-ani-6 {
      //   width: 123.81rpx;
      //   height: 123.81rpx;
      //   animation:mymove6 1s infinite alternate;
      // }
      // @keyframes mymove {
      //   from {
      //     transform: translate(0, 0);
      //   }
      //   to {
      //     transform: translate(30rpx, 30rpx);
      //   }
      // }
      // @-webkit-keyframes mymove {
      //   from {
      //     transform: translate(0, 0);
      //     -webkit-transform: translate(0, 0);
      //   }
      //   to {
      //     transform: translate(30rpx, 30rpx);
      //     -webkit-transform: translate(30rpx, 30rpx);
      //   }
      // }
      // @keyframes mymove2 {
      //   from {
      //     transform: translate(0, 0);
      //   }
      //   to {
      //     transform: translate(-40rpx, 20rpx);
      //   }
      // }
      // @-webkit-keyframes mymove2 {
      //   from {
      //     transform: translate(0, 0);
      //     -webkit-transform: translate(0, 0);
      //   }
      //   to {
      //     transform: translate(-40rpx, 20rpx);
      //     -webkit-transform: translate(-40rpx, 20rpx);
      //   }
      // }
      // @keyframes mymove3 {
      //   from {
      //     transform: translate(0, 0);
      //   }
      //   to {
      //     transform: translate(-40rpx, -20rpx);
      //   }
      // }
      // @-webkit-keyframes mymove3 {
      //   from {
      //     transform: translate(0, 0);
      //     -webkit-transform: translate(0, 0);
      //   }
      //   to {
      //     transform: translate(-40rpx, -20rpx);
      //     -webkit-transform: translate(-40rpx, -20rpx);
      //   }
      // }
      // @keyframes mymove4 {
      //   from {
      //     transform: translate(0, 0);
      //   }
      //   to {
      //     transform: translate(40rpx, -20rpx);
      //   }
      // }
      // @-webkit-keyframes mymove4 {
      //   from {
      //     transform: translate(0, 0);
      //     -webkit-transform: translate(0, 0);
      //   }
      //   to {
      //     transform: translate(-40rpx, -20rpx);
      //     -webkit-transform: translate(-40rpx, -20rpx);
      //   }
      // }
      // @keyframes mymove6 {
      //   from {
      //     transform: translate(0, 0);
      //   }
      //   to {
      //     transform: translate(0rpx, -40rpx);
      //   }
      // }
      // @-webkit-keyframes mymove6 {
      //   from {
      //     transform: translate(0, 0);
      //     -webkit-transform: translate(0, 0);
      //   }
      //   to {
      //     transform: translate(0rpx, -40rpx);
      //     -webkit-transform: translate(0rpx, -40rpx);
      //   }
      // }
      .type-1 {
        display: flex;
        position: relative;
        .guid-close {
          padding: 15rpx 15rpx 0 15rpx;
          position: absolute;
          bottom: 5rpx;
          opacity: 0;
          image {
            width: 51.28rpx;
            height: 21.98rpx;
          }
        }
        .guid-close-left {
          right: -65.28rpx;
        }
        .guid-close-right {
          left: -75rpx;
          bottom: 0rpx;
        }
      }
      .title {
        // width: 241.76rpx;
        font-size: 16.85rpx;
        padding-bottom: 8.79rpx;
        visibility: hidden;
      }
      .list {
        // width: 241.76rpx;
        font-size: 18rpx;
        font-weight: bold;
        margin-bottom: 9.52rpx;
        visibility: hidden;
        &>view {
          position: relative;
          padding-bottom: 7.33rpx;
          line-height: 27.11rpx;
          &:last-child {
            padding-bottom: 0;
          }
        }
      }
    }
  }
  .tip-pad-left {
    padding: 45rpx 70rpx 0 21.98rpx;
  }
  .tip-pad-right {
    padding: 40rpx 21.98rpx 0 70rpx;
  }
  
  @media screen and (max-width: 500px) {
    .tip-container {
      width: 452rpx;
      font-size: 28rpx;
      
      .content {
        .gesture {
          width: 140rpx;
          height: 140rpx;
          position: absolute;
          
          .gesture-shadow {
            .gesture-img {
              width: 140rpx;
              height: 140rpx;
            }
            .shadow-img {
              width: 140rpx;
              height: 140rpx;
            }
            .shadow-img-2 {
              right: 0;
            }
          }
        }
        .type-1 {
          .guid-close {
            padding: 15rpx 15rpx 0 15rpx;
            position: absolute;
            bottom: 10rpx;
            image {
              width: 86rpx;
              height: 42rpx;
            }
          }
          .guid-close-left {
            right: -115rpx;
          }
          .guid-close-right {
            left: -120rpx;
            bottom: 0rpx;
          }
        }
        .title {
          // width: 390rpx;
          font-size: 26rpx;
          padding-bottom: 12rpx;
        }
        .list {
          // width: 390rpx;
          font-size: 28rpx;
          font-weight: bold;
          margin-bottom: 20rpx;
          &>view {
            padding-bottom: 14rpx;
            line-height: 42rpx;
            &:last-child {
              padding-bottom: 0;
            }
          }
        }
      }
    }
    .tip-pad-left {
      padding: 88rpx 140rpx 0 50rpx;
    }
    .tip-pad-right {
      padding: 88rpx 30rpx 0 145rpx;
    }
  }
</style>