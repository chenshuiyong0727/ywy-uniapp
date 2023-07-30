<template>
  <view :class="['city-container', isShowMask ? 'city-container-mask' : '']" v-if="isShowAddressSelect">
    <view :class="[isShowContentFlag ? 'content-show' : 'content-close','content']">
      <view class="content-top">
        <view class="close" @click="closeHandle"><uni-icons type="closeempty" size="20"></uni-icons></view>
        <view class="address" v-if="isPad">
          <view :class="[currentAddressIndex == 0 ? 'on' : '']" @click="addressClickHandle(0)">{{addressData.province.name ? addressData.province.name : '省份'}}</view>
          <view :class="[currentAddressIndex == 1 ? 'on' : '']" @click="addressClickHandle(1)">{{addressData.city.name ? addressData.city.name : '城市'}}</view>
          <view :class="[currentAddressIndex == 2 ? 'on' : '']" @click="addressClickHandle(2)">{{addressData.area.name ? addressData.area.name : '区/县/市'}}</view>
          <view :class="[currentAddressIndex == 3 ? 'on' : '']" @click="addressClickHandle(3)">{{addressData.street.name ? addressData.street.name : '街道/乡/镇'}}</view>
        </view>
        <view v-else class="address-mobile">
          <view :class="[addressData.province.name ? 'on' : '']" @click="addressClickHandle(0)">{{addressData.province.name ? addressData.province.name : '请选择省份'}}</view>
          <view :class="[addressData.city.name ? 'on' : '']" v-if="addressData.province.name" @click="addressClickHandle(1)">{{addressData.city.name ? addressData.city.name : '请选择城市'}}</view>
          <view :class="[addressData.area.name ? 'on' : '']" v-if="addressData.city.name" @click="addressClickHandle(2)">{{addressData.area.name ? addressData.area.name : '请选择区/县/市'}}</view>
          <view :class="[addressData.street.name ? 'on' : '']" v-if="addressData.area.name" @click="addressClickHandle(3)">{{addressData.street.name ? addressData.street.name : '请选择街道/乡/镇'}}</view>
        </view>
        <view class="hot" v-if="hotCity.length && (!addressData.province.name || !addressData.city.name)">
          <view class="sub-title">热门城市</view>
          <view class="hot-city-list">
            <view v-for="item in hotCity" :key="item.code" @click="hotCityClick(item)">{{item.name}}</view>
          </view>
        </view>
      </view>
      <view class="split"></view>
      <view class="content-bottom">
        <scroll-view scroll-y="true" :class="[hotCity.length && (!addressData.province.name || !addressData.city.name) ? '' : 'scroll-Y-pad','scroll-Y', 'scroll-Y-'+computClass]" :scroll-into-view="scrollLetter" :scroll-with-animation="true" @scroll="scrollCityHandle">
          <block v-if="dealWithDataDone && tempCityList">
            <view class="city-item" v-for="(vals, keys, index) in tempCityList" :key="index">
              <view class="title" :id="keys">{{keys}}</view>
              <view class="list">
                <view :class="[currentCityIndex == index2 && currentCityPniyin == item.pinyin ? 'on' : '']" v-for="(item, index2) in vals" :key="item.code" @click="chooseCity(item, index2)">{{item.name}}</view>
              </view>
            </view>
          </block>
          <block v-if="dealWithDataDone && !tempCityList">
            <view class="empty-address">请先选择上一级地址</view>
          </block>
        </scroll-view>
        
        <!--侧边字母-->
        <view class="letter">
          <view v-for="(item, index) in letterArray" :key="index" @click="goToLetterArea(item)">{{item}}</view>
        </view>
        <!--end -->
      </view>
      <view class="btn" @click="confirmHandle">确认</view>
     
    </view>
  </view>
</template>

<script>
  import { pinyin } from 'pinyin-pro'
  export default {
    props: {
      isShowMask: {
        type: Boolean,
        default: false
      }
    },
    data() {
     return {
       cityData: [],
       tempCityList: null,
       addressData: {
         province: {name: '', code: '', index: -1},
         city: {name: '', code: '', index: -1},
         area: {name: '', code: '', index: -1},
         street: {name: '', code: '', index: -1}
       },
       hotCity: [{code: '3502', name: '厦门', pinyin: 'X'}, {code: '3501', name: '福州', pinyin: 'F'}, {code: '3508', name: '龙岩', pinyin: 'L'}, {code: '3509', name: '宁德', pinyin: 'N'}, {code: '3507', name: '南平', pinyin: 'N'}, {code: '3503', name: '莆田', pinyin: 'P'}],
       currentCityIndex: -1,
       currentCityPniyin : '',
       currentAddressIndex: 0,
       letterArray: [],
       // 定位当前字母
       scrollLetter: '',
       isShowContentFlag: false,
       isShowAddressSelect: false,
       isPad: this.$pad,
       computClass: 0,
       userInfo: {},
       dealWithDataDone: false
     } 
    },
    mounted() {
      uni.request({
        url: 'https://hjom-oss.yimed.cn/static/operateSteps/address/pcas-code.json',
        success: (res) => {
          this.cityData = res.data
          const cityData = this.cityData
          this.dealWithData(cityData)
        }
      })
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
      this.getHotCity()
    },
    computed: {
      province() {
        return this.addressData.province
      },
      city() {
        return this.addressData.city
      },
      area() {
        return this.addressData.area
      }
    },
    watch: {
      province(newval) {
        this.addressData.city.name = ''
        this.addressData.city.code = ''
        this.addressData.city.index = -1
        this.addressData.area.name = ''
        this.addressData.area.code = ''
        this.addressData.area.index = -1
        this.addressData.street.name = ''
        this.addressData.street.code = ''
        this.addressData.street.index = -1
        this.computClass = 1
      },
      city(newval) {
        this.addressData.area.name = ''
        this.addressData.area.code = ''
        this.addressData.area.index = -1
        this.addressData.street.name = ''
        this.addressData.street.code = ''
        this.addressData.street.index = -1
        this.computClass = 2
      },
      area(newval) {
        this.addressData.street.name = ''
        this.addressData.street.code = ''
        this.addressData.street.index = -1
        this.computClass = 3
      }
    },
    methods: {
      getHotCity() {
        this.$request({
          url: '/gw/h5/v1/front/user/address/hotCity',
          method: 'post',
          data: {
            token: this.userInfo.token
          }
        }).then(res => {
          if (res.status == 1000) {
            this.hotCity = res.data ? res.data.hotList : []
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      dealWithData(data) {
        this.scrollLetter = ''
        for (let i = 0; i < data.length; i++) {
          let py = pinyin(data[i].name.substring(0,1), { pattern: 'first', toneType: 'none' }).toUpperCase()
          if (data[i].name.indexOf('重庆') > -1) {
            data[i]['pinyin'] = 'C'
          } else if (data[i].name.indexOf('厦门') > -1) {
            data[i]['pinyin'] = 'X'
          } else {
            data[i]['pinyin'] = py
          }
        }
        let tempPinYinList = {} //临时拼音数据
        for (let i = 0; i < data.length; i++) {
          if (tempPinYinList[data[i].pinyin] == undefined) {
            tempPinYinList[data[i].pinyin] = []
          }
          tempPinYinList[data[i].pinyin].push(data[i])
        }
        // 按key值进行排序
        let newkey = Object.keys(tempPinYinList).sort()
        let newObj = {}
        this.letterArray = newkey
        for(let i = 0; i < newkey.length; i++) {
          newObj[newkey[i]] = tempPinYinList[newkey[i]]
        }
        this.tempCityList = JSON.parse(JSON.stringify(newObj))
        this.$nextTick(() => {
          let letter = Object.keys(this.tempCityList)
          if (letter.length) {
            this.goToLetterArea(letter[0])
          }
        })
        this.dealWithDataDone = true
      },
      chooseCity(item, index) {
        this.currentCityIndex = index
        this.currentCityPniyin = item.pinyin
        if (this.currentAddressIndex == 0) {
          this.addressData.province = JSON.parse(JSON.stringify(item))
          this.addressData.province.index = index
        } else if (this.currentAddressIndex == 1) {
          this.addressData.city = item
          this.addressData.city.index = index
        } else if (this.currentAddressIndex == 2) {
          this.addressData.area = item
          this.addressData.area.index = index
        } else if (this.currentAddressIndex == 3) {
          this.addressData.street = item
          this.addressData.street.index = index
        }
        this.currentAddressIndex++
        if (this.currentAddressIndex <= 3) {
          this.currentCityIndex  = -1
          this.dealWithData(item.children)
        }
        if (this.currentAddressIndex >= 4) {
          this.currentAddressIndex = 3
        }
      },
      goToLetterArea(item) {
        this.scrollLetter = item
      },
      scrollCityHandle() {
        this.scrollLetter = ''
      },
      addressClickHandle(index) {
        this.currentAddressIndex = index
        if (index == 0) {
          // 点击省份
          this.dealWithData(this.cityData)
          this.currentCityIndex = this.addressData.province.index
          this.currentCityPniyin = this.addressData.province.pinyin
          this.computClass = 1
        } else if (index == 1) {
          // 点击城市
          if (this.addressData.province.name) {
            this.dealWithData(this.addressData.province.children)
            this.currentCityIndex = this.addressData.city.index
            this.currentCityPniyin = this.addressData.city.pinyin
            this.computClass = 2
          } else  {
            this.tempCityList = null
          }
          
        } else if (index == 2) {
          // 点击区/县/市
          if (this.addressData.city.name) {
            this.dealWithData(this.addressData.city.children)
            this.currentCityIndex = this.addressData.area.index
            this.currentCityPniyin = this.addressData.area.pinyin
            this.computClass = 3
          } else {
            this.tempCityList = null
          }
          
        } else if (index == 3) {
          // 点击街道/乡/镇
          if (this.addressData.area.name) {
            this.dealWithData(this.addressData.area.children)
            this.currentCityIndex = this.addressData.street.index
            this.currentCityPniyin = this.addressData.street.pinyin
          } else {
            this.tempCityList = null
          }
          
        }
      },
      reset() {
        clearTimeout(this.timer)
        this.timer = null
        this.addressData.province.name = ''
        this.addressData.province.code = ''
        this.addressData.province.index = -1
        this.addressData.city.name = ''
        this.addressData.city.code = ''
        this.addressData.city.index = -1
        this.addressData.area.name = ''
        this.addressData.area.code = ''
        this.addressData.area.index = -1
        this.addressData.street.name = ''
        this.addressData.street.code = ''
        this.addressData.street.index = -1
        this.currentAddressIndex = 0
        this.computClass = 0
        this.currentCityIndex = -1
        
        this.dealWithData(this.cityData)
      },
      closeHandle() {
        this.reset()
        this.isShowContentFlag = false
        setTimeout(() => {
          this.isShowAddressSelect = false
        }, 200)
      },
      hotCityClick(item) {
        this.dealWithData(this.cityData)
        let province = this.cityData.filter(province => province.code == item.code.slice(0,2))
        this.addressData.province = JSON.parse(JSON.stringify(province[0]))
        let tempCity = {}
        for (let key in this.tempCityList) {
          if (key == this.addressData.province.pinyin) {
            tempCity = this.tempCityList[key]
          }
        }
        this.addressData.province.index = tempCity.findIndex((val, index, arr) => {
          return val.code == this.addressData.province.code
        })
        this.dealWithData(this.addressData.province.children)
        for (let key in this.tempCityList) {
          if (key == item.pinyin) {
            tempCity = this.tempCityList[key]
          }
        }
        let i = tempCity.findIndex((val, index, arr) => {
          return val.code == item.code
        })
        this.timer = setTimeout(() => {
          this.addressData.city = tempCity[i]
          this.addressData.city.index = i
          this.dealWithData(this.addressData.city.children)
          this.currentAddressIndex = 2
        }, 60)
      },
      confirmHandle() {
        if (!this.addressData.province.name) {
          return uni.showToast({
            title: '请选择省份',
            icon: 'none',
            duration: 2000
          })
        } else if (!this.addressData.city.name) {
          return uni.showToast({
            title: '请选择城市',
            icon: 'none',
            duration: 2000
          })
        } else if (!this.addressData.area.name) {
          return uni.showToast({
            title: '请选择区/县/市',
            icon: 'none',
            duration: 2000
          })
        }
        this.$emit('getAddressHandle', this.addressData)
        this.closeHandle()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .city-container-mask {
    background-color: rgba(0, 0, 0, 0.6);
  }
  .city-container {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    z-index: 9999;
    color: #333;
    .content {
      width: 750rpx;
      max-width: 750rpx;
      background-color: #fff;
      border-top-left-radius: 25rpx;
      border-top-right-radius: 25rpx;
      font-size: 21.25rpx;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
      transition: height 0.2s;
      text-align: left;
      .close {
        position: absolute;
        right: 15rpx;
        top: 5rpx;
        padding: 10rpx;
      }
      .content-top {
        padding: 15rpx 60rpx 0 25rpx;
        .address {
          display: flex;
          align-items: center;
          &>view {
            font-size: 21.25rpx;
            padding: 0 25rpx 12.5rpx 25rpx;
            overflow:hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            -o-text-overflow:ellipsis;
            max-width: 200rpx;
          }
          &>view:nth-child(1) {
            padding: 0 12.5rpx 12.5rpx 12.5rpx;
          }
          &>view:nth-child(2) {
            padding: 0 37.5rpx 12.5rpx 37.5rpx;
          }
          &>view.on {
            font-weight: bold;
            color: #43C9A7;
            position: relative;
            &::after {
              content: '';
              width: 27.5rpx;
              height: 2.5rpx;
              background-color: #43C9A7;
              position: absolute;
              bottom: 0;
              left: 50%;
              transform: translateX(-50%);
            }
          }
        }
        .hot {
          margin-top: 15rpx;
          .sub-title {
            font-size: 17.5rpx;
            color: #999;
          }
          .hot-city-list {
            display: flex;
            align-items: center;
            margin-top: 12.5rpx;
            flex-wrap: wrap;
            &>view {
              font-size: 20rpx;
              margin-right: 45rpx;
              margin-bottom: 15rpx;
            }
            &>view:last-child {
              margin-right: 0rpx;
            }
          }
        }
      }
      .split {
        width: 675rpx;
        height: 1px;
        background-color: #EBEBEB;
        margin: 0rpx 0rpx 0 25rpx;
      }
      .content-bottom {
        padding: 0rpx 25rpx 0 25rpx;
        
        margin-top: 10rpx;
        .scroll-Y {
          height: 368rpx;
          width: 95%;
        }
        .scroll-Y-pad {
          height: 463rpx;
        }
        .city-item {
          padding: 6.25rpx;
          line-height: 30rpx;
          .title {
            font-size: 17.5rpx;
            padding-bottom: 3.75rpx;
            line-height: inherit;
          }
          .list {
            margin-bottom: 17.5rpx;
            &>view {
              font-size: 21.25rpx;
              font-weight: bold;
              padding: 6.25rpx 0;
              line-height: inherit;
            }
            .on {
              color: #43C9A7;
              position: relative;
              &::after {
                content: '';
                width: 8rpx;
                height: 15rpx;
                border-bottom: 3rpx solid #43C9A7;
                border-right: 3rpx solid #43C9A7;
                transform: rotate(45deg);
                position: absolute;
                right: 30rpx;
                top: 50%;
                margin-top: -12rpx;
              }
            }
          }
          .list:last-child {
            margin-bottom: 0;
          }
        }
        .empty-address {
          text-align: center;
          font-size: 22.5rpx;
          color: #999;
          padding-top: 112.5rpx;
        }
      }
      .btn {
        width: 350rpx;
        height: 55rpx;
        background-color: #43C9A7;
        border-radius: 5rpx;
        font-size: 22.5rpx;
        color: #fff;
        text-align: center;
        line-height: 55rpx;
        font-weight: bold;
        
        position: absolute;
        left: 50%;
        margin: 20rpx 0 0 -175rpx;
      }
      .letter {
        position: absolute;
        right: 10rpx;
        top: 55%;
        transform: translateY(-50%);
        &>view {
          padding: 5rpx 12.5rpx;
          font-size: 15rpx;
          line-height: 20rpx;
        }
      }
    }
    .content-close {
      height: 0;
    }
    .content-show {
      // height: 562.5rpx;
      height: 620rpx;
    }
  }
  @media screen and (max-width: 500px) {
    .city-container {
      .content {
        border-top-left-radius: 40rpx;
        border-top-right-radius: 40rpx;
        font-size: 32rpx;
        .content-top {
          padding: 50rpx 80rpx 0 25rpx;
          box-sizing: border-box;
          // min-height: 500rpx;
          .address-mobile {
            padding-left: 64rpx;
            font-size: 34rpx;
            &>view {
              margin-bottom: 32rpx;
              position: relative;
              color: #43C9A7;
              &::before {
                content: '';
                width: 12rpx;
                height: 12rpx;
                border-radius: 50%;
                border: 1px solid #43C9A7;
                position: absolute;
                top: 50%;
                left: -60rpx;
                transform: translateY(-50%);
              }
            }
            &>view.on {
              color: #333;
              &::before {
                background-color: #43C9A7;
              }
              &::after {
                content: '';
                width: 4rpx;
                height: 76rpx;
                background-color: #43C9A7;
                position: absolute;
                top: 20rpx;
                left: -54rpx;
              }
            }
            &>view:last-child.on {
             
              &::after {
                display: none;
              }
            }
          }
          .hot {
            margin-top: 30rpx;
            .sub-title {
              font-size: 28rpx;
            }
            .hot-city-list {
              margin-top: 18rpx;
              flex-wrap: wrap;
              
              &>view {
                font-size: 32rpx;
                margin-right: 80rpx;
                margin-bottom: 40rpx;
              }
              &>view:nth-child(5) {
                margin-right: 0;
              }
              &>view:nth-child(6) {
                margin-bottom: 0;
              }
              &>view:nth-child(7) {
                margin-bottom: 0;
              }
              &>view:nth-child(8) {
                margin-bottom: 0;
              }
              &>view:nth-child(9) {
                margin-bottom: 0;
              }
              &>view:nth-child(10) {
                margin-bottom: 0;
              }
            }
          }
        }
        .split {
          width: 650rpx;
          height: 1px;
          background-color: #EBEBEB;
          margin: 20rpx 0rpx 0 25rpx;
        }
        .content-bottom {
          padding: 0rpx 25rpx 0 35rpx;
          margin-top: 25rpx;
          .scroll-Y {
            height: 730rpx;
            width: 95%;
          }
          .scroll-Y-1 {
            height: 650rpx;
          }
          .scroll-Y-2 {
            height: 570rpx;
          }
          .scroll-Y-3 {
            height: 490rpx;
          }
          .scroll-Y-pad.scroll-Y-2 {
            height: 776rpx;
          }
          .scroll-Y-pad.scroll-Y-3 {
            height: 696rpx;
          }
          .city-item {
            padding: 10rpx;
            .title {
              font-size: 28rpx;
              padding-bottom: 6rpx;
            }
            .list {
              margin-bottom: 28rpx;
              &>view {
                font-size: 34rpx;
                padding: 14rpx 0;
              }
              .on {
                &::after {
                  content: '';
                  width: 15rpx;
                  height: 30rpx;
                  border-bottom: 5rpx solid #43C9A7;
                  border-right: 5rpx solid #43C9A7;
                  margin-top: -24rpx;
                }
              }
            }
            .list:last-child {
              margin-bottom: 0;
            }
          }
        }
        .btn {
          width: 636rpx;
          height: 96rpx;
          border-radius: 8rpx;
          font-size: 36rpx;
          line-height: 96rpx;
          margin: 40rpx 0 0 -318rpx;
        }
        .letter {
          right: 20rpx;
          top: 50%;
          &>view {
            padding: 15rpx 15rpx;
            font-size: 22rpx;
          }
        }
      }
      .content-close {
        height: 0;
      }
      .content-show {
        height: 1240rpx;
      }
    }
  }
  @media screen and (max-width: 500px) and (max-height: 524px) {
    .city-container {
      .content {
        .content-bottom {
          .scroll-Y {
            height: 570rpx;
            width: 95%;
          }
          .scroll-Y-1 {
            height: 490rpx;
          }
          .scroll-Y-2 {
            height: 410rpx;
          }
          .scroll-Y-3 {
            height: 330rpx;
          }
          .scroll-Y-pad.scroll-Y-2 {
            height: 616rpx;
          }
          .scroll-Y-pad.scroll-Y-3 {
            height: 536rpx;
          }
        }
      }
    }
  }
  @media screen and (max-width: 500px) and (min-height: 525px) and (max-height: 725px) {
    .city-container {
      .content {
        .content-bottom {
          .scroll-Y {
            height: 640rpx;
            width: 95%;
          }
          .scroll-Y-1 {
            height: 560rpx;
          }
          .scroll-Y-2 {
            height: 480rpx;
          }
          .scroll-Y-3 {
            height: 400rpx;
          }
          .scroll-Y-pad.scroll-Y-2 {
            height: 686rpx;
          }
          .scroll-Y-pad.scroll-Y-3 {
            height: 606rpx;
          }
        }
      }
    }
  }
</style>