<template>
  <view>
    <view class="login-wrapper">
      <nav-bar
        title="和家健脑"
        :isShowRightIcon="false"
        :isShowLeftIcon="false"
      ></nav-bar>

      <view class="flex-center">
        <view class="login-title">
          <image
            class="logo-image"
            :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-logo.png'"
          ></image>
          <text class="login-text">欢迎来到和家健脑</text>
        </view>
        <view v-if="!otherPhoneLogin && !isInApplet">
          <!-- #ifndef MP-WEIXIN-->
          <block v-if="!isPad">
            <view
              v-if="(hasPreLogin || environment)"
              style="position: relative; z-index: 1"
              @click="phoneNumberLogin"
              class="origin-phone phone-login"
            >
              <text>本机号码一键登录</text>
              <!-- <guid-modal
                @closeHandle="closeGuide"
                @nextHandle="nextGuide"
                :width="200"
                :height="80"
                class="t-container"
                v-if="guidmodal && !isPad"
                :leftPos="-70"
                :bottomPos="-430"
                :title="title6"
                :gestureLeftPos="500"
                :gestureTopPos="-330"
                :gestureType="1"
              ></guid-modal>
              <guid-modal
                @closeHandle="closeGuide1"
                @nextHandle="nextGuide1"
                :width="200"
                :height="80"
                class="t-container"
                v-if="guidmodal2 && !isPad"
                :leftPos="-70"
                :bottomPos="-430"
                :title="title7"
                :gestureLeftPos="500"
                :gestureTopPos="-230"
                :gestureType="1"
              ></guid-modal> -->
            </view>
          </block>
          <!-- #endif -->
          <!-- #ifdef MP-WEIXIN -->
          <button
            v-if="isPad"
            class="vx-container"
            open-type="getPhoneNumber"
            @getphonenumber="getPhoneNumber"
          >
            <text>微信登录</text>
          </button>
          <button
            v-else
            class="vx-container1"
            open-type="getPhoneNumber"
            @getphonenumber="getPhoneNumber"
          >
            <text>微信登录</text>
          </button>
          <block>
            <view
              @click="
                otherPhoneLogin = true
                mpWexin = false
              "
              class="otherPhone-login"
            >
              <text>手机号码登录</text>
            </view>
          </block>
          <!-- #endif -->
          <block v-if="!isPad">
            <view
              v-if="environment"
              @click="otherPhoneLogin = true"
              class="otherPhone-login"
            >
              <text>手机号码登录</text>
            </view>
          </block>
        </view>
        <view v-if="!phoneWay && !accountWay">
          <!-- <view
          @click="phoneWay = true"
          class="phone-login"
          style="margin-bottom: 13.18rpx"
        >
          <text>手机号码登录</text>
        </view> -->
          <!-- <view @click="accountWay = true" class="user-login">
          <text>账号密码登录</text>
        </view> -->
        </view>
        <view v-if="accountWay && !phoneWay">
          <view class="account-box">
            <view class="account-icon"></view>
            <input
              type="text"
              v-model="account"
              class="text-input"
              placeholder="请输入您的账号"
            />
          </view>
          <view style="display: flex">
            <view class="password-box">
              <view class="password-icon"></view>
              <input
                v-model="password"
                type="password"
                class="code-input"
                placeholder="输入您的密码"
              />
            </view>
          </view>
        </view>
        <view v-if="((otherPhoneLogin || !environment || isPad) && !mpWexin) || isInApplet">
          <view :class="[{ 'account-focus': accountFocus1 }, 'phone-box']">
            <view v-if="!accountFocus1" class="phone-icon"></view>
            <view v-else class="phone-icon1"></view>
            <view v-if="isPad" style="position: relative">
              <input
                @focus="accountFocus"
                @blur="accountBlur"
                :adjust-position="false"
                placeholder-style="font-size: 17rpx;color: #cccccc"
                maxlength="11"
                type="number"
                v-model="phone"
                class="text-input"
                placeholder="请输入您的手机号"
              />
              <!-- <tip
                :imageTop="-70"
                :width="220"
                :height="70"
                class="t-container"
                v-if="isGuidTip1"
                :isShowNextBtn="false"
                :isShowCloseBtn="false"
                :leftPos="270"
                :bottomPos="-20"
                :title="title1"
                :gestureType="1"
                :gestureLeftPos="-100"
                :gestureTopPos="35"
              ></tip>
              <tip
                :imageTop="-60"
                :width="240"
                :height="80"
                class="t-container"
                v-if="isGuidTip2"
                :isShowNextBtn="false"
                :isShowCloseBtn="false"
                :leftPos="280"
                :bottomPos="-120"
                :title="title3"
                :gestureLeftPos="-75"
                :gestureTopPos="15"
                :gestureType="1"
              ></tip>
              <tip
                :rightImage="false"
                :width="293"
                :height="79"
                class="t-container"
                v-if="isGuidTip3"
                :isShowNextBtn="false"
                :isShowCloseBtn="false"
                :leftPos="-320"
                :bottomPos="-170"
                :title="title2"
                :gestureLeftPos="380"
                :gestureTopPos="-43"
                :gestureType="1"
              ></tip>
              <tip
                :imageTop="-100"
                :width="455"
                :height="49"
                class="t-container"
                v-if="isGuidTip4"
                :isShowNextBtn="false"
                :isShowCloseBtn="false"
                :leftPos="-100"
                :bottomPos="-350"
                :title="title4"
                :gestureLeftPos="-30"
                :gestureTopPos="-140"
                :gestureType="5"
              ></tip>
              <tip
                :imageTop="-100"
                :width="320"
                :height="48"
                class="t-container"
                v-if="isGuidTip5"
                :isShowNextBtn="false"
                :isShowCloseBtn="false"
                :leftPos="50"
                :bottomPos="-300"
                :title="title5"
                :gestureLeftPos="120"
                :gestureTopPos="-130"
                :gestureType="1"
              ></tip> -->
            </view>
            <view v-else style="position: relative">
              <input
                :adjust-position="false"
                placeholder-style="font-size: 15.23px;color: #cccccc"
                maxlength="11"
                type="number"
                v-model="phone"
                class="text-input"
                placeholder="请输入您的手机号"
              />
              <!-- <tip
                :width="180"
                :height="32"
                :rightImage="false"
                class="t-container"
                v-if="isGuidTip1 && !isPad"
                :isShowNextBtn="false"
                :isShowCloseBtn="false"
                :leftPos="-130"
                :bottomPos="-575"
                :title="title1"
                :gestureType="1"
                :gestureLeftPos="365"
                :gestureTopPos="-550"
              ></tip>

              <tip
                :rightImage="false"
                :width="200"
                :height="30"
                class="t-container"
                v-if="isGuidTip2 && !isPad"
                :isShowNextBtn="false"
                :isShowCloseBtn="false"
                :leftPos="-130"
                :bottomPos="-575"
                :title="title3"
                :gestureLeftPos="465"
                :gestureTopPos="-430"
                :gestureType="1"
              ></tip>
              <tip
                :rightImage="false"
                :width="189"
                :height="70"
                class="t-container"
                v-if="isGuidTip3 && !isPad"
                :isShowNextBtn="false"
                :isShowCloseBtn="false"
                :leftPos="-130"
                :bottomPos="-605"
                :title="title2"
                :gestureLeftPos="130"
                :gestureTopPos="-390"
                :gestureType="1"
              ></tip>
              <tip
                :width="180"
                :height="70"
                :rightImage="false"
                class="t-container"
                v-if="isGuidTip4"
                :isShowNextBtn="false"
                :isShowCloseBtn="false"
                :leftPos="-130"
                :bottomPos="-605"
                :title="title4"
                :gestureLeftPos="40"
                :gestureTopPos="-260"
                :gestureType="6"
              ></tip>
              <tip
                :rightImage="false"
                :width="190"
                :height="50"
                class="t-container"
                v-if="isGuidTip5"
                :isShowNextBtn="false"
                :isShowCloseBtn="false"
                :leftPos="-130"
                :bottomPos="-555"
                :title="title5"
                :gestureLeftPos="390"
                :gestureTopPos="-240"
                :gestureType="1"
              ></tip> -->
            </view>
          </view>
          <view style="display: flex">
            <view
              :class="[
                { 'account-focus': codeFocus1, 'error-border': errorBorder },
                'code-box',
              ]"
            >
              <view v-if="!codeFocus1" class="code-icon"></view>
              <view v-else class="code-icon1"></view>
              <input
                @blur="codeBlur"
                @focus="codeFocus"
                :adjust-position="false"
                v-if="isPad"
                placeholder-style="font-size: 17.23rpx;color: #cccccc"
                maxlength="6"
                type="number"
                v-model="verifyCode"
                class="code-input"
                placeholder="输入验证码"
              />
              <input
                :adjust-position="false"
                v-else
                placeholder-style="font-size: 15.23px;color: #cccccc"
                maxlength="6"
                type="number"
                v-model="verifyCode"
                class="code-input"
                placeholder="输入验证码"
              />

              <text
                v-if="getCode && !isPad"
                @click="getCheckNum"
                class="get-code"
                >获取验证码</text
              >
              <!-- <text v-if="codeTime && !isPad" class="get-code">{{
                codeTime + 'S'
              }}</text> -->
              <text
                v-if="reGetCode && !isPad"
                @click="getCheckNum"
                :class="['get-code', codeTime ? 'get-code-disable' : '' ]"
                >重新获取 {{codeTime ? ' ' + codeTime + 'S' : ''}}</text
              >

              <view
                v-if="getCode && isPad"
                :class="[
                  { 'bg-pink': phone.length > 0 && getCode },
                  'get-code-container',
                ]"
              >
                <text @click="getCheckNum" class="get-code">获取验证码</text>
              </view>
              <!-- <div class="code-time-container">
                <text v-if="codeTime && isPad" class="code-time">{{
                  codeTime + 'S'
                }}</text>
              </div> -->
              <view v-if="reGetCode && isPad" :class="['reget-container', codeTime ? 'reget-container-disable' : '']">
                <text @click="getCheckNum" class="reget-code">重新获取{{codeTime ? ' '+codeTime + 'S' : ''}}</text>
              </view>
            </view>
          </view>
        </view>
        <view class="error-code" v-if="errorBorder">
          <image src="../../static/images/pages/icon-error.png"></image>
          <text>验证码错误!</text>
        </view>
        <view
          v-if="((otherPhoneLogin || !environment || isPad) && !mpWexin) || isInApplet"
          @click="login"
          :class="[
            { 'button-bg': verifyCode.length > 0 && initgetCode },
            'button-wrapper',
          ]"
        >
          <text class="login-text">登录</text>
        </view>
        <view
          v-show="accountWay"
          :class="[{ 'button-bg': password.length > 0 }, 'button-wrapper']"
        >
          <text class="login-text">登录</text>
        </view>
        <view v-if="accountWay" class="forget-password">
          <view>忘记密码</view>
          <view>手机号快捷登录</view>
        </view>
        <!-- <view @click="testWx">公众号登录</view> -->
        <view class="secure-box">
          <view class="check-box-wrap">
            <!-- checkFlag 是false -->
            <!-- <image
              class="no-check-image"
              @click="uncheckStatus"
              :src="imgPrefix + '/static/operateSteps/portalH5/pages/no-check.png'"
              v-if="!checkFlag"
            >
            </image> -->
            <view :class="['no-check-box', isClickLog ? 'no-check-animate' : 'no-check-border']" @click="uncheckStatus" v-if="!checkFlag"></view>
            <view :class="['no-check-bg', isClickLog ? '' : 'no-check-bg-border']" @click="uncheckStatus" v-if="!checkFlag"></view>
            <image
              class="check-image"
              @click="checkStatus"
              v-else
              :src="imgPrefix + '/static/operateSteps/portalH5/pages/check.png'"
            ></image>
            <!-- <checkbox-group @change="checkChange">
              <checkbox
                class="check-box"
                style="
                  transform: scale(0.65);
                  margin-left: 20px;
                  margin-right: 2px;
                "
                value="1"
                :checked="checkFlag"
              />
            </checkbox-group> -->
          </view>
          
          <view class="secure-info">
            我已阅读并同意
            <text
              style="text-decoration: underline"
              class="service-text"
              @click="toUserService"
              >《和家健脑用户服务协议》</text
            ><text
              style="margin-left: 10rpx; text-decoration: underline"
              class="private-text"
              @click="privateService"
              >《和家健脑隐私服务协议》</text
            >
            <!-- <text style="opacity: 0">1</text> -->
            <!-- <text class="text-style">《和家健脑隐私服务协议》</text> -->
          </view>
        </view>
      </view>
    </view>
    <!--账号注销提示-->
    <!-- #ifdef APP-PLUS-->
    <view class="cancel-box" v-if="platform=='ios' && isShowCancelBox">
      <view class="box-container">
        <view class="title">该账号已被注销</view>
        <view class="tip">如需使用可重新注册</view>
        <view class="btn-wrap">
          <view class="btn" @click="closeCancelBox">取消</view>
          <view class="btn btn2" @click="newRegister">重新注册</view>
        </view>
      </view>
    </view>
    <!-- #endif -->
  </view>
</template>

<script>
// import guidmodal from '@/components/guid-modal/guid-modal'
// import tip from '@/components/second-tip/second-tip'
// import tip from '@/components/guid-tip/tip'
// #ifndef APP-PLUS
import wx from 'weixin-js-sdk'
// #endif

import { getQueryString } from '@/utils/util'
import navBar from '@/components/nav-bar'
import { navigateTo, encrypt } from '../../utils/util.js'
const SystemInfo = uni.getSystemInfoSync()
export default {
  data() {
    return {
      imgPrefix: this.$imgPrefix,
      platform: this.$platform,
      isShowCancelBox: false,
      bandCustomerId: '',
      thirdUserId: '',
      accountFocus1: false,
      codeFocus1: false,
      // guidmodal2: false,
      // guidmodal: true,
      // isGuidTip1: true,
      // isGuidTip2: false,
      // isGuidTip3: false,
      // isGuidTip4: false,
      // isGuidTip5: false,
      bottomHeight: '',
      isPad: this.$pad,
      environment: true,
      hasPreLogin: true,
      otherPhoneLogin: false,
      account: '',
      password: '',
      accountWay: false,
      mySessionKey: '',
      checkFlag: false,
      isClickLog: false,
      phoneWay: false,
      errorMsg: '',
      getCode: true,
      errorBorder: false, // 出现错误的边框
      reGetCode: false, // 是否显示重新获取验证码
      codeTime: 0,
      phone: '', // 手机号码
      verifyCode: '', // 验证码
      secretKey: '123456789abc',
      initgetCode: false,
      mpWexin: false,
      redirectUrl: '',
      // H5是否嵌套在微信小程序内
      isInApplet: false,
      getNetworkType: ''
      // title1: '请填写您的手机号码',
      // title2: '请输入您收到的【和家健脑】短信中包含的验证码',
      // title3: '请点击【获取验证码】',
      // title4: '点击提示区域，则代表您同意我们为您提供服务',
      // title5: '现在您可以点击登录按钮',
      // title6: '点击按钮，使用您的手机号码快捷登录',
      // title7: '点击按钮，输入其他手机号码登录',
    }
  },
  components: {
    navBar,
    // tip,
    // guidmodal,
  },
  mounted() {
    console.log('asdfas')
    // #ifdef H5
    let ua = uni.getSystemInfoSync().ua
    if (ua.match(/MicroMessenger/i) == "MicroMessenger") {
    	wx.miniProgram.getEnv((res) => {
    		if (res.miniprogram) {
    			this.isInApplet = true
    		} else {
    			this.isInApplet = false
    		}
    	})
    } else {
      this.isInApplet = false
    }
    // #endif
    
  },
  methods: {
    uncheckStatus() {
      this.checkFlag = true
    },
    checkStatus() {
      this.checkFlag = false
    },
    accountBlur() {
      this.accountFocus1 = false
    },
    codeBlur() {
      this.codeFocus1 = false
    },
    accountFocus() {
      this.accountFocus1 = true
    },
    codeFocus() {
      this.codeFocus1 = true
    },
    // testWx() {
    //   window.location.href =
    //     'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxcfd48b43806c7d31&redirect_uri=http://wuhuiluo.com/www.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
    //   console.log(this.code)
    //   if (this.code) {
    //     //将onLoad中的获取token方法放进来即可
    //   } else {
    //     //没有code就去获取code
    //   }
    // },
    // closeGuide() {
    //   console.log('132')
    //   this.guidmodal = false
    // },
    // nextGuide1() {
    //   this.guidmodal2 = false
    // },
    // nextGuide() {
    //   console.log('444')
    //   if (this.guidmodal) {
    //     this.guidmodal = false
    //     this.guidmodal2 = true
    //   }
    // },
    // closeGuide1() {
    //   this.guidmodal2 = false
    // },
    toUserService() {
      navigateTo('/pages/agreement/reg')
    },
    privateService() {
      navigateTo('/pages/agreement/pay')
    },
    getUserInfo(res, tab) {
      this.$request({
        url: '/gw/h5/v1/front/user/getUcUser',
        method: 'post',
        data: {
          token: res.data.token,
        },
      }).then((infoRes) => {
        if (infoRes.status === 1000) {
          let data = {
            ...res.data,
            info: infoRes.data,
          }
          uni.setStorageSync('userInfo', JSON.stringify(data))
          if (tab === 1) {
            navigateTo('/pages/register/index')
          } else {
            this.backToPage()
          }
        }
      })
    },
    phoneNumberLogin() {
      // #ifndef H5
      if (!this.checkFlag) {
        this.isClickLog = true
        uni.showToast({
          title: '请您先勾选协议',
          icon: 'none',
          duration: 2000,
        })
        setTimeout(() => {
          this.isClickLog = false
        }, 2400)
        return
      }
      uni.showLoading({
        title: '加载中',
      })
      setTimeout(function () {
        uni.hideLoading()
      }, 1000)
      uni.login({
        //正式登录，弹出授权窗
        provider: 'univerify',
        univerifyStyle: {
          // 自定义登录框样式
          fullScreen: false, // 是否全屏显示，true表示全屏模式，false表示非全屏模式，默认值为false。
          backgroundColor: '#ffffff', // 授权页面背景颜色，默认值：#ffffff
          phoneNum: {
            color: '#2281F5', // 手机号文字颜色 默认值：#000000
          },
          authButton: {
            normalColor: '#3479f5', // 授权按钮正常状态背景颜色 默认值：#3479f5
            highlightColor: '#2861c5', // 授权按钮按下状态背景颜色 默认值：#2861c5（仅ios支持）
            disabledColor: '#73aaf5', // 授权按钮不可点击时背景颜色 默认值：#73aaf5（仅ios支持）
            textColor: '#ffffff', // 授权按钮文字颜色 默认值：#ffffff
            title: '本机号码一键登录', // 授权按钮文案 默认值：“本机号码一键登录”
          },
        },
        success: (res) => {
          // 正式登录成功
          // console.log('this',this)
          // const that = this
          // console.log('res', res.authResult.access_token) // {openid:'登录授权唯一标识',access_token:'接口返回的 token'}
          // uni.request({
          //   url: 'https://664e51c1-c1e4-48f0-9eb4-6f92371b487f.bspapp.com/portal/getPhoneNumber',
          //   data: {
          //     access_token: res.authResult.access_token, // 客户端一键登录接口返回的access_token
          //   },
          // }).then(res2 => {
          //   console.log(res2,'res')
          // })

          // 在得到access_token后，通过callfunction调用云函数
          uniCloud.callFunction({
            name: 'getPhoneNumber', // 云函数名称
            data: {
              //传给云函数的参数
              access_token: res.authResult.access_token, // 客户端一键登录接口返回的access_token
              openid: res.authResult.openid, // 客户端一键登录接口返回的openid
            },
            success: (callRes) => {
              // 调用注销状态接口，查看该账号是否注销了
              // #ifdef APP-PLUS
              
              if (this.$platform == 'ios') {
                this.this.$request({
                  url: '/gw/h5/v1/front/user/memberLogoutStatus',
                  method: 'post',
                  data: {
                    phone: this.phone
                  }
                }).then(res => {
                  if (res.data.status == 3) {
                    // 已注销
                    this.isShowCancelBox = true
                    return
                  } else {
                    const newObj = { ...callRes.result }
                    this.phone = newObj.phoneNumber
                    this.loginRequest()
                  }
                })
              }
              // #endif
              // #ifndef APP-PLUS
              const newObj = { ...callRes.result }
              this.phone = newObj.phoneNumber
              this.loginRequest()
              // #endif
              
              // this.$request({
              //   url: '/gw/h5/v1/front/user/regeditOrLogin',
              //   method: 'post',
              //   data: {
              //     phone: newObj.phoneNumber,
              //     thirdUserId: this.thirdUserId ? this.thirdUserId : '',
              //     bandCustomerId: this.bandCustomerId
              //       ? this.bandCustomerId
              //       : '',
              //   },
              // }).then((res) => {
              //   if (res.status === 1000) {
              //     if (res.data.isRegistered) {
              //       this.getUserInfo(res, 1)
              //     } else {
              //       this.getUserInfo(res, 2)
              //     }
              //   }
              // })
            },
            fail(callErr) {
              uni.showToast({
                title: callErr.errMsg,
                icon: 'none',
              })
            },
            complete() {
              uni.closeAuthView() //关闭授权登录界面
            },
          })
        },
        fail(err) {
          // 正式登录失败
          uni.showToast({
            title: err.errorMsg,
            icon: 'none',
          })
          uni.closeAuthView() //关闭授权登录界面
        },
      })
      // #endif

      // #ifdef H5
      if (!this.checkFlag) {
        this.isClickLog = true
        uni.showToast({
          title: '已勾选后点击，才能进入对应运营商授权页面',
          icon: 'none',
        })
        setTimeout(() => {
          this.isClickLog = false
        }, 2400)
        return
      }
      uni.showLoading({
        title: '加载中',
      })
      setTimeout(function () {
        uni.hideLoading()
      }, 2000)
      // uni.setStorageSync('netWorkFlag', '1')
      window.JVerificationInterface.init({
        appkey: '4e150019d960f338515618d5',
        debugMode: true,
        success: (data) => {
          
          window.JVerificationInterface.loginAuth({
            operater: 'CM',
            type: 'full',
            success: (data) => {
              // uni.removeStorageSync('netWorkFlag')
              //TODO 一键登录获取 token 成功回调
              var operater = data.operater
              var token = data.content
              this.$request({
                url: '/gw/h5/v1/front/user/loginByJg',
                method: 'post',
                data: {
                  jpToken: token,
                  thirdUserId: this.thirdUserId ? this.thirdUserId : '',
                  bandCustomerId: this.bandCustomerId
                    ? this.bandCustomerId
                    : '',
                },
              }).then((res) => {
                if (res.status === 1000) {
                  // 第一次注册 为1
                  if (res.isRegistered) {
                    this.getUserInfo(res, 1)
                  } else {
                    this.getUserInfo(res, 2)
                  }
                }
              })
            },
            fail:  (data) => {
              // console.log('asdfas21', this.getNetworkType)
              let platForm = uni.getSystemInfoSync().platform
              if (platForm == 'ios') {
                this.otherPhoneLogin = true
                
                // setTimeout(() => {
                //   this.otherPhoneLogin = false
                // }, 1500)
              } else {
                this.otherPhoneLogin = false
              }
              
              
              //TODO 一键登录获取 token 失败回调
            },
          })
        },
        fail: function (data) {
          console.log('asdfas213523', this.otherPhoneLogin)
          this.otherPhoneLogin = false
          //TODO 初始化失败回
        },
      })
      // #endif
    },
    // async accountLogin() {
    //   const newPassword = encrypt(this.password, '58d10555a17a4039')
    //   const res = await this.$request({
    //     url: '/gw/h5/v1/front/user/loginByAccont',
    //     method: 'post',
    //     data: {
    //       account: this.account,
    //       userPwd: newPassword,
    //     },
    //   })
    //   if (res.status === 1000) {
    //     uni.setStorageSync('userInfo', JSON.stringify(res.data))
    //     if (res.data.isRegistered) {
    //       navigateTo('/pages/register/index')
    //     } else {
    //       this.backToPage()
    //     }
    //   } else {
    //     uni.showToast({
    //       title: '账号不存在',
    //       icon: 'none',
    //     })
    //     return
    //   }
    // },

    // #ifdef MP-WEIXIN
    async getPhoneNumber(e) {
      uni.showLoading({
        title: '加载中',
      })
      setTimeout(function () {
        uni.hideLoading()
      }, 1000)
      uni.login({
        provider: 'weixin',
        success: (loginRes) => {
          let code = loginRes.code
          this.$request(
            {
              url: '/gw/h5/v1/front/user/getWxInfo',
              method: 'get',
              data: {
                code,
              },
            },
            false
          ).then((res) => {
            if (res.status === 1000) {
              if (res.data.isRegistered) {
                // 第一次注册 为1 才有MysessionKey
                this.mySessionKey = res.data.mySessionKey
                if (!this.mySessionKey || !e.detail.encryptedData) {
                  return
                }
                this.$request({
                  url: '/gw/h5/v1/front/user/getNewPhoneNoInfo',
                  method: 'post',
                  data: {
                    code: e.detail.code,
                    mySessionKey: this.mySessionKey,
                    thirdUserId: this.thirdUserId ? this.thirdUserId : '',
                    bandCustomerId: this.bandCustomerId
                      ? this.bandCustomerId
                      : '',
                  },
                }).then((res) => {
                  if (res.status === 1000) {
                    this.getUserInfo(res, 1)
                  }
                })
              } else {
                this.getUserInfo(res, 2)
              }
            }
          })
        },
      })
    },
    // #endif
    // checkChange(e) {
    //   if (e.detail.value.length > 0) {
    //     this.checkFlag = true
    //     // if (this.isGuidTip4) {
    //     //   this.isGuidTip4 = false
    //     //   this.isGuidTip5 = true
    //     // }
    //   } else {
    //     this.checkFlag = false
    //   }
    // },
    onLoad(options) {
      var pages = getCurrentPages()
      var page = pages[pages.length - 1]
      const { thirdToken } = page.options ? page.options : ''
      const { thirdUserId } = page.options ? page.options : ''
      const { bandCustomerId } = page.options ? page.options : ''
      this.redirectUrl = options.redirectUrl ? options.redirectUrl : ''
      const token = thirdToken
      this.thirdUserId = thirdUserId
      this.bandCustomerId = bandCustomerId
      if (token) {
        this.$request({
          url: '/gw/h5/v1/front/user/loginByThirdToken',
          method: 'post',
          data: {
            thirdToken: token,
          },
        })
          .then((res) => {
            if (res.status === 1000) {
              this.$request({
                url: '/gw/h5/v1/front/user/getUcUser',
                method: 'post',
                data: {
                  token: res.data.token,
                },
              }).then((infoRes) => {
                if (infoRes.status === 1000) {
                  let data = {
                    ...res.data,
                    info: infoRes.data,
                  }
                  uni.setStorageSync('userInfo', JSON.stringify(data))
                }
                uni.switchTab({
                  url: '/pages/index/index',
                })
              })
            }
          })
          .catch((e) => {
            console.log('e', e)
          })
      }
      const type = uni.getSystemInfoSync().uniPlatform
      if (type == 'mp-weixin') {
        this.mpWexin = true
      }
      console.log(this.mpWexin)
      const netWorkType = ['2g', '3g', '4g', '5g', 'unknown']
      uni.getNetworkType({
        success: (res) => {
          if (!netWorkType.includes(res.networkType)) {
            this.hasPreLogin = false
            this.environment = false
            this.getNetworkType = res.networkType
          }
        },
      })
      // #ifdef H5
      var verifyEnable = window.JVerificationInterface.checkVerifyEnable()
      if (!verifyEnable) {
        this.hasPreLogin = false
        this.environment = false
        return
      }
      // #endif
      const that = this
      // #ifdef APP-PLUS
      uni.preLogin({
        provider: 'univerify',
        success() {
          //预登录成功
          // 显示一键登录选项
        },
        fail(res) {
          that.hasPreLogin = false
          // 预登录失败
          // 不显示一键登录选项（或置灰）
          // 根据错误信息判断失败原因，如有需要可将错误提交给统计服务器
        },
      })
      // #endif
    },
    backToPage() {
      if (this.redirectUrl) {
        // 跳回指定重定向地址
        if (this.redirectUrl.includes('pages/index/index')) {
          uni.switchTab({
            url: '/pages/index/index',
          })
        } else if (this.redirectUrl.includes('pages/my/index')) {
          uni.switchTab({
            url: '/pages/index/index',
          })
        } else {
          uni.redirectTo({
            url: this.redirectUrl,
          })
        }
        return
      }
      const pages = getCurrentPages()
      if (pages.length === 1) {
        uni.switchTab({
          url: '/pages/index/index',
        })
        // history.back()
        return
      }
      
      const currentPage = pages[0]
      // const currentPage = pages[pages.length - 2]
      const options = currentPage?.options ? currentPage.options : {}
      const url = currentPage?.route
      console.log('asdfa', currentPage)

      if (Object.keys(options).length === 0) {
        if (url.includes('pages/index/index')) {
          uni.switchTab({
            url: '/pages/index/index',
          })
        } else if (url.includes('pages/my/index')) {
          uni.switchTab({
            url: '/pages/index/index',
          })
        } else {
          uni.navigateTo({
            url: `/${url}`,
          })
        }
      } else {
        let urlOptions = '?'
        for (const [key, value] of Object.entries(options)) {
          urlOptions = urlOptions + `${key}=${value}&`
        }
        const newOptions = urlOptions.substr(0, urlOptions.length - 1)
        let newUrl = `/${url}${newOptions}`
        if (newUrl.includes('/pages/index/index')) {
          uni.switchTab({
            url: newUrl,
          })
        } else {
          uni.redirectTo({
            url: newUrl,
          })
        }
      }
    },
    moveOutPassword(e) {
      const { value } = e.detail
      let reg = /^[1][3,4,5,7,8,9][0-9]{9}$/
      if (!reg.test(value) && this.phone.length === 11) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none',
        })
        return
      }
    },
    async getCheckNum() {
      if (this.codeTime) return 
      this.errorBorder = false
      this.initgetCode = true

      if (this.phone.trim() === '') {
        uni.showToast({
          title: '手机号不能为空',
          icon: 'none',
        })
        return
      } else {
        let reg = /^[1][3,4,5,7,8,9][0-9]{9}$/
        if (!reg.test(this.phone)) {
          uni.showToast({
            title: '请输入正确的手机号',
            icon: 'none',
          })
          return
        }

        if (!this.getCode) {
        } else {
          this.getCode = !this.getCode
        }
        await this.$request({
          url: '/gw/h5/v1/front/user/sendPhoneVal',
          method: 'post',
          data: {
            phone: this.phone,
          },
        })
          .then((res) => {
            if (res.status === 1000) {
              // if (this.isGuidTip2) {
              //   this.isGuidTip3 = true
              //   this.isGuidTip2 = false
              // }
              // this.reGetCode = false
              this.reGetCode = true
              this.codeTime = 60
              let timer = setInterval(() => {
                this.codeTime--
                if (this.codeTime < 1) {
                  this.reGetCode = true
                  clearInterval(timer)
                  this.codeTime = 0
                }
              }, 1000)
            } else {
              this.reGetCode = true
              // console.log('4444444')
              // this.reGetCode = false
              // this.codeTime = 60
              // let timer = setInterval(() => {
              //   this.codeTime--
              //   if (this.codeTime < 1) {
              //     this.reGetCode = true
              //     clearInterval(timer)
              //     this.codeTime = 0
              //   }
              // }, 1000)
              uni.showToast({
                title: '60秒内只能发送一次验证码!',
                icon: 'none',
              })
            }
          })
          .catch((e) => {
            this.reGetCode = true
            uni.showToast({
              title: '60秒内只能发送一次验证码!',
              icon: 'none',
            })
          })
      }
    },
    async login() {
      // if (this.isGuidTip5) {
      //   this.isGuidTip5 = false
      // }
      if (!this.initgetCode) {
        uni.showToast({
          title: '请先获取验证码',
          icon: 'none',
        })
        return
      }
      if (!this.phone) {
        uni.showToast({
          title: '请输入手机号',
          icon: 'none',
        })
        return
      }
      if (this.verifyCode.trim() === '') {
        uni.showToast({
          title: '验证码不能为空',
          icon: 'none',
        })
        return
      }
      let reg = /^[1][3,4,5,7,8,9][0-9]{9}$/
      if (!reg.test(this.phone) && this.phone.length === 11) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none',
        })
        return
      }
      // if (this.checkFlag && this.verifyCode !== this.entity) {
      //   this.errorBorder = true
      //   return
      // }
      if (!this.checkFlag) {
        this.isClickLog = true
        uni.showToast({
          title: '请您先勾选协议',
          icon: 'none',
          duration: 2000,
        })
        setTimeout(() => {
          this.isClickLog = false
        }, 2400)
        return
      }
      // #ifdef APP-PLUS
      // 调用注销状态接口，查看该账号是否注销了
      if (this.$platform == 'ios') {
        this.$request({
          url: '/gw/h5/v1/front/user/memberLogoutStatus',
          method: 'post',
          data: {
            phone: this.phone
          }
        }).then(res => {
          if (res.data.status == 3) {
            // 已注销
            this.isShowCancelBox = true
            return
          } else {
            this.loginRequest()
          }
        })
      }
      // #endif
      // #ifndef APP-PLUS
      this.loginRequest()
      // #endif
    },
    newRegister() {
      this.loginRequest()
    },
    closeCancelBox() {
      this.isShowCancelBox = false
    },
    async loginRequest() {
      await this.$request({
        url: '/gw/h5/v1/front/user/regeditOrLogin',
        method: 'post',
        data: {
          phone: this.phone,
          code: this.verifyCode ? this.verifyCode : '',
          thirdUserId: this.thirdUserId ? this.thirdUserId : '',
          bandCustomerId: this.bandCustomerId ? this.bandCustomerId : '',
        },
      })
        .then((res) => {
          if (res.status === 1000) {
            this.errorBorder = false
            if (res.data.isRegistered) {
              this.getUserInfo(res, 1)
            } else {
              this.getUserInfo(res, 2)
            }
          } else {
            this.errorBorder = true
          }
        })
        .catch((e) => {
          this.errorBorder = true
        })
    }
  },

  // watch: {
  //   phone(newName, oldName) {
  //     console.log('new', newName)
  //     if (newName.length == 11) {
  //       if (this.isGuidTip1) {
  //         this.isGuidTip1 = false
  //         this.isGuidTip2 = true
  //       }
  //     }
  //   },
  //   verifyCode(newCode, oldCode) {
  //     console.log('newCode', newCode)
  //     if (newCode.length == 6) {
  //       if (this.isGuidTip3) {
  //         this.isGuidTip3 = false
  //         this.isGuidTip4 = true
  //       }
  //     }
  //   },
  // },
}
</script>

<style lang="scss" scoped>
/* #ifdef APP-PLUS */
.cancel-box {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
  display: flex;
  align-items: center;
  justify-content: center;
  .box-container {
    width: 397.07rpx;
    height: 224.18rpx;
    background-color: #fff;
    border-radius: 14.65rpx;
    text-align: center;
    padding: 36.63rpx 19.05rpx 21.98rpx 19.05rpx;
    box-sizing: border-box;
    .title {
      font-size: 26.37rpx;
      font-weight: bold;
      color: #333;
      padding-bottom: 18.32rpx;
    }
    .tip {
      font-size: 19.05rpx;
      padding-bottom: 26.37rpx;
    }
    .btn-wrap {
      display: flex;
      justify-content: space-around;
      .btn {
        width: 167.03rpx;
        height: 55.68rpx;
        text-align: center;
        line-height: 55.68rpx;
        border-radius: 7.33rpx;
        border: 1px solid #43C9A7;
        font-size: 21.98rpx;
        font-weight: bold;
        color: #43C9A7;
      }
      .btn2 {
        background-color: #43C9A7;
        color: #fff;
      }
    }
  }
}
/* #endif */
.check-box-wrap {
  width: 25rpx;
  height: 25rpx;
  margin: 0rpx 10rpx 0 0rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.no-check-box {
  width: 19rpx;
  height: 19rpx;
  background:-webkit-linear-gradient(top,#6DFB93,#3EDF90);
  opacity: 0.6;
  
  border-radius: 3rpx;
  position: absolute;
  top: 0;
  right: 0;
}
.no-check-border {
  box-sizing: border-box;
}
.no-check-bg {
  background-color: #fff;
  position: absolute;
  z-index: 2;
  top: 0px;
  right: 0px;
  width: 19rpx;
  height: 19rpx;
  box-sizing: border-box;
  border-radius: 3rpx;
}
.no-check-bg-border {
  border: 1px solid #333;
}
@keyframes checkAnimate
{
	from {opacity: 1; transform: scale(1);};
	// 50% {opacity: 1; transform: scale(1.5);}; 
	to {opacity: 0.9; transform: scale(2);}
}
@-webkit-keyframes checkAnimate
{
	from {opacity: 1; -webkit-transform: scale(1);};
	// 50% {opacity: 1; -webkit-transform: scale(1.5);}; 
	to {opacity: 0.9; -webkit-transform: scale(2);}
}
.no-check-animate {
  // animation: checkAnimate 1s 2;
  animation:checkAnimate 0.3s 8 linear;
  -webkit-animation:checkAnimate 0.3s 8 linear;
}
.no-check-image {
  width: 19.04rpx;
  height: 19.04rpx;
  margin-right: 10rpx;
}

.check-image {
  width: 19.04rpx;
  height: 19.04rpx;
  flex: 0 0 19.04rpx;
  position: absolute;
  top: 0;
  right: 0;
}

.account-focus {
  background-color: #fefaff !important;
  border: 1px solid #43C9A7;
}

.code-time-container {
  position: absolute;
  right: 5%;
  top: 28.6%;
  .code-time {
    color: #753c81;
  }
}

.reget-container {
  width: 130rpx;
  height: 43.95rpx;
  line-height: 43.95rpx;
  
  background: #43C9A7;
  border-radius: 7.32rpx;
  position: absolute;
  text-align: center;
  right: 5rpx;
  top: 4.5rpx;
  .reget-code {
    width: 76.17rpx;
    height: 27.1rpx;
    font-size: 19.04rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
  }
}
.reget-container-disable {
  background-color: #ccc;
}

.bg-pink {
  background-color: #43C9A7 !important;
}

.get-code-container {
  width: 121.58rpx;
  height: 43.95rpx;
  background: #ccc;
  border-radius: 7.32rpx;
  text-align: center;
  line-height: 43.95rpx;
  .get-code {
    width: 95.21rpx;
    height: 27.1rpx;
    font-size: 21.04rpx !important;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff !important;
  }
}
/* .t-container {
  width: 234.35rpx;
  height: 70.31rpx;
  background: #336cea;
  box-shadow: 0px 2.93rpx 5.86rpx 0px rgba(74, 74, 74, 0.15);
  border-radius: 8.79rpx;
} */
.login-wrapper {
  height: 100vh;
  .flex-center {
    width: 378rpx;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    .login-title {
      /* margin-right: 36.62rpx; */
      display: flex;
      align-items: center;
      height: 57.13rpx;
      font-size: 24.51rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: bold;
      color: #502459;
      margin-top: 43.95rpx;
      margin-bottom: 36.62rpx;
      .logo-image {
        margin-right: 8.79rpx;
        width: 57.13rpx;
        height: 57.13rpx;
      }
      .login-text {
        line-height: 57.13rpx;
        cursor: pointer;
      }
    }
    .phone-text {
      text-align: center;
      font-size: 20.51rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: bold;
      color: #333333;
    }
    /* .phone-login {
      margin-top: 21.97rpx;
      width: 314.94rpx;
      height: 45.41rpx;
      background: #502459;
      border-radius: 7.32rpx;
      line-height: 45.41rpx;
      text {
        font-size: 17.58rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
      }
    } */
    .otherPhone-login {
      margin-top: 13.18rpx;
      text-align: center;
      /* width: 314.94rpx; */
      height: 45.41rpx;
      border-radius: 7.32rpx;
      line-height: 45.41rpx;
      border: 1px solid #43C9A7;
      /* #ifdef MP-WEIXIN */
      padding-bottom: 5rpx;
      /* #endif */
      text {
        font-size: 17.58rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #43C9A7;
        /* #ifdef MP-WEIXIN */
        margin-bottom: 5rpx;
        /* #endif */
      }
    }
    /* #ifdef MP-WEIXIN */
    .vx-container {
      width: 360rpx;
      box-sizing: border-box;
      line-height: 46rpx;
      background: #43C9A7;
      border-radius: 8rpx;
      padding: 5.25rpx 0 5.25rpx 0;
      text-align: center;
      text {
        width: 70.31rpx;
        font-size: 20rpx !important;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
      }
    }
    .vx-container1 {
      box-sizing: border-box;
      width: 536rpx;
      height: 100rpx;
      line-height: 80rpx;
      background: #502459;
      border-radius: 12rpx;
      padding: 5.25rpx 0 5.25rpx 0;
      text-align: center;
      text {
        width: 70.31rpx;
        font-size: 32rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
      }
    }
    /* #endif */
    .center-image {
      margin: 21.97rpx 36.62rpx 21.97rpx 41.75rpx;
      image {
        width: 236.57rpx;
        height: 14.65rpx;
      }
    }
    .phone-login {
      background: #43C9A7;
      box-sizing: border-box;
      padding: 10.25rpx 0 10.25rpx 0;
      width: 314.94rpx;
      border-radius: 7.32rpx;
      /* #ifdef MP-WEIXIN */
      background: #fff;
      border: 0.73rpx solid #43C9A7;
      /* #endif */
      text-align: center;
      line-height: 25.41rpx;
      text {
        color: #fff;
        width: 105.47rpx;
        font-size: 17.58rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        /* #ifdef MP-WEIXIN */
        color: #43C9A7;
        /* #endif */
      }
    }
    .origin-phone {
      /* #ifdef MP-WEIXIN */
      background: #43C9A7 !important;
      /* #endif */
      margin-top: 21.97rpx;
      text {
        /* #ifdef MP-WEIXIN */
        color: #fff !important;
        /* #endif */
      }
    }
    .user-login {
      box-sizing: border-box;
      padding: 10.25rpx 0 10.25rpx 0;
      width: 314.94rpx;
      border-radius: 7.32rpx;
      border: 0.73rpx solid #502459;
      text-align: center;
      background-color: #fff;
      line-height: 25.41rpx;
      text {
        width: 105.47rpx;
        font-size: 17.58rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #502459;
      }
    }
    .phone-box {
      box-sizing: border-box;
      padding: 14.65rpx 13.18rpx 14rpx 13.18rpx;
      margin-bottom: 13.18rpx;
      display: flex;
      align-items: center;
      background-color: rgba(255, 255, 255, 1);
      border-radius: 7.32rpx;
      width: 380.86rpx;
      height: 54.2rpx;
      .phone-icon {
        margin-right: 11.11rpx;
        width: 28.44rpx;
        height: 28.44rpx;
        background: url('https://hjom-oss.yimed.cn/static/operateSteps/portalH5/pages/phone.png') 100% no-repeat;
        background-size: 100% 100%;
      }
      .phone-icon1 {
        margin-right: 11.11rpx;
        width: 28.44rpx;
        height: 28.44rpx;
        background: url('https://hjom-oss.yimed.cn/static/operateSteps/portalH5/pages/phone-focus.png') 100%
          no-repeat;
        background-size: 100% 100%;
      }
      .text-input {
        flex: 1;
        // width: 128.91rpx;
        height: 26.37rpx;
        overflow-wrap: break-word;
        color: #333333;
        font-size: 20.11rpx;
        text-align: left;
        white-space: nowrap;
        line-height: 30px;
        margin-top: 1px;
      }
    }
    .account-box {
      box-sizing: border-box;
      padding: 14.65rpx 13.18rpx 14rpx 13.18rpx;
      margin-bottom: 13.18rpx;
      display: flex;
      align-items: center;
      background-color: rgba(255, 255, 255, 1);
      border-radius: 7.32rpx;
      width: 314.94rpx;
      height: 45.41rpx;
      .account-icon {
        margin-right: 16.11rpx;
        width: 23.44rpx;
        height: 23.44rpx;
        background: url('https://hjom-oss.yimed.cn/static/operateSteps/portalH5/pages/account-icon.png') 100%
          no-repeat;
        background-size: 100% 100%;
      }
      .text-input {
        flex: 1;
        // width: 128.91rpx;
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
    .password-box {
      box-sizing: border-box;
      padding: 14.65rpx 13.18rpx 14rpx 13.18rpx;
      margin-bottom: 13.18rpx;
      display: flex;
      align-items: center;
      background-color: rgba(255, 255, 255, 1);
      border-radius: 7.32rpx;
      width: 314.94rpx;
      height: 45.41rpx;
      .password-icon {
        margin-right: 16.11rpx;
        width: 23.44rpx;
        height: 23.44rpx;
        background: url('https://hjom-oss.yimed.cn/static/operateSteps/portalH5/pages/password-icon.png') 100%
          no-repeat;
        background-size: 100% 100%;
      }
      .code-input {
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
    .code-box {
      position: relative;
      box-sizing: border-box;
      padding: 14.65rpx 5rpx 14rpx 13.18rpx;
      // margin-bottom: 13.18rpx;
      display: flex;
      align-items: center;
      background-color: rgba(255, 255, 255, 1);
      border-radius: 7.32rpx;
      width: 380.86rpx;
      height: 54.2rpx;
      .code-icon {
        margin-right: 11.11rpx;
        width: 28.44rpx;
        height: 28.44rpx;
        background: url('https://hjom-oss.yimed.cn/static/operateSteps/portalH5/pages/code.png') 100% no-repeat;
        background-size: 100% 100%;
      }
      .code-icon1 {
        margin-right: 11.11rpx;
        width: 28.44rpx;
        height: 28.44rpx;
        background: url('https://hjom-oss.yimed.cn/static/operateSteps/portalH5/pages/code-focus.png') 100%
          no-repeat;
        background-size: 100% 100%;
      }
      .code-input {
        flex: 1;
        width: 128.91rpx;
        height: 26.37rpx;
        overflow-wrap: break-word;
        color: #333333;
        font-size: 20.11rpx;
        text-align: left;
        white-space: nowrap;
        line-height: 30px;
        margin-top: 1px;
      }
      .get-code {
        margin-left: 1rpx;
        text-align: right;
        height: 18.31rpx;
        font-size: 13.18rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #df5c1d;
        line-height: 18.31rpx;
      }
    }
    .error-code {
      width: 140rpx;
      margin-right: 10rpx;
      height: 10.11rpx;
      font-size: 12.72rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ff6060;
      text-align: left;
      margin-left: 0rpx;
      margin-top: 15rpx;
      margin-bottom: 15rpx;
      align-self: flex-start;
      image {
        width: 18rpx;
        height: 18rpx;
        vertical-align: middle;
        margin-right: 5rpx;
      }
      text {
        vertical-align: middle;
      }
    }
    .error-border {
      border: 1px solid #ff6060;
    }
    .check-wrapper {
      margin-top: 12.11rpx;
      display: flex;
      align-items: center;
      width: 310rpx;
      height: 23.44rpx;
      margin-bottom: 49.8rpx;
      .remember {
        width: 60rpx;
        height: 20.51rpx;
        font-size: 14.65rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 20.51rpx;
        margin-top: 2px;
      }
    }
    .forget-password {
      margin-top: 11.72rpx;
      display: flex;
      justify-content: space-between;
      font-size: 11.72rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #502459;
    }
    .button-wrapper {
      background-color: #ccc;
      border-radius: 7.32rpx;
      height: 53.41rpx;
      line-height: 53.41rpx;
      width: 380rpx;
      text-align: center;
      margin-top: 29.8rpx;
      .login-text {
        width: 35.16rpx;
        height: 24.17rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        overflow-wrap: break-word;
        color: rgba(255, 255, 255, 1);
        font-size: 21.58rpx;
        line-height: 24.17rpx;
      }
    }
    .button-bg {
      background: #43C9A7;
    }
    .secure-box {
      display: flex;
      align-items: flex-start;
      margin-top: 21.97rpx;
      .secure-info {
        width: 286.6rpx;
        height: 29.3rpx;
        font-size: 17.25rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        /* color: #502459; */
        line-height: 14.65rpx;
        .service-text {
          color: #333;
        }
        .private-text {
          margin-top: 7rpx;
          display: inline-block;
          color: #333;
        }
      }
      .text-style {
        display: flex;
        /* text-decoration: underline; */
        color: #502459 !important;
      }
    }
  }
}

@media screen and (max-width: 1400px) and (min-width: 700px) {
  .reget-container {
    // padding-top: 14rpx !important;
  }
  .error-code {
    width: 130rpx !important;
    margin-right: 10rpx;
    height: 16.11rpx;
    font-size: 16.72rpx !important;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ff6060;
    line-height: 16.11rpx;
    text-align: left;
    display: block;
    margin-left: 0rpx;
    margin-top: 8rpx !important;
    align-self: flex-start;
    image {
      width: 18rpx;
      height: 18rpx;
      vertical-align: middle;
      margin-right: 5rpx;
    }
    text {
      vertical-align: middle;
    }
  }
  .button-wrapper {
    margin-top: 20rpx !important;
  }
}

@media screen and (max-width: 500px) and (min-width: 100px) {
  .login-wrapper {
    .flex-center {
      width: 545rpx;
    }
  }
  .check-box-wrap {
    width: 45rpx;
    height: 45rpx;
    margin: 0 10rpx 0 -10rpx;
  }
  .no-check-box {
    width: 33rpx;
    height: 33rpx;
    background:-webkit-linear-gradient(top,#6DFB93,#3EDF90);
    opacity: 0.6;
    
    border-radius: 5rpx;
    position: absolute;
    
  }
  .no-check-border {
    border: none;
  }
  .no-check-bg {
    top: 0rpx;
    right: 0rpx;
    width: 32rpx;
    height: 32rpx;
    border-radius: 5rpx;
    
  }
  .no-check-bg-border {
    border: 1px solid #333;
  }
  .no-check-image {
    width: 35.04rpx;
    height: 35.04rpx;
    margin-top: 10px;
    margin-left: 20px;
    margin-right: 15rpx;
  }

  .check-image {
    width: 35.04rpx;
    height: 35.04rpx;
    // margin-top: 10px;
    // margin-left: 20px;
    // margin-right: 15rpx;
    flex: 0 0 35.04rpx;
  }
  .login-title {
    height: 100% !important;
    margin-top: 124rpx !important;
    flex-direction: column !important;
    margin-right: 0 !important;
    image {
      width: 136rpx !important;
      height: 136rpx !important;
      margin-bottom: 20rpx !important;
    }
    .login-text {
      // width: 384rpx !important;
      height: 66rpx !important;
      font-size: 48rpx !important;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600 !important;
      color: #502459 !important;
      line-height: 66rpx !important;
      margin-bottom: 80rpx !important;
    }
  }
  .phone-login {
    width: 544rpx !important;
    height: 96rpx !important;
    background: #43C9A7 !important;
    border-radius: 12rpx !important;
    line-height: 75rpx !important;
    text {
      /* width: 272rpx; */
      font-size: 34rpx !important;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
    }
  }
  .otherPhone-login {
    margin-top: 20rpx !important;
    width: 540rpx !important;
    height: 96rpx !important;
    border-radius: 12rpx !important;
    line-height: 96rpx !important;
    /* margin-bottom: 36rpx !important; */

    /* #ifdef MP-WEIXIN */
    height: 80rpx !important;
    line-height: 80rpx !important;
    /* #endif */
    text {
      width: 272rpx !important;
      height: 48rpx !important;
      font-size: 34rpx !important;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400 !important;
      color: #43C9A7 !important;
    }
  }
  .secure-info {
    color: #999999 !important;
    font-size: 29rpx !important;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 34rpx !important;
  }
  .secure-box {
    justify-content: center;
    .check-box {
      margin-left: -45rpx;
      transform: scale(1.5) !important;
      /* #ifdef APP-PLUS */
      transform: scale(0.7) !important;
      /* #endif */
      /* #ifdef MP-WEIXIN */
      transform: scale(0.55) !important;
      /* #endif */
    }
  }
  .secure-info {
    width: 500rpx !important;
  }
  .phone-box {
    width: 544rpx !important;
    height: 96rpx !important;
    background: #ffffff;
    border-radius: 12rpx !important;
    .phone-icon {
      margin-left: 10rpx;
      margin-right: 16.11rpx;
      width: 48rpx !important;
      height: 48rpx !important;
      background: url('https://hjom-oss.yimed.cn/static/operateSteps/portalH5/pages/phone.png') 100% no-repeat;
      background-size: 100% 100%;
    }
    .text-input {
      // width: 242rpx !important;
      height: 48rpx !important;
      font-size: 34rpx !important;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 48rpx !important;
    }
  }
  .code-box {
    margin-top: 10rpx;
    width: 544rpx !important;
    height: 96rpx !important;
    background: #ffffff;
    border-radius: 12rpx !important;
    padding: 7px 5px 7px 6px !important;
    .code-icon {
      margin-left: 10rpx;
      margin-right: 16.11rpx;
      width: 48rpx !important;
      height: 48rpx !important;
      background-size: 100% 100%;
      background: url('https://hjom-oss.yimed.cn/static/operateSteps/portalH5/pages/code.png') 100% no-repeat;
    }
    .code-input {
      width: 242rpx !important;
      height: 48rpx !important;
      font-size: 34rpx !important;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 48rpx !important;
    }
    .get-code {
      margin-right: 0rpx !important;
      width: 230rpx !important;
      height: 80rpx !important;
      font-size: 28rpx !important;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400 !important;
      color: #fff !important;
      line-height: 80rpx !important;
      background-color: #43C9A7;
      text-align: center !important;
      border-radius: 8rpx;
    }
    .get-code-disable {
      background-color: #ccc;
      color: #fff;
    }
  }
  .button-wrapper {
    width: 544rpx !important;
    height: 96rpx !important;
    background: #ccc !important;
    border-radius: 12rpx !important;
    line-height: 96rpx !important;
    text {
      width: 68rpx !important;
      height: 48rpx !important;
      font-size: 34rpx !important;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400 !important;
      color: #ffffff;
    }
  }
  .button-bg {
    background: #43C9A7 !important;
  }
  .error-code {
    width: 200rpx !important;
    height: 46rpx !important;
    margin-right: 10rpx;
    height: 26.11rpx !important;
    font-size: 25.72rpx !important;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ff6060;
    /* line-height: 16.11rpx; */
    text-align: left;
    display: block;
    margin-left: 0rpx !important;
    margin-top: 15rpx !important;
    align-self: flex-start;
    image {
      width: 26rpx !important;
      height: 26rpx !important;
      vertical-align: middle;
      margin-right: 10rpx !important;
    }
    text {
      vertical-align: middle;
    }
  }
  /* .get-code {
    padding-left: 1rpx !important;
    width: 130rpx !important;
  }
  .remember {
    width: 100rpx !important;
  }
  .secure-info {
    line-height: 28rpx !important;
  }
  .button-wrapper {
    padding-bottom: 5rpx;
  }
  .error-code {
    margin-right: 65rpx !important;
    width: 140rpx !important;
  }
  .vx-container {
    line-height: 40rpx;
  } */
  /* #ifdef APP-PLUS */
  .cancel-box {
    .box-container {
      width: 560rpx;
      height: 326rpx;
      border-radius: 24rpx;
      padding: 50rpx 28rpx 28rpx 28rpx;
      .title {
        font-size: 36rpx;
        padding-bottom: 24rpx;
      }
      .tip {
        font-size: 32rpx;
        padding-bottom: 46rpx;
      }
      .btn-wrap {
        .btn {
          width: 240rpx;
          height: 84rpx;
          line-height: 84rpx;
          border-radius: 12rpx;
          font-size: 34rpx;
        }
      }
    }
  }
  /* #endif */
}
</style>
