<template>
  <view>
   
    <nav-bar title='健脑运动'></nav-bar>
    
    <view class="container">
      <view :class="[isPad ? '' : 'mobile-v-top']">
        <view class="video-content">
          <video v-if="detailData.videoUrl" id="myVideo" class="video" :src='imgPrefix + detailData.videoUrl' :poster="imgPrefix + detailData.imgUrl" controls object-fit='contain'></video>
          <!-- <video v-if="detailData.videoUrl" id="myVideo" class="video" :src='videoSrc' :poster="imgPrefix + detailData.imgUrl" controls object-fit='contain'></video> -->
         
          <!-- <view class="desc desc-landscape">
            <rich-text :nodes="detailData.detail"></rich-text>
          </view> -->
        </view>
        <!-- <view class="btm-msg">
          <view>{{detailData.title}}</view>
        </view> -->
      </view>
      <!-- <view class="desc desc-portrait">
        <view><rich-text :nodes="detailData.detailPhone"></rich-text></view>
       
      </view> -->
      <!--侧边栏-->
      <fab v-if="isShowFab" :isOpenFabMenu="isPad ? true : false" :isSpecialTop="true"></fab>
      <!--end 侧边栏-->
    </view>
  </view>

</template>

<script>
  import fab from '@/components/fab'
  import navBar from '@/components/nav-bar'
  import { envSetting } from '@/utils/env.js'
  import {mixin} from '@/mixin/mixin'
  export default {
    mixins:[mixin],
    components: {
      navBar,
      fab
    },
    data() {
      return {
        userInfo: {},
        videoContext: null,
        detailId: '',
        detailData: {},
        videoSrc: '',
        videoPlay: null,
        isPad: this.$pad,
        imgPrefix: this.$imgPrefix
      }
    },
    onLoad(options) {
      this.detailId = options.id
    },
    mounted() {
      this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
      this.videoContext = uni.createVideoContext('myVideo')
      this.getDetail()
      // 进入页面，当日已完成健脑运动
      uni.setStorageSync(this.userInfo.userId + '-hasDoMicromotion', 'yes')
    },
    onReady() {
      
    },
    methods: {
      
      // initVideo(src) {
      //   // #ifdef H5
      //   // let video = document.createElement('video')
      //   // video.id = 'video'
      //   // video.controls = true
      //   // let source = document.createElement('source')
      //   // source.src = src
      //   // video.appendChild(source)
      //   // this.$refs.video.$el.appendChild(video)
      //   // this.videoPlay = videojs('video', {
      //   //   fluid: true, // 自适应宽高
      //   //   muted: false, //  是否静音
      //   //   aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
      //   //   controls: true, //是否拥有控制条 【默认true】,如果设为false ,那么只能通过api进行控制了。也就是说界面上不会出现任何控制按钮
      //   //   autoplay: false, //如果true,浏览器准备好时开始回放。 autoplay: "muted", // //自动播放属性,muted:静音播放
      //   //   loop: false, // 导致视频一结束就重新开始。 视频播放结束后，是否循环播放
      //   //   screenshot:true,
      //   //   preload: 'metadata',
      //   //   playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
      //   // })
      //   let video = document.createElement('video');
      //   video.id = 'video';
      //   video.controls = true;
      //   video.preload="auto"
      //   video.setAttribute('playsinline', true) //IOS微信浏览器支持小窗内播放
      //   video.setAttribute('webkit-playsinline', true) //这个bai属性是ios 10中设置可以让视频在小du窗内播放，也就是不是全zhi屏播放的video标签的一个属性
      //   // video.setAttribute('x5-video-player-type', 'h5') //安卓 声明启用同层H5播放器 可以在video上面加东西
      //   let source = document.createElement('source');
      //   source.src = src;
      //   // source.type = 'application/x-mpegURL';
      //   video.appendChild(source);
      //   this.$refs.video.$el.appendChild(video);
      //   let that = this;
      //   let player = this.$video('video', {
      //     poster: '', // 视频封面图地址
      //     title:'',
      //     // playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
      //     // autoDisable: true,
      //     preload: 'metadata', //auto - 当页面加载后载入整个视频 meta - 当页面加载后只载入元数据 none - 当页面加载后不载入视频
      //     language: 'zh-CN',
      //     fluid: true, // 自适应宽高
      //     muted: false, //  是否静音
      //     aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
      //     controls: true, //是否拥有控制条 【默认true】,如果设为false ,那么只能通过api进行控制了。也就是说界面上不会出现任何控制按钮
      //     autoplay: false, //如果true,浏览器准备好时开始回放。 autoplay: "muted", // //自动播放属性,muted:静音播放
      //     loop: false, // 导致视频一结束就重新开始。 视频播放结束后，是否循环播放
      //     screenshot:true,
      //     // controlBar: {
            
      //     //   timeDivider: true, // 时间分割线
      //     //   durationDisplay: true, // 总时间
      //     //   progressControl: true, // 进度条
      //     //   remainingTimeDisplay: true, //当前以播放时间
      //     //   fullscreenToggle: true, //全屏按钮
      //     // }
      //   }, function() {
      //     this.on('error', function(err) { //请求数据时遇到错误
      //       console.log("请求数据时遇到错误",err)
      //     });
      //     this.on('stalled', function(stalled) { //网速失速
      //       console.log("网速失速",stalled)
      //     })
      //   })
      //   // #endif
      // },
      
      getDetail() {
        this.$request({
          url: '/gw/h5/v1/front/ucServicePack/microSport/detail',
          method: 'get',
          data: {
            id: this.detailId,
            token: this.userInfo.token
          }
        }).then(res => {
          if (res.status === 1000) {
            this.detailData = res.data
            const arr = res.data ? res.data.videoUrl.split('/') : []
            const videoName = arr.length ? arr[arr.length - 1] : ''
            this.videoSrc = `${envSetting.baseURL}/gw/h5/v1/front/file/play?fileName=${videoName}`
            // #ifdef H5
            // this.initVideo(this.videoSrc)
            // #endif
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    width: 750.02rpx;
    max-width: 750.02rpx;
    margin: 0 auto;

    .video-content {
      display: flex;
      height: 562.64rpx;

      .video {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
  // ::v-deep .video-js .vjs-big-play-button {
  //   left: 50%;
  //   top: 50%;
  //   transform: translate(-50%, -50%);
  // }
  // ::v-deep .vjs-button>.vjs-icon-placeholder:before {
  //   line-height: 1.2;
  // }
  
  @media screen and (max-width: 500px) {
    .container {
      max-width: 750rpx;
      margin: 0 auto;
      padding-bottom: 30rpx;
      .mobile-v-top {
        background-color: #fff;
      }
      .video-content {
        display: flex;
        height: 448rpx;
    
        .video {
          width: 100%;
          height: auto;
        }
        .desc-landscape {
          display: none;
        }
      }
      // .btm-msg {
      //   font-size: 44rpx;
      //   padding: 26rpx 28rpx;
      // }
      
      // .desc {
      //   margin: 20rpx auto;
      //   width: 694rpx;
      //   padding: 30rpx;
      //   border-radius: 20rpx;
      //   font-size: 28rpx !important;
      //   background-color: #fff;
      //   color: #666666;
      // }
    } 
  }
</style>
