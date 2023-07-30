<template>
  <view>
   
    <nav-bar title='趣味健脑'></nav-bar>
   
    <view class="container">
      <view class="game-title">{{resultInfo.dcTrainingProj ? resultInfo.dcTrainingProj.name : ''}}</view>
      <view class="common score">
        <view class="times">
          <view>
            <text>{{resultInfo.dcStatisticalTotal ? resultInfo.dcStatisticalTotal.times : 0}}</text><text>锻炼次数</text>
          </view>
          <view>
            <text>{{resultInfo.dcStatisticalTotal ? resultInfo.dcStatisticalTotal.consecutiveDays : 0}}</text><text>连续锻炼</text>
          </view>
          <!-- <view>
            <text>{{resultInfo.dcStatisticalTotal ? resultInfo.dcStatisticalTotal.points : 0}}</text><text>锻炼积分</text>
          </view> -->
        </view>
        <view class="title">锻炼得分</view>
        <view class="score-style">
          <view class="score">
            <text>{{resultInfo.platformTrainingRecordEntity ? resultInfo.platformTrainingRecordEntity.score : 0}}</text><text>分</text>
          </view>
          <view class="desc">
            得分超越<text>{{resultInfo.dcStatisticalTotal ? resultInfo.dcStatisticalTotal.percentage : 0}}%</text>用户</view>
        </view>
      </view>
      <!-- <view class="common integral">
        <view class="title">锻炼奖励</view>
        <view class="content">
          <view class="number">
            <text>{{resultInfo.platformTrainingRecordEntity ? resultInfo.platformTrainingRecordEntity.score : 0}}</text><text>积分</text>
          </view>
          <view>锻炼得分越高，奖励也就越高； 努力获得更高的分数吧~</view>
        </view>
      </view> -->
      <view class="common direction">
        <view class="title">锻炼方向</view>
        <view class="content" v-if="resultInfo.dcTrainingProj">
          <view class="list" v-if="resultInfo.dcTrainingProj.trainingDirectionOne">
            <image
              :src="'../../static/images/applet/icon_'+resultInfo.dcTrainingProj.trainingDirectionOne+'_new.png'" />
            <view>{{resultInfo.dcTrainingProj.trainingDirectionOneCN}}</view>
          </view>
          <view class="list" v-if="resultInfo.dcTrainingProj.trainingDirectionTwo">
            <image
              :src="'../../static/images/applet/icon_'+resultInfo.dcTrainingProj.trainingDirectionTwo+'_new.png'" />
            <view>{{resultInfo.dcTrainingProj.trainingDirectionTwoCN}}</view>
          </view>
          <view class="list" v-if="resultInfo.dcTrainingProj.trainingDirectionThree">
            <image
              :src="'../../static/images/applet/icon_'+resultInfo.dcTrainingProj.trainingDirectionThree+'_new.png'" />
            <view>{{resultInfo.dcTrainingProj.trainingDirectionThreeCN}}</view>
          </view>
        </view>
      </view>
      <view class="common principle">
        <view class="title">科学原理</view>
        <view class="content">
          <rich-text :nodes="resultInfo.dcTrainingProj ? resultInfo.dcTrainingProj.scientificPrinciples  : ''">
          </rich-text>
        </view>
      </view>
      <view class="btm-fixed-btn">
        <view class="btn-return" @click="goBack">返回</view>
        <view class="btn-again" @click="playAgain">再玩一次</view>
      </view>
    </view>
    <!--侧边栏-->
    <fab :isOpenFabMenu="isPad ? true : false"></fab>
    <!--end 侧边栏-->
  </view>

</template>
<script>
  import fab from '@/components/fab'
  import navBar from '@/components/nav-bar'
  import { navigateTo } from '../../utils/util'
  import { envSetting } from '@/utils/env.js'
  export default {
    components: {
      navBar,
      fab
    },
    data() {
      return {
        resultInfo: {},
        userInfo: {},
        isPad: this.$pad
      }
    },
    onShow() {
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
    },
    mounted() {
      this.getResultDetail()
    },
    methods: {
      getResultDetail() {
        getApp().loginStatus().then((loginRes) => {
          this.$request({
            url: '/gw/h5/v1/training/getResult',
            method: 'get',
            data: {
              userId: this.userInfo.userId,
              token: this.userInfo.token
            }
          }).then(res => {
            if (res.status === 1000) {
              this._formateData(res.data.dcTrainingProj, 'trainingDirectionOne')
              this._formateData(res.data.dcTrainingProj, 'trainingDirectionThree')
              this._formateData(res.data.dcTrainingProj, 'trainingDirectionTwo')
              this.resultInfo = res.data
            } else {
              uni.showToast({
                title: res.msg,
                icon: 'none',
                duration: 2000
              })
            }
          })
        })
      },
      /**
       * map文案
       */
      _formateData(obj, name) {
        switch (obj[name]) {
          case 'working_memory':
            obj[name + 'CN'] = '工作记忆'
            break
          case 'attention':
            obj[name + 'CN'] = '注意力'
            break
          case 'processing_speed':
            obj[name + 'CN'] = '加工速度'
            break
          case 'persistent_attention':
            obj[name + 'CN'] = '持久性注意力'
            break
          case 'logical_thinking':
            obj[name + 'CN'] = '逻辑思维'
            break
          case 'computing_power':
            obj[name + 'CN'] = '计划能力'
            break
          case 'logical_classification':
            obj[name + 'CN'] = '逻辑分类'
            break
          case 'selective_reaction_time':
            obj[name + 'CN'] = '选择反应时'
            break
          case 'naming_ability':
            obj[name + 'CN'] = '命名能力'
            break
          case 'reaction_inhibition_ability':
            obj[name + 'CN'] = '反应抑制能力'
            break
          case 'visual_search_ability':
            obj[name + 'CN'] = '视觉搜索能力'
            break
          case 'memory':
            obj[name + 'CN'] = '记忆力'
            break
        }
        return obj
      },
      playAgain() {
        console.log(this.resultInfo)
        this.$request({
          url: '/gw/h5/v1/training/start',
          method: 'post',
          data: {
            userId: this.userInfo.userId,
            trainingProjId: this.resultInfo.dcTrainingProj.id,
            token: this.userInfo.token
          }
        }).then(res => {
          if (res.status === 1000) {
            let gameName = ['fensui', 'xzxx', 'vuegamejfcz', 'H5caici', 'lhchb', 'jybw', 'emoji', 'zylxl', 'jylxl']
            navigateTo('/pages/web-view/web-view', {
              link: `${envSetting.baseURL}/game/project/${gameName[this.resultInfo.dcTrainingProj.id - 1]}/index.html?trainingProjId=${this.resultInfo.dcTrainingProj.id}&userId=${this.userInfo.userId}&redirectUrl=/pages/exercise/result`,
              isNeedLandscape: 'no'
            })
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      goBack() {
        const pages = getCurrentPages()
        if (pages.length === 1) { //如果只有一个调用原生js
          // #ifdef H5
          history.back()
          // #endif
        } else {
          
          uni.navigateBack({
            delta: 1
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    min-height: 100vh;
    width: 100%;
    max-width: 750.02rpx;
    margin: 0 auto;
    background: #F4F4F4 url('../../static/images/applet/background_new.png') no-repeat top center;
    background-size: 750.02rpx 87.89rpx;
    box-sizing: border-box;
    font-size: 21.97rpx;
    color: #222;
    padding: 0px 21.97rpx 79.12rpx 21.97rpx;
    overflow: hidden;

    .game-title {
      font-size: 29.3rpx;
      color: #222;
      font-weight: bold;
      text-align: center;
      padding-top: 29.3rpx;
    }

    .common {
      padding: 21.97rpx;
      box-sizing: border-box;
      border-radius: 21.97rpx;
      margin-top: 21.97rpx;
      background-color: #fff;

      .title {
        font-size: 29.3rpx;
        color: #16171C;
        border-bottom: 1PX solid #F7F8F9;
        padding-bottom: 17.58rpx;
        font-weight: bold;
      }
    }

    .score {

      // padding-bottom: 0px;
      .title {
        border-bottom: none;
      }

      .times {
        background-color: #FAFAFA;
        padding: 14.65rpx;
        border-radius: 14.65rpx;
        display: flex;
        justify-content: space-around;
        margin-bottom: 14.65rpx;

        &>view {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #999;
          font-size: 20.51rpx;

          &>text:nth-child(1) {
            color: #16171C;
            font-size: 29.3rpx;
            padding-bottom: 7.32rpx
          }
        }
      }

      .score-style {
        color: #FF781E;
        text-align: center;
        position: relative;
        margin-top: 30.03rpx;
        background: url('../../static/images/applet/streamer.png') no-repeat top center;
        background-size: 389.66rpx 127.44rpx;
        font-size: 26.37rpx;

        .score {
          &>text:nth-child(1) {
            font-size: 131.84rpx;
            line-height: 131.84rpx;
            padding-right: 7.32rpx;
          }
        }

        .desc {
          font-size: 20.51rpx;
          color: #666;
          text-align: center;
          line-height: 32.96rpx;
          font-weight: normal;
          margin-top: 18.31rpx;

          text {
            color: #222;
            padding: 0 10.99rpx;
          }
        }
      }
    }

    .integral {
      .content {
        display: flex;
        justify-content: space-between;
        font-size: 20.51rpx;
        color: #666;
        margin-top: 43.95rpx;
        align-items: center;

        .number {
          color: #222;
          width: 168.46rpx;
          flex: 0 0 168.46rpx;

          &>text:nth-child(1) {
            font-size: 64.45rpx;
            padding-right: 7.32rpx;
          }
        }
      }
    }

    .direction {
      .content {
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-top: 21.97rpx;

        .list {
          font-size: 21.97rpx;
          color: #666;
          display: flex;
          flex-direction: column;
          align-items: center;

          image {
            width: 73.24rpx;
            height: 73.24rpx;
            margin-bottom: 14.65rpx;
          }
        }
      }
    }

    .principle {
      .content {
        color: #666;
        font-size: 21.97rpx;
        padding-top: 14.65rpx;
      }
    }
  
    .btm-fixed-btn {
      width: 750.18rpx;
      max-width: 750.18rpx;
      height: 64.47rpx;
      background-color: #fff;
      position: fixed;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      justify-content: center;
      & > view{
        height: 55.68rpx;
        text-align: center;
        line-height: 55.68rpx;
        font-size: 21.98rpx;
        font-weight: bold;
      }
      .btn-return {
        width: 175.82rpx;
        background-color: #fff;
        border-top: 1px solid #43C9A7;
        border-left: 1px solid #43C9A7;
        border-bottom: 1px solid #43C9A7;
        border-top-left-radius: 7.33rpx;
        border-bottom-left-radius: 7.33rpx;
        color: #43C9A7;
        box-sizing: border-box;
      }
      .btn-again {
        width: 546.52rpx;
        background-color: #43C9A7;
        color: #fff;
        border-top-right-radius: 7.33rpx;
        border-bottom-right-radius: 7.33rpx;
      }
    }
  }

  @media screen and (max-width: 500px) {
    .container {
      width: 750rpx;
      background-size: 750rpx 120rpx;
      font-size: 30rpx;
      padding: 0rpx 30rpx 136rpx 30rpx;

      .game-title {
        font-size: 40rpx;
        padding-top: 40rpx;
      }

      .common {
        padding: 30rpx;
        border-radius: 30rpx;
        margin-top: 30rpx;

        .title {
          font-size: 40rpx;
          padding-bottom: 24rpx;
        }
      }

      .score {
        .times {
          padding: 20rpx;
          border-radius: 20rpx;
          margin-bottom: 20rpx;

          &>view {
            font-size: 28rpx;

            &>text:nth-child(1) {
              font-size: 40rpx;
              padding-bottom: 10rpx
            }
          }
        }

        .score-style {
          margin-top: 41rpx;
          background-size: 532rpx 174rpx;
          font-size: 36rpx;

          .score {
            &>text:nth-child(1) {
              font-size: 180rpx;
              line-height: 180rpx;
              padding-right: 10rpx;
            }
          }

          .desc {
            font-size: 28rpx;
            line-height: 45rpx;
            margin-top: 25rpx;

            text {
              padding: 0 15rpx;
            }
          }
        }
      }

      .integral {
        .content {
          font-size: 28rpx;
          margin-top: 60rpx;

          .number {
            width: 230rpx;
            flex: 0 0 230rpx;

            &>text:nth-child(1) {
              font-size: 88rpx;
              padding-right: 10rpx;
            }
          }
        }
      }

      .direction {
        .content {
          margin-top: 30rpx;

          .list {
            font-size: 30rpx;

            image {
              width: 100rpx;
              height: 100rpx;
              margin-bottom: 20rpx;
            }
          }
        }
      }

      .principle {
        .content {
          font-size: 30rpx;
          padding-top: 20rpx;
        }
      }
      .btm-fixed-btn {
        width: 750rpx;
        max-width: 750rpx;
        height: 116rpx;
        & > view{
          height: 96rpx;
          line-height: 96rpx;
          font-size: 34rpx;
          font-weight: bold;
        }
        .btn-return {
          width: 214rpx;
          border-top-left-radius: 12rpx;
          border-bottom-left-radius: 12rpx;
        }
        .btn-again {
          width: 486rpx;
          border-top-right-radius: 12rpx;
          border-bottom-right-radius: 12rpx;
        }
      }
    }
  }
</style>
