<template>
  <view class="profile-wrapper">
    <view class="bg-image"></view>
    <view class="flex-center">
      <view class="name-box">
        <view class="name-icon"></view>
        <input v-model="name" class="text-input" placeholder="您的姓名" />
      </view>
      <view class="birthday-box">
        <view class="birthday-icon"></view>
        <picker
          class="picker-container"
          mode="date"
          range-key="date"
          :value="date"
          :start="startDate"
          end="2022-10-01"
          @change="bindDateChange"
        >
          <view v-if="date" class="date-input">{{ date }}</view>
          <view v-else class="uni-input">您的输入出生日期</view>
        </picker>
      </view>
      <view class="xueli-box">
        <view class="xueli-icon"></view>
        <picker
          @change="bindPickerChange"
          :value="selectEducate"
          :range="educationList"
          range-key="name"
        >
          <view v-if="select" class="xueli-input">{{
            educationList[selectEducate].name
          }}</view>
          <view v-else class="your-xueli">您的学历</view>
        </picker>
      </view>
      <div
        :class="[{ 'button-bg': date || name || select }, 'profile-button']"
        @click="submitForm"
      >
        <text class="submit-text">确认</text>
      </div>
    </view>
  </view>
</template>


<script>
function getDate(type) {
  const date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  if (type === 'start') {
    year = year - 10
  } else if (type === 'end') {
    year = year + 10
  }
  month = month > 9 ? month : '0' + month
  day = day > 9 ? day : '0' + day
  return `${year}-${month}-${day}`
}

export default {
  data() {
    return {
      name: '', // 姓名
      select: false,
      selectEducate: 0, // 选的是哪个教育经历的下标
      educatateValue: '', // 学历对应的value值
      educationList: [],
      date: '', // 出生日期
      startDate: getDate('start'),
      endDate: getDate('end'),
    }
  },
  onLoad() {
    this.getEducationList()
  },
  methods: {
    async submitForm() {
      let userInfo = uni.getStorageSync('userInfo')
      const { token } = JSON.parse(userInfo)
      const res = await this.$request({
        url: '/gw/h5/v1/front/user/update',
        method: 'put',
        data: {
          name: this.name,
          birthDate: this.date,
          education: Number(this.educatateValue),
          token,
        },
      })
      if (res.status === 1000) {
        uni.navigateBack({
          delta: 1,
        })
      }
    },
    bindPickerChange(e) {
      this.select = true
      this.selectEducate = e.detail.value
      this.educatateValue = this.educationList[this.selectEducate].value
    },
    async getEducationList() {
      let userInfo = uni.getStorage('userInfo')
      const res = await this.$request(
        {
          url: '/gw/op/v1/base/sys/dict/listSysDict',
          method: 'post',
          data: {
            token: userInfo.token,
          },
        },
        false
      )
      if (res.status === 1000) {
        this.educationList = res.data
          .filter((item) => item.typeValue === '3002')
          .map((item) => {
            return {
              name: item.fieldName,
              value: item.fieldValue,
            }
          })
      }
    },
    bindDateChange: function (e) {
      this.date = e.detail.value
    },
  },
}
</script>

<style lang="scss" scoped>
.profile-wrapper {
  .bg-image {
    width: 750rpx;
    height: 65.92rpx;
    background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPngfaf852e33ebdf1ea82d64d1f938d28dbf72b225e1fc2a9aa9e9391342612b385)
      100% no-repeat;
    background-size: 100% 100%;
  }
  .flex-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    .name-box {
      box-sizing: border-box;
      padding: 14.65rpx 13.18rpx 14rpx 13.18rpx;
      margin-bottom: 13.18rpx;
      display: flex;
      align-items: center;
      background-color: rgba(255, 255, 255, 1);
      border-radius: 7.32rpx;
      width: 314.94rpx;
      height: 45.41rpx;
      .name-icon {
        margin-right: 16.11rpx;
        width: 23.44rpx;
        height: 23.44rpx;
        background: url('https://hjom-oss.yimed.cn/static/operateSteps/portalH5/pages/icon-name.png') 100% no-repeat;
        background-size: 100% 100%;
      }
      .text-input {
        flex: 1;
        width: 128.91rpx;
        height: 26.37rpx;
        overflow-wrap: break-word;
        color: #333333;
        font-size: 16.11rpx;
        text-align: left;
        white-space: nowrap;
        line-height: 30px;
        margin-top: 1px;
      }
    }
    .birthday-box {
      margin-bottom: 13.18rpx;
      display: flex;
      align-items: center;
      background-color: rgba(255, 255, 255, 1);
      border-radius: 7.32rpx;
      width: 314.94rpx;
      height: 45.41rpx;
      .birthday-icon {
        margin-left: 14.65rpx;
        margin-right: 18.11rpx;
        width: 23.44rpx;
        height: 23.44rpx;
        background: url('https://hjom-oss.yimed.cn/static/operateSteps/portalH5/pages/icon-shengri.png') 100%
          no-repeat;
        background-size: 100% 100%;
      }
      .picker-container {
        width: 324.94rpx;
        height: 45.89rpx;
      }
      .date-input {
        cursor: pointer;
        font-size: 16.11rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        width: 250.11rpx;
        line-height: 45.89rpx;
      }
      .uni-input {
        cursor: pointer;
        font-size: 16.11rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #cccccc;
        width: 250.11rpx;
        line-height: 45.89rpx;
      }
    }
    .xueli-box {
      box-sizing: border-box;
      padding: 14.65rpx 13.18rpx 14rpx 13.18rpx;
      margin-bottom: 13.18rpx;
      display: flex;
      align-items: center;
      background-color: rgba(255, 255, 255, 1);
      border-radius: 7.32rpx;
      width: 314.94rpx;
      height: 45.41rpx;
      .xueli-icon {
        cursor: pointer;
        margin-right: 16.11rpx;
        width: 23.44rpx;
        height: 23.44rpx;
        background: url('https://hjom-oss.yimed.cn/static/operateSteps/portalH5/pages/icon-xueli.png') 100% no-repeat;
        background-size: 100% 100%;
      }
      .xueli-input {
        cursor: pointer;
        font-size: 16.11rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        width: 250.11rpx;
      }
      .your-xueli {
        cursor: pointer;
        font-size: 16.11rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #cccccc;
        width: 250.11rpx;
      }
      .text-input {
        flex: 1;
        width: 128.91rpx;
        height: 26.37rpx;
        overflow-wrap: break-word;
        color: #333333;
        font-size: 16.11rpx;
        text-align: left;
        white-space: nowrap;
        line-height: 30px;
        margin-top: 1px;
      }
    }
    .profile-button {
      margin-top: 55.66rpx;
      width: 314.94rpx;
      height: 51.27rpx;
      text-align: center;
      background: #8be1cb;
      border-radius: 7.32rpx;
      .submit-text {
        width: 35.16rpx;
        height: 24.17rpx;
        font-size: 17.58rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 51.27rpx;
      }
    }
    .button-bg {
      background: #43c9a7;
    }
  }
}
.uni-input-placeholder {
  color: #cccccc !important;
}
</style>