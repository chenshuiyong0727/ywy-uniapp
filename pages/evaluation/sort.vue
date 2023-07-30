<template>
  <view>
   
    <nav-bar title='认知障碍筛查'></nav-bar>
   
    <view :class="[isPad ? '': 'mobile-container','container']">
      <view class="title">为了筛查更加准确，请选择</view>
      <view class="question">
        <view class="item">
          <view class="_h6">
            <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/sort-birthday.png'"></image>
            <view>出生年份</view>
          </view>
          <view class="option">
            <view class="error-content" v-if="birthdayError">{{birthdayErrorContent}}</view>
            <view :class="['birthday', 'box', 'select-icon', birthdayError ? 'error-style' : '']">
              <view :class="[birthday ? '' : '_picker-holder', '_picker']">
                <view class="uni-input" @click="showPicker('date', birthday)">{{ birthday || '请选择出生日期' }}</view>
              </view>
            </view>
          </view>
        </view>

        <view class="item">
          <view class="_h6">
            <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/sort-education.png'"></image>
            <view>教育程度</view>
          </view>
          <view class="option">
            <view class="error-content" v-if="eduValueError">{{eduValueErrorContent}}</view>
            <view :class="['birthday', 'box', 'select-icon', eduValueError ? 'error-style' : '']">
              <view :class="[education ? '' : '_picker-holder', '_picker']">
                <view class="uni-input" @click="showPicker('selector', education)">{{ education || '请选择学历' }}</view>
              </view>
            </view>
          </view>
        </view>
        <view class="next-content">
          <view class="cancel" @click="goHome">以后筛查</view>
          <view class="next-first" @click="nextHandle">下一步</view>
        </view>
      </view>
    </view>
    <picker-custom v-if="isShowCustomPicker" :isOnlyShowYear="true" :currentPickerValue="currentPickerValue" :mode="mode" :range="range" :range-key="rangKey" :default-index="defaultValueIndex" @getDateValue="getDateValue" @getSelectorValue="getSelectorValue" @closePicker="closePicker"></picker-custom>
    <!--侧边栏-->
    <fab v-if="isShowFab" :isOpenFabMenu="isPad ? true : false"></fab>
    <!--end 侧边栏-->
  </view>
</template>

<script>
  import fab from '@/components/fab'
  import navBar from '@/components/nav-bar'
  import pickerCustom from '@/components/common-page/picker-custom'
  import { navigateTo } from '@/utils/util'
  import {mixin} from '@/mixin/mixin'
  export default {
    mixins:[mixin],
    components: {
      navBar,
      pickerCustom,
      fab
    },
    data() {
      return {
        birthday: '',
        birthdayError: false,
        birthdayErrorContent: '',
        education: '',
        eduValue: -1,
        eduValueError: false,
        eduValueErrorContent: '',
        userInfo: {},
        eduArr: [],
        tipArr: new Array(2),
        isPad: this.$pad,
        isShowCustomPicker: false,
        mode: '',
        range: [],
        rangKey: '',
        defaultValueIndex: 0,
        payOrderId: '',
        currentPickerValue: '',
        imgPrefix: this.$imgPrefix
      }
    },
    onLoad(options) {
      if (options.payOrderId) {
        this.payOrderId = options.payOrderId
      }
    },
    mounted() {
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
      this.getEducationList()
      this.initData()
    },
    methods: {
      getEducationList() {
        this.$request({
          url: '/gw/op/v1/base/sys/dict/listSysDict',
          method: 'post',
          data: {
            token: this.userInfo.token
          }
        }, false).then(res => {
          if (res.status === 1000) {

            this.eduArr = res.data.filter((item) => item.typeValue === '3002').map((item) => {
              return {
                name: item.fieldName,
                value: item.fieldValue
              }
            })
            let arr = this.eduArr.filter(item => item.value == this.userInfo.info.education)
            this.education = arr.length ? arr[0].name : ''
            this.eduValue = arr.length ? arr[0].value : ''
          }
        })
      },
      initData() {
        if (this.userInfo.info && this.userInfo.info.birthYear) {
          // this.birthday = this.userInfo.info.birthDate ? this.userInfo.info.birthDate : ''
          this.birthday = this.userInfo.info.birthYear ? this.userInfo.info.birthYear : ''
          // this.showAgeValue = this.birthday
        }
      },
      nextHandle() {
        if (!this.birthday) {
          this.birthdayErrorContent = '*请选择出生年份'
          return this.birthdayError = true
        } else if (!this.eduValue || this.eduValue < 0) {
          this.eduValueErrorContent = '*请选择受教育程度'
          return this.eduValueError = true
        }
        this.$request({
          url: '/gw/h5/v1/front/user/update',
          method: 'put',
          data: {
            token: this.userInfo.token,
            // birthDate: this.birthday,
            birthYear: this.birthday,
            education: this.eduValue
          }
        }).then(res => {
          if (res.status === 1000) {
            this.userInfo.info.birthYear = this.birthday
            this.userInfo.info.education = this.eduValue
            this.userInfo.refreshToken = res.data.refreshToken
            this.userInfo.token = res.data.token
            this.userInfo.tokenExpireTime = res.data.tokenExpireTime
            uni.setStorageSync('userInfo', JSON.stringify(this.userInfo))
            // navigateTo('/pages/evaluation/result')
            // 跳转研一系统
            this.goEvaluation(this.payOrderId)
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      goEvaluation(payOrderId = '') {
        getApp().goEvalution({
          token: this.userInfo.token,
          requestType: 1,
          payOrderId: payOrderId ? payOrderId : this.payOrderId,
          backType: 2
        }, false)
      },
      showPicker(mode, currentValue='') {
        this.mode = mode
        if (mode == 'selector') {
          this.range = this.eduArr
          this.rangKey = 'name'
          this.defaultValueIndex = 5
        }
        this.currentPickerValue = currentValue
        this.isShowCustomPicker = true
      },
      closePicker() {
        this.isShowCustomPicker = false
      },
      getDateValue(e) {
        this.birthdayError = false
        this.birthday = e
        this.isShowCustomPicker = false
      },
      getSelectorValue(e) {
        this.eduValueError = false
        this.education = this.eduArr[e].name
        this.eduValue = this.eduArr[e].value
        this.isShowCustomPicker = false
      },
      goHome() {
        navigateTo('/pages/index/index')
      }
    }
  }
</script>

<style lang="scss" scoped>
  page {
    background-color: #fff;
  }
  .container {
    width: 100%;
    max-width: 750rpx;
    box-sizing: border-box;
    font-size: 20rpx;
    color: #333;
    overflow: hidden;
    margin: 0 auto;
    min-height: calc(100vh - 50rpx);
    .title {
      font-size: 25rpx;
      color: #333;
      font-weight: bold;
      text-align: center;
      padding: 57.5rpx 0 55rpx 0;
    }

    .question {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .item {
        margin-bottom: 50rpx;
        .option {
          position: relative;
          .error-content {
            position: absolute;
            height: 25rpx;
            line-height: 25rpx;
            color: #D72525;
            bottom: -40rpx;
            left: 0rpx;
            font-size: 17.5rpx;
            font-weight: 400;
          }
        }
      }
      ._h6 {
        display: flex;
        align-items: center;
        font-size: 20rpx;
        margin-bottom: 10rpx;
        image {
          width: 25rpx;
          height: 25rpx;
          margin-right: 6.25rpx;
        }
      }

      .box {
        width: 407.5rpx;
        height: 60rpx;
        padding: 0 15rpx;
        box-sizing: border-box;
        // border-bottom: 1px solid #1A1A1A;
        border: 1px solid #333;
        border-radius: 8rpx;
        ._picker {
          width: 341.71rpx;
          height: 60rpx;
          line-height: 60rpx;
          font-size: 22.5rpx;

          .uni-input {
            width: 100%;
            height: 100%;
          }
        }

        ._picker-holder {
          color: #ccc;
        }
      }
      .error-style {
        border: 1px solid #FC6666;
      }

      .select-icon {
        position: relative;

        &::after {
          content: '';
          width: 10rpx;
          height: 10rpx;
          border-top: 2px solid #999;
          border-right: 2px solid #999;
          position: absolute;
          top: 45%;
          right: 18.75rpx;
          transform: translateY(-50%) rotate(45deg);
        }
      }
      .next-content {
        display: flex;
        align-items: center;
        margin-top: 29.3rpx;
        .next-first {
          width: 255rpx;
          height: 45.41rpx;
          border-radius: 7.32rpx;
          background-color: #43C9A7;
          text-align: center;
          line-height: 45.41rpx;
          font-size: 17.58rpx;
          color: #fff;
        }
        .cancel {
          font-size: 21.25rpx;
          color: #43C9A7;
          text-decoration: underline;
          margin: 0 35rpx 0 30rpx;
        }
      }
      
    }
  }
  
  @media screen and (max-width: 500px) {
    .container {
      max-width: 750rpx;
      background-color: #fff;
      min-height: calc(100vh - 92rpx);
      .title {
        font-size: 40rpx;
        padding: 136rpx 0 0rpx 0;
      }
    
      .question {
        margin-top: 90rpx;
        
        .item {
          margin-bottom: 80rpx;
          .option {
            .error-content {
              height: 25rpx;
              line-height: 25rpx;
              color: #D72525;
              bottom: -50rpx;
              left: 0rpx;
              font-size: 17.5rpx;
              font-weight: 400;
            }
          }
        }
        ._h6 {
          font-size: 32rpx;
          margin-bottom: 0rpx;
          margin-bottom: 20rpx;
          image {
            width: 40rpx;
            height: 40rpx;
            margin-right: 10rpx;
          }
        }
    
        .box {
          width: 652rpx;
          height: 96rpx;
          padding: 0 24rpx;
          ._picker {
            width: 590rpx;
            height: 96rpx;
            line-height: 96rpx;
            font-size: 36rpx;
          }
        }
    
        .select-icon {
          &::after {
            width: 15rpx;
            height: 15rpx;
            right: 24rpx;
          }
        }
        
        .next-content {
          display: flex;
          align-items: center;
          margin-top: 60rpx;
          font-weight: bold;
          .next-first {
            width: 408rpx;
            height: 92rpx;
            line-height: 92rpx;
            font-size: 34rpx;
          }
          .cancel {
            // width: 234rpx;
            // height: 92rpx;
            // line-height: 92rpx;
            // text-align: center;
            
            // font-size: 34rpx;
            // color: #333;
            // text-decoration: none;
            // margin: 0 8rpx 0 0rpx;
            // box-sizing: border-box;
            // border-radius: 12rpx;
            font-size: 34rpx;
            margin: 0 56rpx 0 52rpx;
            font-weight: normal;
          }
        }
      }
    }
  }
</style>
