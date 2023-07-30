<template lang="html">
  <view class="login_new" >
    <view style="
    font-size: 10px;
    padding-top: 15vw;
    padding-left: 4vw;
    max-width: 264px!important;
    max-height: 494px!important;
    margin: 42px auto!important;
    width: 100%!important;
    height: 336px!important;
    display: flex;
    flex-direction: column;
    align-items: center;
" >
      <u-navbar  :title="title" >
        <view @click="$goBack" class="u-nav-slot" slot="left">
          <u-icon name="arrow-left" size="20"></u-icon>
        </view>
      </u-navbar>
      <h5 style="font-size: 17px;margin-top: 40px;color: #999;">当前账号</h5>
      <h5 style="font-size: 30px; font-weight: 600; margin-top: 20px;">{{
         userName ? userName : '系统用户'
        }}</h5>
      <view v-if="type == 1">
        <u-button style="margin-top: 42px; width: 66vw;" type="primary" @click="comfirm">退出登录</u-button>
<!--        <u-button style="margin-top: 10px; width: 66vw;" @click="comfirm1">切换账号</u-button>-->
      </view>
      <view class="clearfix btm-distance" v-else>
        <u-button style="margin-top: 42px; width: 66vw;" type="primary" @click="comfirm2">修改密码</u-button>
      </view>
    </view>


  </view>
</template>

<script>
// import { userContainerApi } from '@/api/user'
// import { removeCookieByName } from '@/utils/auth'
export default {
  components:{
  },
  // created() {
  //   const { type } = this.$route.query
  //   this.type = type
  //   if (this.type == 2) {
  //     this.title = '账户管理'
  //   }
  // },
  onLoad(options) {
    if (options) {
      this.type = options.type ? options.type : ''
      if (this.type == 2) {
        this.title = '账户管理'
      }
    }
  },
  mounted() {

  },
  data(){
    return {
      type:'1',
      title: '账号设置',
      userName: uni.getStorageSync('user_name')
    }
  },
  methods:{
    //退出登录按钮
    logout(){
      this.$request({
        url: '/gw/op/v1/sys/users/logout',
        method: 'get'
      }).then(res => {
        if (res.subCode === 1000) {
          uni.clearStorageSync();
          uni.showToast({
            title: '退出登录成功',
            icon: 'none'
          })
          this.$navigateTo('/pages/login/index')
        }
      })
    },

    comfirm(){
      // this.$confirm('确认退出登录',"提示",{
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type:"warning",
      // }).then(() => {
      //   this.logout()
      //   // this.gotoAdd(null,3)
      // }).catch(() => {
      //   // this.goBack()
      // })
      var _this = this;
      uni.showModal({
        title: '',
        confirmColor:'#409eff',
        content: '确认退出登录',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            _this.logout()
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });

    },
    // comfirm1(){
    //   // this.$confirm('确认切换账号',"提示",{
    //   //   confirmButtonText: '确定',
    //   //   cancelButtonText: '取消',
    //   //   type:"warning",
    //   // }).then(() => {
    //   //   this.logout()
    //   //   // this.gotoAdd(null,3)
    //   // }).catch(() => {
    //   //   // this.goBack()
    //   // })
    //   uni.showModal({
    //     title: '',
    //     content: '确认切换账号',
    //     confirmColor:'#409eff',//删除字体的颜色
    //     success: function (res) {
    //       if (res.confirm) {
    //         console.log('用户点击确定');
    //         this.logout()
    //       } else if (res.cancel) {
    //         console.log('用户点击取消');
    //       }
    //     }
    //   });
    // },
    comfirm2(){
        this.$router.push({ path: '/resetPwd'})
    },

  }
}

</script>

<style lang="less" scoped>
  @import '@/assets/index/style.css';
  * {
    /*margin: 0;*/
    /*padding: 0;*/
    box-sizing: border-box;
  }
  /* 这里直接设置 1rem = 50px begin */
  html {
    font-size: 10px;
  }
  /* 这里直接设置 1rem = 50px end */
  html,
  body {
    /*font-family: "微软雅黑";*/
    /*color: #333;*/
    /*background: #fff;*/
  }
  /deep/ .uni-modal .uni-modal__bd, uni-modal .uni-modal__title {
    display: none !important;
  }

</style>
