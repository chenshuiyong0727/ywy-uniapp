<template>
  <view>
    <nav-bar class="title-container" title="完善信息"></nav-bar>

    <view class="improve-container">
      <view class="inner-container">
        <view class="info-item name">
          <view class="real-name">姓名</view>
          <view class="name-container">
            <input
              class="input-text"
              placeholder-style="color: #C9C9C9"
              v-model="realName"
              placeholder="请填写姓名"
            />
          </view>
        </view>
        <view class="info-item sex">
          <view class="sex-name">性别</view>
          <view class="select-container" v-if="!isPad">
            <uni-data-select
              class="select-picker"
              v-model="gender"
              :localdata="range1"
              @change="change"
              label="应用选择"
            ></uni-data-select>
          </view>
          <view v-if="isPad" class="sex-right">
            <radio-group @change="sexChange">
              <label class="radio"
                ><radio
                  class="radio-button"
                  value="0"
                  :checked="gender == 0 ? true : false"
                  color="#43C9A7"
                /><text :class="[{ active: gender == 0 }, 'male']"
                  >男</text
                ></label
              >
              <label class="radio"
                ><radio
                  class="radio-button"
                  value="1"
                  :checked="gender == 1 ? true : false"
                  color="#43C9A7"
                /><text :class="[{ active: gender == 1 }, 'female']"
                  >女</text
                ></label
              >
            </radio-group>
          </view>
        </view>
        <view class="info-item birthday">
          <view class="birthday-name">出生日期</view>
          <view class="birthday-right">
            <!-- <view class="uni-input" @click="showPicker('date')">{{ businessParams.birthDay || '请选择出生日期' }}</view> -->
            <view class="picker" @click="showPicker('date', birthday)">
              <view v-if="birthday" class="birthday-text">{{ birthday }}</view>
              <view v-else class="select-birth">请选择出生日期</view>
            </view>
          </view>
        </view>
        <view class="info-item educate">
          <view class="educate-name">学历</view>
          <view class="educate-right">
            <view @click="showPicker('selector')" class="picker">
              <view v-if="selectEducate" class="educate-text">{{
                educatateValue
              }}</view>
              <view v-else class="select-educate">请选择您的学历</view>
            </view>
          </view>
        </view>
        <view class="info-item phone">
          <view class="phone-name">手机号码</view>
          <view class="phone-container">
            <input
              :disabled="phoneNumber"
              maxlength="11"
              type="number"
              class="phone-right"
              placeholder-style="color: #C9C9C9"
              placeholder="请输入您的手机号码"
              v-model="phoneNumber"
            />
          </view>
        </view>
        <!-- <view class="info-item code">
          <view class="code-name">邀请码</view>
          <view class="code-container">
            <input
              :disabled="canEditCode"
              placeholder-style="color: #C9C9C9"
              class="code-right"
              maxlength="4"
              placeholder="合作企业用户可填写 (选填)"
              v-model="code"
            />
          </view>
        </view> -->
        <view @click="submitInfo" class="button-wrapper">
          <text>提交</text>
        </view>
      </view>
    </view>
    <picker-custom
      v-if="isShowCustomPicker"
      :currentPickerValue="currentPickerValue"
      :mode="mode"
      :range="range"
      :range-key="rangKey"
      :default-index="defaultValueIndex"
      @getDateValue="getDateValue"
      @getSelectorValue="getSelectorValue"
      @closePicker="closePicker"
    ></picker-custom>
    <!--侧边栏-->
    <fab v-if="isShowFab" :isOpenFabMenu="isPad ? true : false"></fab>
    <!--end 侧边栏-->
  </view>
</template>


<script>
import fab from '@/components/fab'
import {mixin} from '@/mixin/mixin'
function getNowFormatDate() {
  var date = new Date()
  var seperator1 = '-'
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (day >= 0 && day <= 9) {
    day = '0' + day
  }
  var currentdate = year + seperator1 + month + seperator1 + day
  return currentdate
}

import navBar from '@/components/nav-bar'
import pickerCustom from '@/components/common-page/picker-custom'
export default {
  mixins: [mixin],
  data() {
    return {
      currentPickerValue: '',
      mode: 'selector',
      rangKey: '',
      isShowCustomPicker: false,
      range1: [
        {
          value: 0,
          text: '男',
        },
        { value: 1, text: '女' },
      ],
      range: [],
      isPad: this.$pad,
      canEditCode: false,
      userInfo: '',
      realName: '',
      gender: null,
      birthday: '',
      selectEducate: '', // 选的是哪个教育经历的下标
      educatateValue: '', // 学历对应的value值
      educationList: [],
      phoneNumber: '',
      code: '',
      infoRes: {},
      endDate: getNowFormatDate(),
      mpWexin: false,
      defaultValueIndex: 0
    }
  },
  components: {
    navBar,
    pickerCustom,
    fab
  },
  async onLoad() {
    const type = uni.getSystemInfoSync().uniPlatform
    if (type == 'mp-weixin') {
      this.mpWexin = true
    }
    this.userInfo = uni.getStorageSync('userInfo')
      ? JSON.parse(uni.getStorageSync('userInfo'))
      : {}
    await this.$request({
      url: '/gw/h5/v1/front/user/getUcUser',
      method: 'post',
      data: {
        token: this.userInfo.token,
      },
    }).then((res) => {
      this.infoRes = res.data
      this.realName = res.data.userRealName
      this.gender = res.data.gender
      this.birthday = res.data.birthDate ? res.data.birthDate : ''
      this.code = res.data.promoteCode
      this.phoneNumber = res.data.userMobile
      if (this.code) {
        this.canEditCode = true
      }
    })
    this.getEducationList()
  },
  methods: {
    showPicker(mode, currentValue='') {
      this.mode = mode
      if (mode == 'selector') {
        this.range = this.educationList
        this.rangKey = 'name'
        this.defaultValueIndex = 5
      }
      this.currentPickerValue = currentValue
      this.isShowCustomPicker = true
    },
    getSelectorValue(e) {
      console.log(e)
      this.educatateValue = this.educationList[e].name
      this.selectEducate = this.educationList[e].value
      this.isShowCustomPicker = false
    },
    closePicker() {
      this.isShowCustomPicker = false
    },
    getDateValue(e) {
      this.birthday = e
      this.isShowCustomPicker = false
    },
    change() {
      console.log('123')
    },
    confirmEducate(e) {
      this.educatateValue = e.text
    },
    submitInfo() {
      this.$request(
        {
          url: '/gw/h5/v1/front/user/update',
          method: 'put',
          data: {
            name: this.realName,
            sex: this.gender,
            birthDate: this.birthday,
            education: this.selectEducate,
            phone: this.phoneNumber,
            promoteCode: this.code,
            token: this.userInfo.token,
          },
        },
        false
      ).then((res) => {
        console.log('res.sub_msg', res.sub_msg)
        if (res.status === 1000) {
          this.$request({
            url: '/gw/h5/v1/front/user/getUcUser',
            method: 'post',
            data: {
              token: this.userInfo.token,
            },
          })
            .then((res2) => {
              this.userInfo = { ...this.userInfo, ...res.data, info: res2.data }
              uni.setStorageSync('userInfo', JSON.stringify(this.userInfo))
            })
            .catch((e) => {
              console.log('e', e)
            })
          uni.showToast({
            title: '提交成功',
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
            title: res.msg,
            icon: 'none',
          })
        }
      })
    },
    sexChange(e) {
      this.gender = e.detail.value
    },
    bindDateChange() {},
    confirmChange(e) {
      this.birthday = e.text
    },
    getEducationList() {
      this.$request(
        {
          url: '/gw/op/v1/base/sys/dict/listSysDict',
          method: 'post',
          data: {
            token: this.userInfo.token,
          },
        },
        false
      ).then((res) => {
        this.educationList = res.data
          .filter((item) => item.typeValue === '3002')
          .map((item) => {
            return {
              name: item.fieldName,
              value: item.fieldValue,
            }
          })
        this.educatateValue = this.educationList?.filter(
          (item) => item.value == this.infoRes.education
        )[0]?.name
        this.selectEducate = this.educationList?.filter(
          (item) => item.value == this.infoRes.education
        )[0]?.value
      })
    },
    educationChange(e, array) {
      this.educatateValue = array[e.value].name
      console.log(this.educatateValue)
      console.log(this.educationList)
      const filterItem = this.educationList?.filter((item) => {
        return item.name == this.educatateValue
      })
      // console.log(first)
      this.selectEducate = Number(filterItem[0].value)
      console.log('this', this.selectEducate)
      // console.log('this', typeof this.selectEducate)
    },
  },
}
</script>

<style lang="scss" scoped>
.uni-input-placeholder {
  overflow: initial !important;
}

.title-container {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 99999;
}
.app-title {
  position: fixed;
  top: 40rpx;
  right: 0;
  left: 0;
  z-index: 99999;
}
.active {
  color: #43C9A7 !important;
}
.improve-container {
  margin-top: 40rpx;
  padding: 18.31rpx 12.45rpx;
  .inner-container {
    margin: 0 auto;
    // max-width: 726.56rpx;
    max-height: 465.82rpx;
    overflow: hidden;
    margin-top: 60rpx;
    padding-left: 21.97rpx;
    padding-right: 21.97rpx;
    padding-top: 21.97rpx;
    // height: 491.46rpx;
    background: #ffffff;
    border-radius: 15.38rpx;
  }
  .info-item {
    display: flex;
  }
  .name {
    height: 40.65rpx;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    .real-name {
      width: 68.12rpx;
      height: 23.44rpx;
      font-size: 16.85rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 23.44rpx;
      margin-right: 34.42rpx;
    }
    input {
      width: 70%;
      height: 23.44rpx;
      font-size: 16.85rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 23.44rpx;
    }
  }
  .sex {
    margin-top: 100px;
    height: 40.65rpx;
    margin-top: 21.97rpx;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    .sex-name {
      width: 68.12rpx;
      height: 23.44rpx;
      font-size: 16.85rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 23.44rpx;
      margin-right: 34.42rpx;
    }
    .sex-right {
      width: 70%;
      height: 23.44rpx;
      font-size: 16.85rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #c9c9c9;
      line-height: 23.44rpx;
      .radio-button {
        margin-right: 3.46rpx;
      }
      .male {
        margin-right: 33.69rpx;
        font-size: 16.85rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 23.44rpx;
      }
      .female {
        font-size: 16.85rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 23.44rpx;
      }
    }
  }
  .birthday {
    height: 40.65rpx;
    margin-top: 21.97rpx;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    .birthday-name {
      width: 68.12rpx;
      height: 23.44rpx;
      font-size: 16.85rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 23.44rpx;
      margin-right: 34.42rpx;
    }
    .birthday-right {
      width: 70%;
      height: 23.44rpx;
      font-size: 16.85rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #c9c9c9;
      line-height: 23.44rpx;
      .birthday-text {
        color: #333333;
      }
      .select-birth {
        color: #c9c9c9;
      }
    }
  }
  .educate {
    height: 40.65rpx;
    margin-top: 21.97rpx;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    .educate-name {
      width: 68.12rpx;
      height: 23.44rpx;
      font-size: 16.85rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 23.44rpx;
      margin-right: 34.42rpx;
    }
    .educate-right {
      width: 70%;
      height: 23.44rpx;
      font-size: 16.85rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #c9c9c9;
      line-height: 23.44rpx;
      .educate-text {
        color: #333333;
      }
      .select-educate {
        color: #c9c9c9;
      }
    }
  }
  .phone {
    height: 40.65rpx;
    margin-top: 21.97rpx;
    // border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    .phone-name {
      width: 68.12rpx;
      height: 23.44rpx;
      font-size: 16.85rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 23.44rpx;
      margin-right: 34.42rpx;
    }
    .phone-right {
      width: 500rpx;
      height: 23.44rpx;
      font-size: 16.85rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 23.44rpx;
    }
  }
  .code {
    height: 40.65rpx;
    margin-top: 21.97rpx;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    .code-name {
      width: 68.12rpx;
      height: 23.44rpx;
      font-size: 16.85rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 23.44rpx;
      margin-right: 34.42rpx;
    }
    input {
      width: 500rpx;
      height: 23.44rpx;
      font-size: 16.85rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 23.44rpx;
    }
  }
  .button-wrapper {
    margin: 36.62rpx auto;
    width: 278.32rpx;
    height: 45.41rpx;
    line-height: 45.41rpx;
    background: #43C9A7;
    border-radius: 7.32rpx;
    text-align: center;
    text {
      width: 35.16rpx;
      font-size: 17.58rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
    }
  }
}

.uni-input,
::v-deep .uni-select {
  border: none !important;
}
@media screen and (max-width: 500px) and (min-width: 100px) {
  .button-wrapper {
    margin-top: 40rpx;
    width: 652rpx !important;
    height: 96rpx !important;
    background: #43C9A7;
    border-radius: 12rpx !important;
    margin-top: 160rpx !important;
    text-align: center;
    margin-left: 0rpx !important;
    text {
      width: 68rpx !important;
      height: 48rpx !important;
      font-size: 34rpx !important;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 88rpx !important;
    }
  }
  .uni-select {
    height: 104rpx !important;
  }
  .info-item {
    display: flex;
    flex-direction: column !important;
  }
  .improve-container {
    padding: 0 !important;
    margin-top: 0;
    box-sizing: border-box;
    .inner-container {
      padding-left: 48rpx !important;
      padding-top: 140rpx !important;
      margin: 0 !important;
      // margin-top: 80rpx !important;
      // padding-right: 48rpx !important;
      // height: 100% !important;
      max-height: 10000rpx !important;
      
      border-radius: 0rpx !important;
      padding-bottom: 50rpx !important;
      box-sizing: border-box;
    }
    .name {
      margin-top: 0rpx;
      height: 55.65rpx;
      border: none !important;
      .real-name {
        width: 56rpx !important;
        height: 40rpx;
        font-size: 28rpx !important;
        font-family: PingFangSC-Regular, PingFang SC !important;
        font-weight: 400 !important;
        color: #333333 !important;
        line-height: 40rpx !important;
      }
      .name-container {
        width: 652rpx !important;
        margin-top: 12rpx !important;
        padding-left: 38rpx;
        height: 104rpx !important;
        background: #ffffff;
        border-radius: 12rpx !important;
        border: 2rpx solid #e5e5e5 !important;
        box-sizing: border-box;
      }
      input, .input-text {
        font-size: 34rpx;
        font-weight: bold;
        width: 100%;
        height: 104rpx !important;
      }
    }
    .sex {
      margin-top: 140rpx !important;
      height: 65.65rpx;
      margin-top: 21.97rpx;
      border-bottom: none !important;
      .sex-name {
        margin-bottom: 10rpx !important;
        width: 56rpx !important;
        height: 40rpx;
        font-size: 28rpx !important;
        font-family: PingFangSC-Regular, PingFang SC !important;
        font-weight: 400 !important;
        color: #333333 !important;
        line-height: 40rpx !important;
      }
      .select-container {
        width: 652rpx !important;
        height: 104rpx !important;
        background: #ffffff;
        border-radius: 12rpx !important;
        border: 2rpx solid #e5e5e5 !important;
        .select-picker {
          color: #333333;
          font-weight: 600;
          font-size: 34rpx;
          width: 100%;
          height: 100% !important;
        }
      }
      .sex-right {
        width: 70%;
        height: 23.44rpx;
        font-size: 16.85rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #c9c9c9;
        line-height: 23.44rpx;
        .radio-button {
          margin-right: 3.46rpx;
        }
        .male {
          margin-right: 33.69rpx;
          font-size: 16.85rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 23.44rpx;
        }
        .female {
          font-size: 16.85rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 23.44rpx;
        }
      }
    }
    .birthday {
      height: 55.65rpx;
      margin-top: 140rpx;
      border-bottom: none !important;
      .birthday-name {
        margin-bottom: 10rpx !important;
        width: 156rpx !important;
        height: 40rpx;
        font-size: 28rpx !important;
        font-family: PingFangSC-Regular, PingFang SC !important;
        font-weight: 400 !important;
        color: #333333 !important;
        line-height: 40rpx !important;
      }
      .birthday-right {
        width: 652rpx !important;
        height: 104rpx !important;
        background: #ffffff;
        border-radius: 12rpx !important;
        border: 2rpx solid #e5e5e5 !important;
        .picker {
          padding-left: 38rpx;
          padding-top: 28rpx;
          width: 100% !important;
          height: 104rpx !important;
        }
        /* margin-top: 10rpx;
        width: 70%;
        height: 23.44rpx;
        font-size: 16.85rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #c9c9c9;
        line-height: 23.44rpx; */
        .birthday-text {
          width: 100%rpx;
          height: 100%;
          font-size: 34rpx;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #333333;
          line-height: 48rpx;
          color: #333333;
        }
        .select-birth {
          width: 100%;
          height: 100%;
          font-size: 34rpx;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #333333;
          line-height: 48rpx;
          color: #c9c9c9;
        }
      }
    }
    .educate {
      height: 55.65rpx;
      margin-top: 140rpx;
      border-bottom: none !important;
      .educate-name {
        margin-bottom: 10rpx !important;
        width: 56rpx !important;
        height: 40rpx;
        font-size: 28rpx !important;
        font-family: PingFangSC-Regular, PingFang SC !important;
        font-weight: 400 !important;
        color: #333333 !important;
        line-height: 40rpx !important;
      }
      .educate-right {
        width: 652rpx !important;
        height: 104rpx !important;
        background: #ffffff;
        border-radius: 12rpx !important;
        border: 2rpx solid #e5e5e5 !important;
        .picker {
          padding-left: 38rpx;
          padding-top: 28rpx;
          width: 100% !important;
          height: 104rpx !important;
        }
        .educate-text {
          width: 100%rpx;
          height: 100%;
          font-size: 34rpx;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #333333;
          line-height: 48rpx;
        }
        .select-educate {
          width: 100%;
          height: 100%;
          font-size: 34rpx;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #333333;
          line-height: 48rpx;
          color: #c9c9c9;
        }
      }
    }
    .phone {
      height: 55.65rpx;
      margin-top: 140rpx;
      // border-bottom: 1px solid rgba(0, 0, 0, 0.08);
      .phone-name {
        width: 156rpx !important;
        height: 40rpx;
        font-size: 28rpx !important;
        font-family: PingFangSC-Regular, PingFang SC !important;
        font-weight: 400 !important;
        color: #333333 !important;
        line-height: 40rpx !important;
      }
      .phone-container {
        margin-top: 12rpx !important;
        padding-left: 38rpx;
        width: 652rpx !important;
        height: 104rpx !important;
        background: #ffffff;
        border-radius: 12rpx !important;
        border: 2rpx solid #e5e5e5 !important;
        font-size: 34rpx !important;
        font-weight: bold;
        color: #333333 !important;
        line-height: 48rpx;
        box-sizing: border-box;
        input {
          font-size: 34rpx !important;
          font-weight: 600;
          color: #333333 !important;
          width: 100%;
          height: 104rpx !important;
        }
      }
    }
    .code {
      height: 55.65rpx;
      margin-top: 161.97rpx;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
      .code-name {
        width: 156rpx !important;
        height: 40rpx;
        font-size: 28rpx !important;
        font-family: PingFangSC-Regular, PingFang SC !important;
        font-weight: 400 !important;
        color: #333333 !important;
        line-height: 40rpx !important;
      }
      .code-container {
        margin-top: 12rpx !important;
        padding-left: 38rpx;
        /* width: 662rpx !important; */
        height: 104rpx !important;
        background: #ffffff;
        border-radius: 12rpx !important;
        border: 2rpx solid #e5e5e5 !important;
        input {
          font-size: 34rpx;
          color: #333333 !important;
          font-weight: 600;
          width: 100%;
          height: 104rpx !important;
        }
      }
    }
  }
  .uni-input,
  ::v-deep .uni-select {
    height: 104rpx !important;
  }
  .uni-input-placeholder {
    font-size: 34rpx;
    font-weight: 400;
  }
  ::v-deep .uni-select__input-placeholder {
    font-size: 34rpx;
    font-weight: 400;
    color: rgb(201, 201, 201);
  }
  ::v-deep .uni-select__selector-item {
    font-size: 34rpx;
  }
  ::v-deep .uni-select__input-text {
    font-size: 34rpx;
  }
}
</style>