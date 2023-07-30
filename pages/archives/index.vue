<template>
  <view>
  
    <nav-bar title='和家健脑' :isShowRightIcon="false" :isShowLeftIcon="false"></nav-bar>
   
    <!-- <view class="container">
      <view class="cognition common">
        <view class="title">认知训练</view>
        <view class="time"><text>累计训练时长</text><text>127分钟</text></view>
        <view class="switch-time">
          <view class="on">近7天</view>
          <view>近30天</view>
        </view>
        <view class="charts-box charts-box-1">
          <qiun-data-charts type="column" :opts="optsColumn" :chartData="chartData" />
        </view>
      </view>
      <view class="exercise common">
        <view class="title">趣味锻炼</view>
        <view class="time"><text>累计训练时长</text><text>127分钟</text></view>
        <view class="switch-time">
          <view class="on">近7天</view>
          <view>近30天</view>
        </view>
        <view class="charts-box charts-box-1">
          <qiun-data-charts type="area" :opts="optsArea" :chartData="chartData2" />
        </view>
      </view>
      <view class="micromotion common">
        <view class="title">认知训练</view>
        <view class="time"><text>累计训练时长</text><text>127分钟</text></view>
        <view class="switch-time">
          <view class="on">近7天</view>
          <view>近30天</view>
        </view>
        <view class="charts-box charts-box-1">
          <qiun-data-charts type="column" :opts="optsColumn2" :chartData="chartData" />
        </view>
      </view>
      <view class="screen-list">
        <view class="title">筛查评估档案</view>
        <view class="list">
          <view class="item">
            <view class="name">筛查档案</view>
            <view class="number"><text>0</text><text>个</text></view>
          </view>
          <view class="item">
            <view class="name">评估档案</view>
            <view class="number"><text>2</text><text>个</text></view>
          </view>
          <view class="item">
            <view class="name">训练档案</view>
            <view class="number"><text>12</text><text>个</text></view>
          </view>
        </view>
      </view>
    </view> -->
  </view>

</template>

<script>
  import {
    navigateTo
  } from '../../utils/util.js'
  import navBar from '@/components/nav-bar'
  export default {
    components: {
      navBar
    },
    // data() {
    //   return {
    //     chartData: {},
    //     chartData2: {},
    //     optsColumn: {
    //       color: ["#F6F6F6", "#BDECE0"],
    //       dataLabel: false,
    //       legend: {
    //         show: false
    //       },
    //       xAxis: {
    //         axisLine: false
    //       },
    //       yAxis: {
    //         disabled: true,
    //         disableGrid: true
    //       },
    //       extra: {
    //         column: {
    //           type: "group",
    //           width: 30,
    //           seriesGap: -30,
    //           activeBgOpacity: 0
    //         }
    //       }
    //     },
    //     optsColumn2: {
    //       color: ["#F6F6F6", "#00BCE6"],
    //       dataLabel: false,
    //       legend: {
    //         show: false
    //       },
    //       xAxis: {
    //         axisLine: false
    //       },
    //       yAxis: {
    //         disabled: true,
    //         disableGrid: true
    //       },
    //       extra: {
    //         column: {
    //           type: "group",
    //           width: 30,
    //           seriesGap: -30,
    //           activeBgOpacity: 0
    //         }
    //       }
    //     },
    //     optsArea: {
    //       color: ["#FFA15D"],
    //       padding: [15, 25, 0, 25],
    //       dataLabel: false,
    //       legend: {
    //         show: false
    //       },
    //       xAxis: {
    //         disableGrid: true,
    //         boundaryGap: "justify",
    //         rotateLabel: false
    //       },
    //       yAxis: {
    //         disabled: true,
    //         gridType: "dash",
    //         dashLength: 2
    //       },
    //       extra: {
    //         area: {
    //           type: "straight",
    //           opacity: 0.2,
    //           addLine: true,
    //           width: 2,
    //           gradient: true
    //         }
    //       }
    //     }
    //   };
    // },
    onReady() {
      // this.getServerData();
      // this.getServerData2();
    },
    methods: {
      // getServerData() {
      //   //模拟从服务器获取数据时的延时
      //   setTimeout(() => {
      //     let res = {
      //       categories: ["09/17", "09/18", "09/19", "09/20", "09/21", "09/22", "09/23"],
      //       series: [{
      //           name: "目标值",
      //           data: [40, 40, 40, 40, 40, 40, 40]
      //         },
      //         {
      //           name: "完成量",
      //           data: [18, 27, 21, 24, 6, 28, 23]
      //         }
      //       ],
      //       extra: {
      //         seriesGap: 10
      //       }
      //     };
      //     this.chartData = JSON.parse(JSON.stringify(res));
      //   }, 500);
      // },
      // getServerData2() {
      //   //模拟从服务器获取数据时的延时
      //   setTimeout(() => {
      //     //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
      //     let res = {
      //       categories: ["09/17", "09/18", "09/19", "09/20", "09/21", "09/22", "09/23"],
      //       series: [{
      //         name: "成交量A",
      //         data: [35, 8, 25, 37, 4, 20, 30]
      //       }]
      //     };
      //     this.chartData2 = JSON.parse(JSON.stringify(res));
      //   }, 500);
      // },
      // naveToPage(url) {
      //   navigateTo(url)
      // }
    }
  };
</script>

<style lang="scss" scoped>
  .container {
    width: 750.02rpx;
    max-width: 750.02rpx;
    padding: 16.11rpx 11.72rpx 36.62rpx 11.72rpx;
    box-sizing: border-box;

    .common {
      background-color: #fff;
      border-radius: 14.65rpx;
      padding: 21.97rpx;
      box-sizing: border-box;
      margin-bottom: 16.11rpx;

      .charts-box {
        width: 100%;
        height: 300px;
      }

      .title {
        font-size: 21.97rpx;
        color: #333;
        padding-bottom: 23.44rpx;
      }

      .time {
        color: #999;
        font-size: 17.58rpx;
        padding-bottom: 23.44rpx;

        &>text:nth-child(1) {
          vertical-align: middle;
        }

        &>text:nth-child(2) {
          vertical-align: middle;
          font-size: 32.23rpx;
          font-weight: bold;
          color: #43C9A7;
          padding-left: 16.85rpx;
          line-height: 32.23rpx;
        }
      }

      .switch-time {
        display: flex;
        margin-bottom: 21.97rpx;

        &>view {
          padding: 13.18rpx 43.95rpx;
          border-radius: 29.3rpx;
          background: #F6F6F6;
          font-size: 17.58rpx;
          color: #333;
          margin-right: 36.62rpx;
        }

        &>view.on {
          background: #43C9A7;
          color: #fff;
        }
      }
    }

    .exercise {
      .time {
        &>text:nth-child(2) {
          color: #FFA15D;
        }
      }

      .switch-time {
        &>view.on {
          background: #FFA15D;
        }
      }
    }

    .micromotion {
      .time {
        &>text:nth-child(2) {
          color: #00BCE6;
        }
      }

      .switch-time {
        &>view.on {
          background: #00BCE6;
        }
      }
    }

    .screen-list {
      margin-top: 32.23rpx;

      .title {
        font-size: 21.97rpx;
        font-weight: bold;
      }

      .list {
        display: flex;
        justify-content: space-between;
        margin-top: 17.58rpx;

        .item {
          border-radius: 14.65rpx;
          width: 234.38rpx;
          background-color: #fff;
          padding: 19.04rpx 21.97rpx;
          box-sizing: border-box;

          .name {
            position: relative;

            &::after {
              content: '';
              position: absolute;
              right: 0;
              top: 50%;
              width: 7.32rpx;
              height: 7.32rpx;
              border-top: 1px solid #D6D6D6;
              border-right: 1px solid #D6D6D6;
              transform: rotate(45deg) translateY(-50%);
            }
          }

          .number {
            font-size: 16.11rpx;
            color: #C8C8C8;
            margin-top: 14.65rpx;

            &>text:nth-child(1) {
              font-size: 32.23rpx;
              font-weight: bold;
              color: #333;
              padding-right: 7.32rpx;
            }
          }
        }
      }
    }
  }
</style>
