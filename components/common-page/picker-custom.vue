<template>
  <view class="picker-custom">
    <view class="picker-custom-content">
      <view class="close-wrap"><uni-icons @click="closePickerBox" class="close" type="closeempty" size="25"></uni-icons></view>
      <picker-view v-if="mode == 'date'" :immediate-change="true" :indicator-style="isPad ? 'height: 50px; border-top: 1px solid #43C9A7;border-bottom: 1px solid #43C9A7;' : 'height: 50px; border-top: 1px solid #43C9A7;border-bottom: 1px solid #43C9A7;'" :value="value" @change="bindChange" class="picker-view">
        <picker-view-column>
          <view :class="['item', value[0] == index ? 'item-choose' : '']" v-for="(item,index) in years" :key="index">{{item}}年</view>
        </picker-view-column>
        <picker-view-column v-if="!isOnlyShowYear">
          <view :class="['item', value[1] == index ? 'item-choose' : '']" v-for="(item,index) in months" :key="index">{{item}}月</view>
        </picker-view-column>
        <picker-view-column v-if="!isOnlyShowYear">
          <view :class="['item', value[2] == index ? 'item-choose' : '']" v-for="(item,index) in days" :key="index">{{item}}日</view>
        </picker-view-column>
      </picker-view>
      <picker-view v-if="mode == 'selector'" :immediate-change="true" :indicator-style="isPad ? 'height: 50px; border-top: 1px solid #43C9A7;border-bottom: 1px solid #43C9A7;' : 'height: 52px; border-top: 1px solid #43C9A7;border-bottom: 1px solid #43C9A7;'" :value="value" @change="bindChange" class="picker-view">
        <picker-view-column>
          <view :class="['item', value[0] == index ? 'item-choose' : '']" v-for="(item,index) in range" :key="index">{{item[rangeKey]}}</view>
        </picker-view-column>
      </picker-view>
      <view :class="['confirm', isMoving ? 'confirm-disabled' : '']" @click="getValue">确认</view>
    </view>    
  </view>
</template>

<script>
  export default {
    props: {
      mode: {
        type: String,
        default: 'selector'
      },
      range: {
        type: Array,
        default: () => []
      },
      rangeKey: {
        type: String,
        default: ''
      },
      currentPickerValue: {
        type: [String, Number],
        default: ''
      },
      defaultIndex: {
        type: Number,
        default: 0
      },
      isOnlyShowYear: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        years: [],
        months: [],
        days: [],
        year: '',
        month: '',
        day: '',
        value: [0],
        isPad: this.$pad
        // visibleDate: false,
        // pickerVal: []
      }
    },
    mounted() {
      if (this.mode == 'date') {
        const date = new Date()
        const years = []
        const months = []
        const days = []
        for (let i = 1923; i <= date.getFullYear(); i++) {
          this.years.push(i)
        }
        for (let i = 1; i <= 12; i++) {
          this.months.push(i.toString().padStart(2, 0))
        }
        for (let i = 1; i <= 31; i++) {
          this.days.push(i.toString().padStart(2, 0))
        }
        if (this.isOnlyShowYear) {
          this.$nextTick(() => {
            this.year = this.currentPickerValue ? this.currentPickerValue - 1923 : 33
            this.value = [this.year]
          })
        } else {
          this.$nextTick(() => {
            this.day = this.currentPickerValue ? this.currentPickerValue.split('-')[2] - 1 : 0
            this.month = this.currentPickerValue ? this.currentPickerValue.split('-')[1] - 1 : 5
            this.year = this.currentPickerValue ? this.currentPickerValue.split('-')[0] - 1923 : 33
            this.value = [this.year, this.month, this.day]
          })
        }
        
      } else {
        let rangIndex = this.range.findIndex(item => {
          return item.name == this.currentPickerValue
        })
        this.value = this.currentPickerValue ? [rangIndex] : [this.defaultIndex]
      }
    },
    methods: {
      bindChange(e) {
        this.value = e.detail.value
      },
      getValue() {
        let val = ''
        if (this.mode == 'date') {
          if (this.isOnlyShowYear) {
            val = `${this.years[this.value[0]]}`
          } else {
            val = `${this.years[this.value[0]]}-${this.months[this.value[1]]}-${this.days[this.value[2]]}`
          }
          this.$emit('getDateValue', val)
        } else if (this.mode == 'selector') {
          val = this.value
          this.$emit('getSelectorValue', val)
        }
        
      },
      closePickerBox() {
        this.$emit('closePicker')
      }
    }
  }
</script>


<style lang="scss" scoped>
  .picker-custom {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 99999;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    .picker-custom-content {
      width: 319.41rpx;
      height: 274.73rpx;
      padding: 14.65rpx 0;
      background-color: #fff;
      border-radius: 14.65rpx;
      .close-wrap {
        text-align: right;
        .close {
          padding: 10rpx;
          
        }
      }
      .picker-view {
      	width:100%;
      	height: 142.86rpx;
        margin-top: 12.45rpx;
        .item {
          font-size: 25rpx !important;
          align-items: center;
          justify-content: center;
          text-align: center;
          line-height: 50px;
        	
          /* #ifdef MP */
          // height: 35rpx !important;
          // line-height: 35rpx !important;
          /* #endif */
        }
        .item-choose {
          background-color: #ECFCF8;
          color: #43C9A7;
        }
      }
      .confirm {
        width: 269.6rpx;
        height: 55.68rpx;
        border-radius: 7.33rpx;
        background-color: #43C9A7;
        text-align: center;
        line-height: 55.68rpx;
        font-size: 21.98rpx;
        color: #fff;
        font-weight: bold;
        margin: 14.65rpx auto 0 auto;
      }
      .confirm-disabled {
        opacity: 0.7;
      }
    }
    // ::v-deep .uni-picker-view-indicator:before {
    //   border-top: 1px solid #43C9A7;
    //   transform: scaleY(2);
    // }
    // ::v-deep .uni-picker-view-indicator:after {
    //   border-bottom: 1px solid #753C81;
    //   transform: scaleY(2);
    // }
  }
	@media screen and (max-width: 500px) {
    .picker-custom {
      .picker-custom-content {
        width: 600rpx;
        height: 570rpx;
        padding: 20rpx 0;
        background-color: #fff;
        border-radius: 20rpx;
        
        .picker-view {
        	
        	height: 312rpx;
          margin-top: 20rpx;
          .item {
            font-size: 40rpx !important;
          	// height: 104rpx;
           //  line-height: 104rpx;
          }
        }
        .confirm {
          width: 554rpx;
          height: 98rpx;
          border-radius: 12rpx;
         
          line-height: 98rpx;
          font-size: 40rpx;
          
          margin: 36rpx auto 0 auto;
        }
      }
    }
  }
</style>
