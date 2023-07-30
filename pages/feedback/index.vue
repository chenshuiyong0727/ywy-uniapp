<template>
  <view class="outter-container">
   
    <nav-bar title="意见反馈"></nav-bar>
   
    <view class="feed-back">
      <view class="t-c">
        <view class="top-text"
          >您是我们重要的用户，我们十分重视您的意见并且会尽快处理</view
        >
      </view>
      <view class="center center-c">
        <view class="question-text">
          <text class="red">*</text>
          <text>问题类型</text>
        </view>
        <view class="question-container">
          <view
            :class="[{ active: activeIndex === index }, 'question-item']"
            @click="activeItem(index)"
            v-for="(item, index) in questionArr"
            :key="index"
          >
            <text :class="[{ active: activeIndex === index }]">{{
              item.name
            }}</text>
          </view>
        </view>
      </view>
      <view class="divider"></view>
      <view class="bottom">
        <view class="desc-text">
          <text class="red">*</text>
          <text>问题描述</text>
        </view>
        <view class="textarea-container">
          <textarea
            maxlength="300"
            v-model="value"
            placeholder="请根据您所选的问题类型进行描述"
          ></textarea>
          <view class="length-container">{{ value.length }} / 300</view>
        </view>
        <view @click="submitQuestion" class="submit-button">
          <text>提交</text>
        </view>
      </view>
    </view>
    <!--侧边栏-->
    <fab v-if="isShowFab" :isOpenFabMenu="isPad ? true : false"></fab>
    <!--end 侧边栏-->
  </view>
</template>


<script>
import navBar from '@/components/nav-bar'
import fab from '@/components/fab'
import {mixin} from '@/mixin/mixin'
export default {
  mixins:[mixin],
  data() {
    return {
      questionArr: [],
      userInfo: {},
      value: '',
      activeIndex: 0,
      mpWexin: false,
      isPad: this.$pad
    }
  },
  components: {
    navBar,
    fab
  },
  onLoad() {
    const type = uni.getSystemInfoSync().uniPlatform
    if (type == 'mp-weixin') {
      this.mpWexin = true
    }
    this.userInfo = uni.getStorageSync('userInfo')
      ? JSON.parse(uni.getStorageSync('userInfo'))
      : {}
    this.$request(
      {
        url: '/gw/h5/v1/base/sys/dict/listSysDictFront',
        method: 'post',
        data: {
          token: this.userInfo.token,
        },
      },
      false
    ).then((res) => {
      if (res.status === 1000) {
        this.questionArr = res.data
          .filter((item) => item.typeValue === '45')
          .map((item) => {
            return {
              name: item.fieldName,
              value: item.fieldValue,
            }
          })
      }
    })
  },
  methods: {
    activeItem(index) {
      this.activeIndex = index
    },
    submitQuestion() {
      if (!this.value) {
        uni.showToast({
          title: '问题描述不能为空',
          icon: 'none',
        })
        return
      }
      this.$request(
        {
          url: '/gw/h5/v1/front/feedback',
          method: 'post',
          data: {
            detail: this.value,
            type: this.activeIndex + 1,
            token: this.userInfo.token,
          },
        },
        false
      ).then((res) => {
        if (res.status === 1000) {
          uni.showToast({
            title: '反馈成功',
            icon: 'success',
          })
          setTimeout(() => {
            uni.hideLoading()
            uni.switchTab({
              url: '/pages/my/index',
            })
          }, 1500)
        } else {
          uni.showToast({
            title: '反馈失败',
            icon: 'none',
          })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.feed-back {
  margin: 0 auto;
  max-width: 750rpx;
  max-height: 562.5rpx;
  .top-text {
    margin-left: 23.44rpx;
    margin-top: 19.04rpx;
    width: 474.61rpx;
    height: 24.17rpx;
    font-size: 17.58rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 24.17rpx;
    margin-bottom: 19.04rpx;
  }
  .center {
    height: 125.24rpx;
    background: #ffffff;
    margin-bottom: 6.59rpx;
    padding-left: 23.44rpx;
    text {
      display: inline-block;
      margin-top: 19.04rpx !important;
    }
    .red {
      color: #ff6363;
    }
    .question-container {
      margin-top: 15.38rpx;
      display: flex;
      .active {
        background: #E6FAF5 !important;
        color: #43C9A7 !important;
        font-weight: bold !important;
      }
      .question-item {
        margin-right: 24.9rpx;
        width: 135rpx;
        height: 47.61rpx;
        background: #f5f5f5;
        border-radius: 24.17rpx;
        line-height: 14rpx;
        text-align: center;
        text {
          width: 73.97rpx;
          font-size: 18.31rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
        }
      }
    }
  }
  .bottom {
    padding-left: 23.44rpx;
    padding-right: 23.44rpx !important;
    height: 323.73rpx;
    background: #ffffff;
    padding-bottom: 100rpx !important;
    .textarea-container {
      max-width: 703.13rpx;
      width: 671.94rpx;
      padding: 12.45rpx;
      margin-right: 23.44rpx;
      margin-top: 15.38rpx;
      height: 136.23rpx;
      background: #f5f5f5;
      border-radius: 10.99rpx;
      textarea {
        max-height: 300rpx !important;
        width: 100%;
        height: 100%;
      }
      .length-container {
        position: relative;
        color: #cccccc;
        text-align: right;
        bottom: 45rpx;
      }
    }
    text {
      display: inline-block;
      margin-top: 19.04rpx !important;
    }
    .red {
      color: #ff6363;
    }
    .input-container {
      margin-top: 15.38rpx;
      width: 741.94rpx;
      height: 136.23rpx;
      background: #f5f5f5;
      border-radius: 10.99rpx;
      input {
        width: 100%;
        height: 100%;
      }
    }
    .submit-button {
      margin-left: 219.73rpx;
      margin-top: 27.1rpx;
      width: 263.67rpx;
      text-align: center;
      height: 45.41rpx;
      background: #43C9A7;
      border-radius: 7.32rpx;
      line-height: 8.41rpx;
      text {
        width: 35.16rpx;
        height: 24.17rpx;
        font-size: 17.58rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
      }
    }
  }
}

@media screen and (max-width: 770px) and (min-width: 760px) {
  .textarea-container {
    width: 629.94rpx !important;
  }
}

@media screen and (max-width: 500px) and (min-width: 100px) {
  .divider {
    width: 100%;
    height: 16rpx !important;
    background: #f5f5f5 !important;
  }
  .t-c {
    padding-top: 24rpx !important;
    padding-left: 32rpx !important;
    background: #f5f5f5 !important;
    padding-bottom: 14rpx !important;
    height: 100%;
  }
  .outter-container {
    height: 100%;
    background-color: #fff;
  }
  .desc-text {
    margin-bottom: 40rpx !important;
    width: 136rpx !important;
    height: 42rpx !important;
    font-size: 30rpx !important;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: bold;
    color: #333333 !important;
    line-height: 42rpx !important;
  }
  .top-text {
    margin-left: 0 !important;
    margin-top: 0 !important;
    width: 676rpx !important;
    height: 80rpx !important;
    font-size: 28rpx !important;
    font-family: PingFangSC-Regular, PingFang SC !important;
    font-weight: 400 !important;
    color: #333333 !important;
    line-height: 40rpx !important;
    /* margin-left: 23.44rpx;
    margin-top: 29.04rpx !important;
    width: 694.61rpx !important;
    height: 44.17rpx !important;
    font-size: 23.58rpx !important;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 24.17rpx;
    margin-bottom: 19.04rpx; */
  }
  .center {
    height: 298rpx !important;
    background: #ffffff;
    margin-bottom: 6.59rpx;
    padding-left: 23.44rpx;
    text {
      display: inline-block;
      margin-top: 19.04rpx !important;
    }
    .question-text {
      margin-top: 40rpx !important;
      width: 136rpx;
      height: 42rpx;
      font-size: 30rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: bold;
      color: #333333;
      line-height: 42rpx;
      .red {
        color: #ff6363;
      }
    }
    .question-container {
      margin-top: 40rpx !important;
      display: flex;
      flex-wrap: wrap;
      .active {
        background: #f1ecf2 !important;
        color: #502459 !important;
        font-weight: bold !important;
      }
      .question-item {
        width: 196rpx !important;
        height: 72rpx !important;
        line-height: 32rpx !important;
        background: #f1ecf2;
        border-radius: 62rpx !important;
        /* margin-right: 24.9rpx;
        width: 173.78rpx !important;
        height: 60.61rpx !important;
        background: #f5f5f5;
        border-radius: 24.17rpx;
        line-height: 24rpx !important; */
        text-align: center;
        margin-bottom: 16rpx;
        text {
          width: 112rpx !important;
          height: 40rpx !important;
          font-size: 28rpx !important;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: bold;
          color: #666;
          line-height: 30rpx !important;
          /* width: 103.97rpx !important;
          font-size: 18.31rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400; */
        }
      }
    }
  }
  .bottom {
    padding-top: 15rpx !important;
    padding-left: 23.44rpx;
    padding-right: 23.44rpx !important;
    height: 80% !important;
    background: #ffffff;
    .textarea-container {
      max-width: 703.13rpx;
      width: 671.94rpx;
      padding-left: 22rpx !important;
      padding-top: 24rpx !important;
      margin-right: 23.44rpx;
      margin-top: 15.38rpx;
      height: 336.23rpx !important;
      background: #f5f5f5;
      border-radius: 10.99rpx;
      textarea {
        width: 100%;
      }
      .length-container {
        position: relative;
        color: #cccccc;
        text-align: right;
        right: 13rpx !important;
        bottom: 3rpx !important;
      }
    }
    text {
      display: inline-block;
      margin-top: 19.04rpx !important;
    }
    .red {
      color: #ff6363;
    }
    .input-container {
      margin-top: 15.38rpx;
      width: 741.94rpx;
      height: 136.23rpx;
      background: #f5f5f5;
      border-radius: 10.99rpx;
      input {
        width: 100%;
        height: 100%;
      }
    }
    .submit-button {
      margin-top: 76rpx !important;
      margin-left: 0 !important;
      width: 704rpx !important;
      height: 96rpx !important;
      background: #43C9A7 !important;
      border-radius: 12rpx !important;
      /* margin-left: 219.73rpx;
      margin-top: 27.1rpx !important;
      width: 263.67rpx;
      text-align: center;
      height: 65.41rpx !important;
      background: #502459;
      border-radius: 7.32rpx;
      line-height: 24.41rpx !important; */
      text {
        width: 68rpx !important;
        height: 48rpx !important;
        font-size: 34rpx !important;
        font-family: PingFangSC-Regular, PingFang SC !important;
        font-weight: 400 !important;
        color: #ffffff !important;
        line-height: 58rpx !important;
      }
    }
  }
}
</style>