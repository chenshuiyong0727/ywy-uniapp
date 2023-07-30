<template>
  <view class="choose-box" v-if="schedulingDateData">
    <view class="box-content">
      <view class="close-wrap"><uni-icons @click="closeAppointTimeBox" class="close" type="closeempty" size="25"></uni-icons></view>
      <view class="content">
        <view class="left">
          <view class="sub-title">选择日期</view>
          <view class="list-wrap">
            <view class="left-content">
              <view :class="[currentDateIndex == index ? 'on' : '', 'time-item']" v-for="(item, index) in schedulingDate" :key="index" @click="chooseDateHandle(index, item)">
                <text>{{item.monthDay}}</text>
                <text>（{{item.week}}）</text>
              </view>
            </view>
          </view>
          
          
        </view>
        <view class="right">
          <view class="sub-title">选择时段</view>
          <view class="list-wrap">
            <view class="right-content">
              <block v-if="morning.length">
                <view class="title">上午</view>
                <view class="time-list">
                  <view :class="[currentMorningTimeIndex == index ? 'on' : '','item']" v-for="(item, index) in morning" :key="index" @click="chooseTimeHandle(index, item, 'morning')">
                    <text>{{item.time}}</text>
                    <text class="not-choose" v-if="item.status == 1">已满</text>
                  </view>
                </view>
              </block>
              <block v-if="afternoon.length">
                <view class="title">下午</view>
                <view class="time-list">
                  <view :class="[currentAfternoonTimeIndex == index ? 'on' : '','item']" v-for="(item, index) in afternoon" :key="index" @click="chooseTimeHandle(index, item, 'afternoon')">
                    <text>{{item.time}}</text>
                    <text class="not-choose" v-if="item.status == 1">已满</text>
                  </view>
                </view>
              </block>
            </view>
          </view>
        </view>
      </view>
      <view class="btn-confirm" @click="confirmHandle">确认</view>
    </view>
  </view>
</template>

<script>
  export default {
    props: {
      schedulingDateData: {
        type: Object,
        default: () => {
          return null
        }
      },
      // 用于回显
      appointTimeText: {
        type: String,
        default: ''
      },
      appointType: {
        type: Number,
        default: 1 // 1=>服务咨询 2=>认知评估
      }
    },
    data() {
      return {
        currentDateIndex: 0,
        currentMorningTimeIndex: -1,
        currentAfternoonTimeIndex: -1,
        schedulingDate: [],
        morning: [],
        afternoon: [],
        chooseValue: {
          dayStr: '',
          week: '',
          scheduleStartTime: '',
          scheduleEndTime: '',
          scheduleId: ''
        }
      }
    },
    mounted() {
      this.formateData()
    },
    methods: {
      formateData() {
        let week = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        for (let key in this.schedulingDateData) {
          this.schedulingDate.push({
            monthDay: `${key.split('-')[1]}月${key.split('-')[2]}日`,
            timeStr: key,
            week: week[this.schedulingDateData[key][0].weekDate - 1] 
          })
        }
        if (this.appointTimeText) {
          this.currentDateIndex = (this.schedulingDate|| []).findIndex((item) => item.timeStr === this.appointTimeText.split(' ')[0])
        }
        this.chooseValue.dayStr = this.schedulingDate[this.currentDateIndex].timeStr
        this.chooseValue.week = this.schedulingDate[this.currentDateIndex].week
        this.formateTime(this.schedulingDateData, this.schedulingDate[this.currentDateIndex].timeStr, true)
      },
      
      formateTime(originData, data, isNeedInitData = false) {
        let date = originData[data]
        this.morning = []
        this.afternoon = []
        
        for (let i = 0; i < date.length; i++) {
          if ((this.appointType == 1 && date[i].sourceTime.split(':')[0] < 12) || (this.appointType == 2 && date[i].appointmentStart.split(':')[0] < 12)) {
            // 上午
            this.morning.push({
              id: this.appointType == 1 ? date[i].source : date[i].id,
              time: this.appointType == 1 ? date[i].sourceTime : `${date[i].appointmentStart}-${date[i].appointmentEnd}`,
              status: this.appointType == 1 ? date[i].status : date[i].num == 0 ? 1 : 0
            })
          } else {
            this.afternoon.push({
              id: this.appointType == 1 ? date[i].source : date[i].id,
              time: this.appointType == 1 ? date[i].sourceTime : `${date[i].appointmentStart}-${date[i].appointmentEnd}`,
              status: this.appointType == 1 ? date[i].status :  date[i].num == 0 ? 1 : 0
            })
          }
        }
        if (this.appointTimeText && isNeedInitData) {
          if (this.appointTimeText.split(' ')[1].split(':')[0] < 12) {
            this.currentMorningTimeIndex = (this.morning|| []).findIndex((item) => item.time === this.appointTimeText.split(' ')[1])
            this.chooseTimeHandle(this.currentMorningTimeIndex, this.morning[this.currentMorningTimeIndex], 'morning')
          } else {
            this.currentAfternoonTimeIndex = (this.afternoon|| []).findIndex((item) => item.time === this.appointTimeText.split(' ')[1])
            this.chooseTimeHandle(this.currentAfternoonTimeIndex, this.afternoon[this.currentAfternoonTimeIndex], 'afternoon')
          }
          
          
        }
        
      },
      chooseDateHandle(index, item) {
        this.currentDateIndex = index
        this.chooseValue.dayStr = item.timeStr
        this.chooseValue.week = item.week
        // 重置时段选中项
        this.currentMorningTimeIndex = -1
        this.currentAfternoonTimeIndex = -1
        this.chooseValue.scheduleStartTime = ''
        this.chooseValue.scheduleId = ''
        this.formateTime(this.schedulingDateData, item.timeStr)
      },
      chooseTimeHandle(index, item, type) {
        if (item.status == 1) {
          // 已约满
          return uni.showToast({
            title: '已约满，请重新选择',
            icon: 'none',
            duration: 2000
          })
        }
        if (type == 'morning') {
          this.currentMorningTimeIndex = index
          this.currentAfternoonTimeIndex = -1
        } else {
          this.currentAfternoonTimeIndex = index
          this.currentMorningTimeIndex = -1
        }
        
        this.chooseValue.scheduleStartTime = this.appointType == 1 ? item.time : item.time.split('-')[0]
        this.chooseValue.scheduleEndTime = this.appointType == 1 ? '' : item.time.split('-')[1]
        this.chooseValue.scheduleId = item.id
      },
      confirmHandle() {
        if (!this.chooseValue.dayStr) {
          return uni.showToast({
            title: '请选择日期',
            icon:'none',
            duration: 2000
          })
        } else if (!this.chooseValue.scheduleStartTime) {
          return uni.showToast({
            title: '请选择时段',
            icon:'none',
            duration: 2000
          })
        }
        this.$emit('getAppointmentValue', this.chooseValue)
      },
      closeAppointTimeBox() {
        this.$emit('closeAppointTimeBox')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .choose-box {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    .box-content {
      width: 512.82rpx;
      height: 476.19rpx;
      background-color: #F5F5F5;
      border-radius: 14.65rpx;
      padding: 19.78rpx 14.65rpx 16.12rpx 14.65rpx;
      .close-wrap {
        text-align: right;
        .close {
          padding: 10rpx;
        }
      }
      .content {
        display: flex;
        justify-content: space-around;
        
        color: #333;
        .sub-title {
          font-size: 19.05rpx;
          margin-bottom: 10.26rpx;
          font-weight: bold;
        }
        .left {
          flex: 0 0 168.5rpx;
          width: 168.5rpx;
          
          .list-wrap {
            background-color: #fff;
            font-size: 14.65rpx;
            padding: 14.65rpx 8.79rpx;
            box-sizing: border-box;
            border-radius: 11.72rpx;
            
          }
          .left-content {
            
            height: 301.83rpx;
            overflow: auto;
          }
          .time-item {
            width: 145rpx;
            height: 39.56rpx;
            text-align: center;
            line-height: 39.56rpx;
            margin-bottom: 10.99rpx;
            border-radius: 5.86rpx;
            position: relative;
            margin-left: 7.33rpx;
            &>text:nth-child(1) {
              font-size: 19.05rpx;
            }
            &>text:nth-child(2) {
              font-size: 14.65rpx;
            }
            &.on {
              background-color: #43C9A7;
              color: #fff;
              font-weight: bold;
              &::after {
                content: '';
                width: 0;
                height: 0;
                border-top: 7.33rpx solid transparent;
                border-left: 7.33rpx solid #43C9A7;
                border-bottom: 7.33rpx solid transparent;
                position: absolute;
                left: -13.19rpx;
                top: 50%;
                transform: translateY(-50%);
              }
            }
            
          }
        }
        .right {
          width: 315.02rpx;
          flex: 0 0 315.02rpx;
          .list-wrap {
            box-sizing: border-box;
            border-radius: 11.72rpx;
            background-color: #fff;
            padding: 14.65rpx;
          }
          .right-content {
            height: 301.83rpx;
            overflow: auto;
            
          }
          .title {
            font-size: 17.58rpx;
            font-weight: bold;
            margin-bottom: 9.52rpx;
          }
          .time-list {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            .item {
              background-color: #F5F5F5;
              width: 139.19rpx;
              height: 42.49rpx;
              line-height: 42.49rpx;
              border-radius: 5.86rpx;
              font-size: 19.05rpx;
              text-align: center;
              margin-bottom: 11.72rpx;
              position: relative;
              &.on {
                background-color: #43C9A7;
                color: #fff;
              }
              .not-choose {
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                text-align: center;
                line-height: 42.49rpx;
                color: #fff;
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                border-radius: 5.86rpx;
              }
            }
          }
        }
      }
      .btn-confirm {
        width: 269.6rpx;
        height: 55.68rpx;
        background-color: #43C9A7;
        border-radius: 7.33rpx;
        text-align: center;
        line-height: 55.68rpx;
        margin: 14.65rpx auto 0 auto;
        font-size: 21.98rpx;
        color: #fff;
      }
    }
  }
  @media screen and (max-width: 500px) {
    .choose-box {
      .box-content {
        width: 660rpx;
        height: 818rpx;
      
        border-radius: 20rpx;
        padding: 40rpx 20rpx;
        .close-wrap {
          .close {
            padding: 20rpx;
            margin-top: -30rpx;
          }
        }
        .content {
          .sub-title {
            font-size: 32rpx;
            margin-bottom: 18rpx;
          }
          .left {
            flex: 0 0 330rpx;
            width: 330rpx;
            
            .list-wrap {
              padding: 14rpx;
              border-radius: 20rpx;
            }
            .left-content {
              font-size: 36rpx;
              height: 560rpx;
            }
            .time-item {
              width: 300rpx;
              height: 92rpx;
              line-height: 92rpx;
              margin-bottom: 14rpx;
              border-radius: 16rpx;
              margin-left: 0rpx;
              &>text:nth-child(1) {
                font-size: 36rpx;
              }
              &>text:nth-child(2) {
                font-size: 32rpx;
              }
              &.on {
                &::after {
                  display: none;
                }
              }
              
            }
          }
          .right {
            width: 288rpx;
            flex: 0 0 288rpx;
            .list-wrap {
              border-radius: 20rpx;
              padding: 18rpx 12rpx;
            }
            .right-content {
              height: 560rpx;
            }
            .title {
              font-size: 32rpx;
              margin-bottom: 14rpx;
            }
            .time-list {
              
              .item {
                background-color: #F5F5F5;
                width: 264rpx;
                height: 92rpx;
                line-height: 92rpx;
                border-radius: 16rpx;
                font-size: 36rpx;
                
                margin-bottom: 14rpx;
                
                
                .not-choose {
                
                  line-height: 92rpx;
                 
                  border-radius: 16rpx;
                }
              }
            }
          }
        }
        .btn-confirm {
          width: 620rpx;
          height: 98rpx;
          
          border-radius: 12rpx;
         
          line-height: 98rpx;
          margin: 28rpx auto 0 auto;
          font-size: 40rpx;
        }
      }
    }
  }
</style>