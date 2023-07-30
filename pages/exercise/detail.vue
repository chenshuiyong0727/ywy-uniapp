<template>
  <view>
   
    <nav-bar title='趣味健脑'></nav-bar>
    
    <view class="applet-detail-contain">
      <view class="common direction">
        <view class="_h6">{{trainDetail.name}}</view>
        <view class="c-content">
          <view class="list" v-if="trainDetail.trainingDirectionOne">
            <image :src="'../../static/images/applet/icon_'+trainDetail.trainingDirectionOne+'_new.png'" />
            <view>{{trainDetail.trainingDirectionOneCN}}</view>
          </view>
          <view class="list" v-if="trainDetail.trainingDirectionTwo">
            <image :src="'../../static/images/applet/icon_'+trainDetail.trainingDirectionTwo+'_new.png'" />
            <view>{{trainDetail.trainingDirectionTwoCN}}</view>
          </view>
          <view class="list" v-if="trainDetail.trainingDirectionThree">
            <image :src="'../../static/images/applet/icon_'+trainDetail.trainingDirectionThree+'_new.png'" />
            <view>{{trainDetail.trainingDirectionThreeCN}}</view>
          </view>
        </view>
      </view>
      <view class="illustration">
        <view class="_h6">操作图示</view>
        <view class="content">
          <view class="list" v-if="trainDetail.operationDiagramOne">
            <image :src="imgPrefix + trainDetail.operationDiagramOne" />
          </view>
          <view class="list" v-if="trainDetail.operationDiagramTwo">
            <image :src="imgPrefix + trainDetail.operationDiagramTwo" />
          </view>
          <view class="list" v-if="trainDetail.operationDiagramThree">
            <image :src="imgPrefix + trainDetail.operationDiagramThree" />
          </view>
        </view>
      </view>
      <view class="common principle">
        <view class="_h6">锻炼说明</view>
        <view class="c-content">
          <rich-text :nodes="trainDetail.scientificPrinciples"></rich-text>
        </view>
      </view>
      <view class="operate">
        <view class="btn" @click="goExercise">立即锻炼</view>
      </view>
    </view>
  </view>

</template>

<script>
  import navBar from '@/components/nav-bar'
  import { navigateTo } from '../../utils/util'
  import { envSetting } from '@/utils/env.js'
  export default {
    components: {
      navBar
    },
    data() {
      return {
        trainId: -1,
        trainDetail: {},
        userInfo: {},
        imgPrefix: this.$imgPrefix
      }
    },
    onLoad(options) {
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
      if (options.id) {
        this.trainId = options.id
        this.getDetail()
      }
    },
    methods: {
      getDetail() {
        getApp().loginStatus().then((loginRes) => {
          this.$request({
            url: '/gw/h5/v1/training/record',
            method: 'get',
            data: {
              id: this.trainId,
              token: this.userInfo.token
            }
          }).then(res => {
            if (res.status === 1000) {
             
              this._formateData(res.data, 'trainingDirectionOne')
              this._formateData(res.data, 'trainingDirectionThree')
              this._formateData(res.data, 'trainingDirectionTwo')
              this.trainDetail = res.data
             
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
      goExercise() {
        getApp().loginStatus().then(async (loginRes) => {
          const res = await this.$request({
            url: '/gw/h5/v1/training/start',
            method: 'post',
            data: {
              userId: this.userInfo.userId,
              trainingProjId: this.trainDetail.id,
              token: this.userInfo.token
            }
          })
          if (res.status === 1000) {
            let gameName = ['fensui', 'xzxx', 'vuegamejfcz', 'H5caici', 'lhchb', 'jybw', 'emoji', 'zylxl',
              'jylxl'
            ]
            navigateTo('/pages/web-view/web-view', {
              link: `${envSetting.baseURL}/game/project/${gameName[this.trainDetail.id - 1]}/index.html?trainingProjId=${this.trainDetail.id}&userId=${this.userInfo.userId}&redirectUrl=/pages/exercise/result`
              // link: 'http://192.168.1.212:3000'
            })
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })


        // window.location.href = `https://natt.yimed.cn:11900/game/project/${gameName[this.trainDetail.id - 1]}/index.html?trainingProjId=${this.trainDetail.id}&userId=1&redirectUrl='/pages/exercise/result'`
        // navigateTo('/pages/web-view/web-view', {
        // 	link: `https://natt.yimed.cn:11900/game/project/${gameName[this.trainDetail.id - 1]}/index.html?trainingProjId=${this.trainDetail.id}&userId=1&redirectUrl='/pages/exercise/result'`
        // })
      },
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  .applet-detail-contain {
    min-height: 100vh;
    width: 100%;
    max-width: 750.02rpx;
    margin: 0 auto;
    background-color: #F4F4F4;
    box-sizing: border-box;
    font-size: 21.97rpx;
    color: #222;
    padding: 0px 21.97rpx 131.84rpx 21.97rpx;
    overflow: hidden;

    .common {
      padding: 21.97rpx;
      box-sizing: border-box;
      border-radius: 21.97rpx;
      margin-top: 21.97rpx;
      background-color: #fff;

      ._h6 {
        font-size: 26.37rpx;
        color: #16171C;
        border-bottom: 1px solid #F7F8F9;
        padding-bottom: 17.58rpx;
      }
    }

    .direction .c-content {
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-top: 21.97rpx;

      .list {
        font-size: 20.51rpx;
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

    .illustration {
      width: 100%;
      margin-top: 40.28rpx;

      ._h6 {
        font-size: 26.37rpx;
        color: #16171C;
        padding-bottom: 18.31rpx;
        padding-left: 21.97rpx;
      }

      .content {
        width: 728.05rpx;
        overflow: auto;
        display: flex;

        &::-webkit-scrollbar {
          display: none
        }

        .list {
          padding-right: 14.65rpx;
        }

        image {
          width: 689.23rpx;
          height: 542.01rpx;
          display: block;
          flex: 0 0 505.38rpx;
          border-radius: 21.97rpx;
        }
      }
    }

    .principle .c-content {
      color: #666;
      font-size: 20.51rpx;
      padding-top: 14.65rpx;
    }

    .operate {
      position: fixed;
      padding: 14.65rpx 21.97rpx;
      background-color: #fff;
      bottom: 0px;
      left: 0;
      right: 0;

      .btn {
        width: 100%;
        height: 73.24rpx;
        border-radius: 36.62rpx;
        text-align: center;
        line-height: 73.24rpx;
        font-size: 24.9rpx;
        color: #fff;
        background-color: #FF781E;
        box-sizing: border-box;
      }
    }
  }

  /*适配手机端*/
  @media screen and (max-width: 500px) {
    .applet-detail-contain {
      font-size: 30rpx;
      padding: 0px 30rpx 180rpx 30rpx;

      .common {
        padding: 30rpx;
        border-radius: 30rpx;
        margin-top: 30rpx;

        ._h6 {
          font-size: 36rpx;
          padding-bottom: 24rpx;
        }
      }

      .direction .c-content {
        margin-top: 30rpx;

        .list {
          font-size: 28rpx;

          image {
            width: 100rpx;
            height: 100rpx;
            margin-bottom: 20rpx;
          }
        }
      }

      .illustration {
        margin-top: 55rpx;

        ._h6 {
          font-size: 36rpx;
          padding-bottom: 25rpx;
          padding-left: 30rpx;
        }

        .content {
          width: 720rpx;

          .list {
            padding-right: 20rpx;
          }

          image {
            width: 690rpx;
            height: 542rpx;
            flex: 0 0 690rpx;
            border-radius: 30rpx;
          }
        }
      }

      .principle .c-content {
        font-size: 28rpx;
        padding-top: 20rpx;
      }

      .operate {
        padding: 20rpx 30rpx;

        .btn {
          height: 100rpx;
          border-radius: 50rpx;
          line-height: 100rpx;
          font-size: 34rpx;
        }
      }
    }
  }
</style>
