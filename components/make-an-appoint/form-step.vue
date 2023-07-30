<template>
  <view class="step-content">
    <swiper class="swiper" :indicator-dots="false" :autoplay="false" duration="200" :disable-touch="true" :current="currentSwiperIndex" :style="{ height: swiperHeight + 'px' }">
      <swiper-item v-if="appointType == 1 && reAppointFlag == -1">
      	<view class="step-begin">
          <view class="title">请选择，您需要的服务：</view>
          <view class="type-list">
            <view :class="[(index == 0 && reportList.length && index == currentReportTypeIndex) || (index != 0 && index == currentReportTypeIndex) ? 'on' : '']" v-for="(item, index) in reportTypeList" :key="index" @click="chooseConsultingType(item, index)">
              <view class="no-report" v-if="index== 0 && !reportList.length"><image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-no-report-1.png'"></image><text>您当前没有评估报告，无法选择此项服务</text></view>
              <view :class="[index==0 && reportList.length ? '' : 'content0' ,'content']">
                <view class="type-list-left">
                  <image class="img-1" :src="index == 0 && !reportList.length ? imgPrefix + '/static/operateSteps/portalH5/pages/icon-no-report-2.png' : item.imgUrl"></image>
                  <view :class="[index == 0 && !reportList.length ? 'no-font' : '']">{{item.title}}</view>
                </view>
                <image class="img-2" :src="(index == 0 && reportList.length && index== currentReportTypeIndex) || (index != 0 && index == currentReportTypeIndex) ? imgPrefix + '/static/operateSteps/portalH5/pages/icon-checked.png' : imgPrefix + '/static/operateSteps/portalH5/pages/icon-check.png'"></image>
              </view>
              
            </view>
          </view>
          <view class="btn-group">
            <view class="btn-next" @click="setSwiperCurr(1, 'step-1')">下一步</view>
          </view>
        </view>
      </swiper-item>
      <swiper-item>
      	<view class="step-1">
          <view class="step-title">
            <image :src="isPad ? imgPrefix + '/static/operateSteps/step1.png' : imgPrefix + '/static/operateSteps/mobile-step1.png'"></image>
          </view>
          
          <view class="form-box">
            
            <view class="title">请选择{{appointType == 1 && reAppointFlag !=1 && businessParams.visitType == 10008 ? '评估报告及' : ''}}咨询时间</view>
            <view class="form-input form-input-spec" v-if="appointType == 1 && reAppointFlag != 1 && businessParams.visitType == 10008">
              
              <view class="re-title">
                <text>请选择评估报告</text>
                <view class="re-choose" @click="showReportBoxHandle" v-if="!isPad && businessParams.sid">
                  <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-rechange.png'"></image>
                  <text>重新选择</text>
                </view>
              </view>
              <view v-if="!businessParams.sid">
                <image class="img-add" @click="showReportBoxHandle" :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-add.png'"></image>
                <view class="tip" @click="showReportBoxHandle">
                  <text>请选择您的评估报告</text>
                </view>
              </view>
              <view class="report-style" v-else>
                <view class="_h6">评估时间：{{ chooseReportData.reporttime }}</view>
                <view class="name"><text>{{ chooseReportData.userName }}</text><text>{{chooseReportData.age}}</text><text>{{chooseReportData.education}}</text></view>
                <view class="type">评估类型：认知评估</view>
                <view class="re-choose" @click="showReportBoxHandle" v-if="isPad">
                  <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-rechange.png'"></image>
                  <text>重新选择</text>
                </view>
              </view>
            </view>
            <view class="form-input">
              <view>请选择咨询时间</view>
              <view :class="[appointTimeText ? '' : 'picker-placeholder']">
                <view class="uni-input" @click="showAppointTime">{{ appointTimeText || '请选择咨询时间' }}</view>
              </view>
            </view>
          </view>
          
          <view :class="[reAppointFlag == 1 ? 'btn-group-center' : '', 'btn-group']" v-if="appointType == 1">
            <view class="btn-pre" v-if="reAppointFlag != 1" @click="setSwiperCurr(0, 'step-begin')"><image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-pre.png'"></image><text>上一步</text></view>
            <view :class="[(businessParams.visitType == 10008 && businessParams.sid && appointTimeText) || (businessParams.visitType != 10008 && appointTimeText) ? '' : 'btn-disabled','btn-next']">
              <text v-if="reAppointFlag != 1" class="next-text" @click="setSwiperCurr(2, 'step-2')">下一步</text>
              <text v-if="reAppointFlag == 1" class="next-text" @click="setSwiperCurr(1, 'step-2')">下一步</text>
            </view>
          </view>
          <view class="btn-group" v-else>
            <view :class="[appointTimeText ? '' : 'btn-disabled', 'btn-next', 'btn-next-2']" @click="setSwiperCurr(1, 'step-2')">下一步</view>
          </view>
        </view>
      </swiper-item>
      <swiper-item>
        <view class="step-2">
          <view class="step-title">
            <image :src="isPad ? imgPrefix + '/static/operateSteps/step1.png' : imgPrefix + '/static/operateSteps/mobile-step1.png'"></image>
          </view>
          <view class="form-box">
            <view class="title">请填写预约信息</view>
            <view class="form-input">
              <view>预约人信息</view>
              <view class="name">
                <input class="uni-input" @focus="inputFocusHandle" @blur="inputBlurHandle" auto-blur :value="businessParams.userName" @input="inputChange" maxlength="10" placeholder="请填写姓名" />
              </view>
              <uni-data-select v-if="isPad" class="uni-sex-input" v-model="businessParams.gender" :localdata="sexArr" @change="sexChange" placeholder="请选择性别"></uni-data-select>
            </view>
            <view class="form-input" v-if="!isPad">
              <view>选择性别</view>
              <view class="sex">
                <uni-data-select class="uni-sex-input" v-model="businessParams.gender" :localdata="sexArr" @change="sexChange" placeholder="请选择性别"></uni-data-select>
              </view>
              
            </view>
            <view class="form-input">
              <view>出生日期</view>
              <view :class="[businessParams.birthDay ? '' : 'picker-placeholder']">
                <view class="uni-input" @click="showPicker('date', businessParams.birthDay)">{{ businessParams.birthDay || '请选择出生日期' }}</view>
              </view>
            </view>
            <view class="form-input">
              <view>学历</view>
              <view :class="[educationName ? '' : 'picker-placeholder']">
                <view class="uni-input" @click="showPicker('selector')">{{ educationName || '请选择学历' }}</view>
              </view>
            </view>
            
          </view>
        </view>
      </swiper-item>
    </swiper>
    <!--提交表单-->
    <view class="btn-appoint" v-if="((appointType == 1 && currentSwiperIndex == 2) || (appointType == 2 && currentSwiperIndex == 1) || (appointType == 1 && currentSwiperIndex == 1 && reAppointFlag == 1)) && isCanShowBtn">
      <view v-if="appointType == 1">
        <image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-pre.png'"></image>
        <text v-if="reAppointFlag != 1" @click="setSwiperCurr(1, 'step-1')">上一步</text>
        <text v-else @click="setSwiperCurr(0, 'step-1')">上一步</text>
      </view>
      <view @click="setSwiperCurr(0, 'step-1')" v-else><image :src="imgPrefix + '/static/operateSteps/portalH5/pages/icon-pre.png'"></image><text>上一步</text></view>
      <view>
        <payment 
          @goBack="goBack" 
          @closePayResultHandle="closePayResultHandle" 
          :price="buyParams.amount" 
          :goodsId="buyParams.goodsId" 
          :addressFlag="+buyParams.addressFlag" 
          :businessParams="businessParams" 
          :buyType="appointType == 1 ? '3' : '2'"
          :createOrderType="createOrderType"
          :rePayOrderId="rePayOrderId"
        >
          <text :class="[businessParams.userName && (businessParams.gender === 0 || businessParams.gender === 1) && businessParams.birthDay && educationName ? '' : 'btn-disabled', 'btn-buy']" v-if="buyParams.amount / 100 > 0">
            立即预约<block v-if="reAppointFlag == -1">（¥{{buyParams.amount / 100}}）</block>
          </text>
          <text :class="[businessParams.userName && (businessParams.gender === 0 || businessParams.gender === 1) && businessParams.birthDay && educationName ? '' : 'btn-disabled', 'btn-buy']" v-else>
            立即预约<block v-if="reAppointFlag == -1">（限时免费）</block>
          </text>
        </payment>
      </view>
      
      <view @click="showKfCode"><image src="../../static/images/applet/icon_kefu.png"></image><text>客服咨询</text></view>
      
    </view>
    <!--end-->
    <!--评估报告弹窗-->
    <view class="get-report-box" v-if="isShowReportBox">
      <view class="box-content">
        <block v-if="reportList && reportList.length">
          <view class="c-top">
            <text>请选择您需要评估的评估报告</text>
            <uni-icons @click="closeReportBox" class="close" type="closeempty" size="25"></uni-icons>
          </view>
          <view class="list-container">
            <view :class="[
                currentReportIndex == index ? 'confirm-rep' : '',
                'report-list',
              ]" v-for="(item, index) in reportList" :key="index" @click="getReportData(item, index)">
              <view class="_h6">评估时间：{{ item.reporttime }}</view>
              <view class="name"><text>{{ item.userName }}</text><text>{{item.age}}岁</text><text>{{item.education}}</text></view>
              <view class="type">评估类型：人工评估</view>
            </view>
          </view>
          <view class="btn" @click="confirmReportChoose">确定</view>
        </block>
        <view class="no-data" v-else>
          <view class="c-top">
            <uni-icons @click="closeReportBox" class="close" type="closeempty" size="25"></uni-icons>
          </view>
          <view class="empty">
            <empty-data></empty-data>
          </view>
        </view>
      </view>
    </view>
    <!--end-->
    <picker-custom v-if="isShowCustomPicker" :currentPickerValue="currentPickerValue" :mode="mode" :range="range" :range-key="rangKey" :default-index="defaultValueIndex" @getDateValue="getDateValue" @getSelectorValue="getSelectorValue" @closePicker="closePicker"></picker-custom>
    <choose-time v-if="isShowAppointTime" :appointTimeText="appointTimeText" :appointType="appointType" :schedulingDateData="schedulingDateData" @getAppointmentValue="getAppointmentValue" @closeAppointTimeBox="closeAppointTimeBox"></choose-time>
    <kf-code v-if="isShowKfCode" @closeKfHandle="closeKfHandle" :ewmName="appointType == 1 ? 'jkzx-xqy' : 'rgpg-xqy'"></kf-code>
   
  </view>
</template>

<script>
  import pickerCustom from '@/components/common-page/picker-custom'
  import chooseTime from '@/components/make-an-appoint/choose-time'
  import emptyData from '@/components/empty-data'
  import kfCode from '@/components/kf-code'
  import payment from '@/components/payment'
  
  
  // import tip from '@/components/guid-tip/tip'
  import {isTimeExpire, navigateTo} from  '@/utils/util'
  export default {
    props: {
      buyParams: {
        type: Object,
        default: () => {}
      },
      // schedulingDateData: {
      //   type: Object,
      //   default: () => {
      //     return null
      //   }
      // },
      appointType: {
        type: Number,
        default: 1 // 1=>服务咨询 2=>人工评估
      },
      reAppointFlag: {
        type: Number,
        default: -1 // 是否重新预约 -1=>非重新预约 1=>重新预约
      },
      rePayOrderId: {
        type: String,
        default: '' // 订单为重新预约的订单时 传递
      },
      createOrderType: {
        type: String,
        default: '1' // 1=>普通订单 2=>重新预约订单
      }
    },
    components: {
      pickerCustom,
      chooseTime,
      emptyData,
      kfCode,
      payment,
      // tip
    },
    data() {
      return {
        currentPickerValue: '',
        isShowKfCode: false,
        mode: 'selector',
        isShowCustomPicker: false,
        isShowAppointTime: false,
        isShowReportBox: false,
        sexArr: [{text: '男', value: 0}, {text: '女', value: 1}],
        range: [],
        rangKey: '',
        educationName: '',
        eduArr: [],
        appointTimeText: '',
        imgPrefix: this.$imgPrefix,
        reportTypeList: [
          {
            imgUrl: this.$imgPrefix + '/static/operateSteps/portalH5/pages/icon-direction-1.png',
            value: 10008,
            title: '认知报告解读'
          },
          {
            imgUrl: this.$imgPrefix + '/static/operateSteps/portalH5/pages/icon-direction-2.png',
            value: 10003,
            title: '老年痴呆就诊/照护指导'
          },
          {
            imgUrl: this.$imgPrefix + '/static/operateSteps/portalH5/pages/icon-direction-3.png',
            value: 10003,
            title: '大脑相关疾病就医咨询'
          }
        ],
        currentReportTypeIndex: -1,
        currentSwiperIndex: 0,
        currentReportIndex: -1,
        businessParams: {
          gender: '',
          birthDay: '',
          education: '',
          userName: '',
          visitType: '10008',
          serviceName: '认知报告解读',
          sid: '',
        },
        reportList: [],
        chooseReportData: {},
        isPad: this.$pad,
        swiperHeight: '',
        isCanShowBtn: true,
        schedulingDateData: null,
        currentChoose: {},
        defaultValueIndex: 0
      }
    },
    mounted() {
      this.init()
    },
    // #ifdef MP
    options: {
      styleIsolation: 'shared'
    },
    // #endif
    methods: {
      init() {
        this.currentReportTypeIndex = -1
        this.currentSwiperIndex = 0
        this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
        if (this.reAppointFlag == 1) {
          // 如果是重新预约的话则直接去缓存的字典，并且直接跳转到第二步
          this.setSwiperHeight('step-1')
        } else {
          this.getEducationList()
        }
        this.queryReport()
        this.initData()
        if (this.appointType == 1) {
          this.setSwiperHeight('step-begin')
        } else {
          this.setSwiperHeight('step-1')
          // this.getServiceSchedulingTime()
        }
      },
      getEducationList() {
        this.$request({
            url: '/gw/op/v1/base/sys/dict/listSysDict',
            method: 'post',
            data: {
              token: this.userInfo.token,
            },
          },
          false
        ).then((res) => {
          if (res.status === 1000) {
            this.eduArr = res.data
              .filter((item) => item.typeValue === '3002')
              .map((item) => {
                return {
                  name: item.fieldName,
                  value: item.fieldValue,
                }
              })
            if (this.userInfo.info.education) {
              let educationNameArr = this.eduArr.filter(
                (item) => item.value == this.userInfo.info.education
              )
              this.educationName = educationNameArr.length ? educationNameArr[0].name : ''
              this.businessParams.education = educationNameArr.length ? educationNameArr[0].value : ''
            }
          }
        })
      },
      
      initData() {
        if (this.userInfo.info) {
          if (this.userInfo.info.birthDate) {
            this.businessParams.birthDay = this.userInfo.info.birthDate
          }
      
          this.businessParams.gender = this.userInfo.info.gender === 0 ? 0 : this.userInfo.info.gender === 1 ? 1 : ''
          
          this.businessParams.userName = this.userInfo.info.userRealName ? this.userInfo.info.userRealName : ''
          this.showAgeValue = this.businessParams.birthDay ?
            this.businessParams.birthDay :
            `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
              .toString()
              .padStart(2, 0)}-${new Date()
              .getDate()
              .toString()
              .padStart(2, 0)}`
          if (this.businessParams.gender == 1) {
            this.sexName = '女'
          } else if (this.businessParams.gender === 0) {
            this.sexName = '男'
          } else {
            this.sexName = ''
          }
        }
        if (this.reAppointFlag == 1) {
          // 重新预约的，需要回显预约信息
          this.showAppointmentMsg()
        }
      },
      showAppointmentMsg() {
        this.$request({
          url: '/gw/order/pay/checkReAppointment',
          method: 'post',
          data: {
            token: this.userInfo.token,
            orderId: this.rePayOrderId
          }
        }, false).then(res => {
          if (res.status === 1000) {
            this.businessParams.userName = res.data.userName
            this.businessParams.gender = res.data.gender === '0' ? 0 : res.data.gender === '1' ? 1 : ''
            this.businessParams.birthDay = res.data.birthDay
            this.businessParams.visitType = res.data.visitType
            this.businessParams.sid = res.data.sid
            if (this.businessParams.gender == 1) {
              this.sexName = '女'
            } else if (this.businessParams.gender === 0) {
              this.sexName = '男'
            } else {
              this.sexName = ''
            }
            if (this.appointType == 1) {
              this.businessParams.doctorId = res.data.doctorId 
            }
            let sysDictList = []
            if (uni.getStorageSync('sysDictList')) {
              sysDictList = uni.getStorageSync('sysDictList') ? JSON.parse(uni.getStorageSync('sysDictList')) : []
              this.goNextStep(sysDictList, res.data)
            } else {
              this.$request({
                url: '/gw/h5/v1/base/sys/dict/listSysDictFront',
                method: 'post'
              }).then(res => {
                if (res.status === 1000) {
                  sysDictList = res.data
                  this.goNextStep(sysDictList, res.data)
                  uni.setStorageSync('sysDictList', JSON.stringify(res.data))
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
        })
      },
      goNextStep(sysDictList, data) {
        let educationNameArr = []
        if (!this.eduArr.length) {
          this.eduArr = sysDictList.filter((item) => item.typeValue === '3002').map((item) => {
            return {
              name: item.fieldName,
              value: item.fieldValue,
            }
          })
        }
        educationNameArr = this.eduArr.filter(
          (item) => item.value == data.education
        )
        this.educationName = educationNameArr.length ? educationNameArr[0].name : ''
        this.businessParams.education = educationNameArr.length ? educationNameArr[0].value : ''
      },
      chooseConsultingType(item, index) {
        if ((index == 0 && this.reportList.length) || (index != 0)) {
          this.currentReportTypeIndex = index
          this.businessParams.visitType = item.value
          this.businessParams.serviceName = item.title
        }
        
      },
      setSwiperCurr(index, _class = '') {
        if (index == 2 || (this.appointType == 2 && index == 1)) {
          if (this.appointType == 1 && this.businessParams.visitType == 10008 && !this.businessParams.sid) {
            return uni.showToast({
              title: '请选择评估报告',
              icon: 'none',
              duration: 2000
            })
          } else if (!this.businessParams.scheduleStartTime) {
            return uni.showToast({
              title: '请选择咨询时间',
              icon: 'none',
              duration: 2000
            })
            
          }
        }
        this.setSwiperHeight(_class)
        this.currentSwiperIndex = index
      },
      getServiceSchedulingTime() {
        // 获取人认知评估排班
        this.$request({
          url: '/gw/h5/v1/schedule/list',
          method: 'get',
          data: {
            token: this.userInfo.token
          }
        }, false).then(res => {
          if (res.status === 1000) {
            this.schedulingDateData = res.data ? res.data : null
          }
        })
      },
      inputChange(e) {
        this.businessParams.userName = e.detail.value
        
      },
      sexChange(e) {
        this.businessParams.gender = e
      },
      showPicker(mode, currentValue='') {
        this.mode = mode
        if (mode == 'selector') {
          this.range = this.eduArr
          this.rangKey = 'name'
          this.defaultValueIndex = 5
        }
        this.currentPickerValue = currentValue
        this.isShowCustomPicker = true
      },
      closePicker() {
        this.isShowCustomPicker = false
      },
      getDateValue(e) {
        this.businessParams.birthDay = e
        this.isShowCustomPicker = false
      },
      getSelectorValue(e) {
        this.educationName = this.eduArr[e].name
        this.eduValue = this.eduArr[e].value
        this.businessParams.education = this.eduValue
        this.isShowCustomPicker = false
      },
      showAppointTime() {
        if (this.appointType == 1) {
          // 咨询服务
          this.$request({
              url: '/gw/h5/v1/schedule/doctorSourcce',
              method: 'get',
              data: {
                token: this.userInfo.token,
                doctorId: this.buyParams.mouldId,
              },
            },
            false
          ).then((res) => {
            if (res.status === 1000) {
              if (res.data && JSON.stringify(res.data) != '{}') {
                this.schedulingDateData = res.data
                this.isShowAppointTime = true
              } else {
                this.schedulingDateData = null
                uni.showToast({
                  title: '暂无可选择时间',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        } else {
          // 获取认知评估排班
          this.$request({
            url: '/gw/h5/v1/schedule/list',
            method: 'get',
            data: {
              token: this.userInfo.token
            }
          }, false).then(res => {
            if (res.status === 1000) {
              if (res.data && JSON.stringify(res.data) != '{}') {
                this.schedulingDateData = res.data
                this.isShowAppointTime = true
              } else {
                this.schedulingDateData = null
                uni.showToast({
                  title: '暂无可选择时间',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        }
        
      },
      getAppointmentValue(value) {
        this.businessParams.dayStr = value.dayStr
        this.businessParams.week = value.week
        this.businessParams.scheduleId = value.scheduleId
        this.businessParams.scheduleStartTime = value.scheduleStartTime
        this.businessParams.scheduleEndTime = value.scheduleEndTime
        this.appointTimeText = `${value.dayStr} ${value.scheduleStartTime}${value.scheduleEndTime ? '-' + value.scheduleEndTime : ''}`
        this.isShowAppointTime = false
      },
      closeAppointTimeBox() {
        this.isShowAppointTime = false
      },
      showReportBoxHandle() {
        this.currentReportIndex = this.reportList.length && this.reportList.length == 1 ? 0 : -1
        this.isShowReportBox = true
      },
      queryReport() {
        this.$request({
          url: '/gw/h5/v1/schedule/assess/records',
          method: 'post',
          data: {
            pageSize: 10,
            pageNum: 1,
            token: this.userInfo.token,
          },
        }, false).then((res) => {
          if (res.status === 1000) {
            this.reportList = res.data ? res.data.list : []
            if (this.reportList.length) {
              this.currentReportTypeIndex = 0
              this.businessParams.visitType= '10008'
            } else {
              this.currentReportTypeIndex = 1
              this.businessParams.visitType = '10003'
            }
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000,
            })
          }
        })
      },
      getReportData(item, index) {
        this.currentReportIndex = index
        this.businessParams.sid = item.sid
        this.currentChoose = item
      },
      confirmReportChoose() {
        if (this.reportList.length && this.reportList.length == 1) {
          // 默认选择第一个
          this.chooseReportData = this.reportList[0]
          this.businessParams.sid = this.reportList[0].sid
        } else {
          this.chooseReportData = this.currentChoose
        }
        this.isShowReportBox = false
      },
      closeReportBox() {
        this.isShowReportBox = false
      },
      closeKfHandle() {
        this.isShowKfCode = false
      },
      showKfCode() {
        this.isShowKfCode = true
      },
      closePayResultHandle(res) {
        this.payOrderId = res.payOrderId
      },
      goBack() {
        if (this.appointType == 1) {
          // 服务咨询
          uni.redirectTo({
            url: '/pages/consulting-service/index'
          })
        } else {
          // 认知评估
          this.goToPage()
        }
        
      },
      goToPage() {
        getApp().goAppointmentDetail({
          token: this.userInfo.token,
          type: 2,
          cameraPermission: true
        })
      },
      //动态设置swiper的高度
      setSwiperHeight(_class) {
        let element = "."+ _class
        let query = uni.createSelectorQuery().in(this)
        query.select(element).boundingClientRect(data => {
          if (data) {
            // #ifdef APP-PLUS || H5
            this.swiperHeight = data.height
            // #endif
            
            // #ifdef MP
            if (this.$pad) {
              this.swiperHeight = data.height * 1.2
              
            } else {
              this.swiperHeight = data.height
            }
            
            // #endif
          }
        }).exec()
      },
      // input 获取键盘时隐藏底部定位按钮
      inputFocusHandle() {
        this.isCanShowBtn = false
      },
      inputBlurHandle() {
        this.isCanShowBtn = true
      },
      emitBusinessParamsHandle() {
        this.$emit('emitBusinessParamsHandle', this.businessParams)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .step-content {
    width: 750.18rpx;
    max-width: 750.18rpx;
    padding: 13.19rpx 11.72rpx 0 11.72rpx;
    box-sizing: border-box;
    .swiper {
      height: 100%;
    }
    ::v-deep uni-swiper .uni-swiper-wrapper {
      z-index: 3;
    }
    .btn-disabled {
      background-color: #ccc !important;
    }
    .btn-group {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 29.3rpx;
      position: relative;
      .btn-next {
        width: 383.88rpx;
        height: 55.68rpx;
        border-radius: 7.33rpx;
        color: #fff;
        background-color: #43C9A7;
        text-align: center;
        line-height: 55.68rpx;
        font-size: 21.98rpx;
        font-weight: bold;
      }
      .next-text {
        width: 100%;
        height: 100%;
        display: inline-block;
      }
      .btn-pre {
        font-size: 19.05rpx;
        color: #43C9A7;
        margin-right: 21.98rpx;
        display: flex;
        align-items: center;
        image {
          width: 21.98rpx;
          height: 21.98rpx;
          margin-right: 3.66rpx;
        }
      }
    }
    .step-begin {
      padding-top: 16.85rpx;
      .title {
        font-size: 26.37rpx;
        font-weight: bold;
        text-align: center;
        margin-bottom: 16.85rpx;
      }
      .type-list {
        &>view {
          width: 383.88rpx;
          
          
          font-size: 19.05rpx;
          border: 1.47rpx solid #fff;
          border-radius: 7.33rpx;
          background-color: #fff;
          
          box-sizing: border-box;
          margin: 0 auto 8.79rpx auto;
          .no-report {
            color: #FFB12F;
            
            image {
              width: 14.65rpx;
              height: 13.19rpx;
              vertical-align: middle;
              margin: 0 5.13rpx 0 20.51rpx;
            }
            text {
              vertical-align: middle;
            }
          }
          .no-font {
            color: #999999;
          }
          .content {
            padding: 0 14.65rpx;
            height: 73.26rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .type-list-left {
            display: flex;
            align-items: center;
          }
          .img-1 {
            width: 51.28rpx;
            height: 38.1rpx;
            margin-right: 9.52rpx;
          }
          .img-2 {
            width: 21.98rpx;
            height: 21.98rpx;
          }
        }
        &>view.on {
          border-color: #43C9A7;
        }
      }
    }
    .step-title {
      width: 726.74rpx;
      border-radius: 14.65rpx;
      padding: 13.19rpx 0 13.19rpx 16.85rpx;
      box-sizing: border-box;
      margin-bottom: 13.19rpx;
      image {
        width: 750.18rpx;
        height: 133.33rpx;
        margin-left: -16.85rpx;
      }
    }
    .form-box {
      padding: 17.58rpx 23.44rpx;
      background-color: #fff;
      border-radius: 14.65rpx;
      .title {
        font-size: 21.98rpx;
        font-weight: bold;
        padding-bottom: 16.12rpx;
      }
      .form-input {
        display: flex;
        align-items: center;
        height: 62.99rpx;
        line-height: 62.99rpx;
        margin-bottom: 14.65rpx;
      
        &>view:nth-child(1) {
          width: 109.89rpx;
          color: #333;
          font-size: 19.05rpx;
        }
      
        &>view:nth-child(2) {
          flex: 1;
          height: 52.75rpx;
          position: relative;
          border: 1px solid #E5E5E5;
          border-radius: 4.4rpx;
          padding-left: 14.65rpx;
          box-sizing: border-box;
          .input-name {
            width: 278.39rpx;
          }
          
          .picker-master {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 2;
            opacity: 0;
          }
        }
        .uni-sex-input {
          flex: 1;
          height: 52.75rpx;
          border-radius: 4.4rpx;
          padding-left: 14.65rpx;
          box-sizing: border-box;
          
        }
        &>view.name {
          width: 278.39rpx;
          flex: 0 0 278.39rpx;
        }
        &>view.name {
          margin-right: 10.26rpx;
        }
      
        .uni-input, ::v-deep .uni-select {
          height: 52.75rpx;
          line-height: 52.75rpx;
          font-size: 21.98rpx;
        }
        ::v-deep .uni-select__selector-item {
          font-size: 21.98rpx;
          color: #333;
        }
         
        .uni-input-placeholder, ::v-deep .uni-select__input-placeholder {
          font-size: 21.98rpx;
          color: #C9C9C9;
        }
        .picker-placeholder {
          color: #C9C9C9;
        }
      
        .edit {
          color: #43C9A7;
        }
      }
      .form-input:last-child {
        margin-bottom: 0;
      }
    }
    .step-1 {
      .form-input {
        &>view:nth-child(1) {
          width: 146.52rpx;
        }
        &>view:nth-child(2) {
          width: 530.4rpx;
        }
      }
      .form-input-spec {
        height: auto;
        align-items: flex-start;
        &>view:nth-child(2) {
          
          height: auto;
          padding: 14.65rpx;
          .img-add {
            width: 26.37rpx;
            height: 26.37rpx;
            display: block;
            margin: 14.65rpx auto 18.32rpx auto;
          }
          .tip {
            font-size: 21.98rpx;
            color: #43C9A7;
            text-align: center;
          }
        }
        .report-style {
          color: #666666;
          font-size: 17.58rpx;
          position: relative;
      
          &>view {
            height: 27.11rpx;
            line-height: 27.11rpx;
            padding-bottom: 8.79rpx;
          }
      
          ._h6 {
            color: #333;
            font-weight: bold;
            font-size: 19.05rpx;
          }
      
          .name>text:nth-child(2) {
            padding: 0 14.65rpx;
          }
          .re-choose {
            position: absolute;
            right: 11.72rpx;
            top: 11.72rpx;
            image {
              width: 23.44rpx;
              height: 23.44rpx;
              vertical-align: middle;
            }
            text {
              vertical-align: middle;
              font-size: 14.65rpx;
              color: #43C9A7;
            }
          }
        }
      }
      
    }
    .guid-tip {
      position: relative;
      z-index: 3;
    
      border-top-left-radius: 0 !important;
      border-top-right-radius: 0 !important;
      border: 2.2rpx solid #336CEA;
    }
    .guid-top {
      padding: 10.26rpx 0 14.65rpx 0;
      background-color: #336CEA;
      font-size: 19.05rpx;
      padding: 12.45rpx 0;
      box-sizing: border-box;
      width: 726.74rpx;
      position: absolute;
      top: -90rpx;
      left: 0;
      border: 2.2rpx solid #336CEA;
      border-top-left-radius: 14.65rpx;
      border-top-right-radius: 14.65rpx;
      z-index: 999;
      display: flex;
      align-items: center;
      .img {
        width: 69.6rpx;
        height: 95.97rpx;
        margin-top: -24rpx;
        flex: 0 1 69.6rpx;
      }
      .guid-middle {
        margin: 0 20rpx 0 21.98rpx;
        width: 415rpx;
      }
      .guid-title {
        font-size: 17.58rpx;
        color: #fff;
        padding-bottom: 8.79rpx;
      }
      .guid-desc {
        font-size: 19.05rpx;
        font-weight: bold;
        color: #fff;
        
        line-height: 27.11rpx;
        
      }
      .guid-btn {
        width: 144.32rpx;
        height: 42.49rpx;
        line-height: 42.49rpx;
        text-align: center;
        border-radius: 7.33rpx;
        background-color: #B0E9FF;
        font-size: 20.51rpx;
        color: #336CEA;
        font-weight: bold;
      }
      .guid-close {
        padding: 10rpx;
        align-self: flex-start;
        margin-top: -12rpx;
        margin-left: 20rpx;
      }
    }
    .btn-appoint {
      position: fixed;
      bottom: 0;
      left: 50%;
      width: 750.18rpx;
      max-width: 750.18rpx;
      margin-left: -375.09rpx;
      height: 64.47rpx;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 21.98rpx;
      box-sizing: border-box;
      z-index: 9;
      &>view:nth-child(1) {
        font-size: 19.05rpx;
        color: #43C9A7;
        margin-right: 73.26rpx;
        display: flex;
        align-items: center;
        image {
          width: 21.98rpx;
          height: 21.98rpx;
          margin-right: 3.66rpx;
        }
      }
      &>view:nth-child(2) {
        position: relative;
        .btn-buy {
          width: 383.88rpx;
          height: 55.68rpx;
          text-align: center;
          line-height: 55.68rpx;
          border-radius: 7.33rpx;
          background-color: #43C9A7;
          color: #fff;
          margin-right: 109.89rpx;
          font-size: 21.98rpx;
          font-weight: bold;
          display: block;
        }
      }
      &>view:nth-child(3) {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 11.72rpx;
        color: #5796F8;
        image {
          width: 32.23rpx;
          height: 32.23rpx;
          display: block;
          margin-bottom: 2.93rpx;
        }
        
      }
    }
    .get-report-box {
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.65);
      position: fixed;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99;
    
      .box-content {
        width: 386.73rpx;
        padding: 18.31rpx;
        box-sizing: border-box;
        border-radius: 14.65rpx;
        background-color: #f5f5f5;
        font-size: 14.65rpx;
    
        .c-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 5.86rpx;
    
          .close {
            padding: 7.32rpx;
            margin-right: -7.32rpx;
          }
        }
    
        .list-container {
          max-height: 366.22rpx;
          overflow-y: auto;
        }
    
        .report-list {
          width: 351.57rpx;
          border-radius: 7.32rpx;
          padding: 14.65rpx 16.85rpx;
          box-sizing: border-box;
          background-color: #fff;
          margin-top: 8.79rpx;
          color: #666666;
          font-size: 14.65rpx;
    
          &>view {
            padding-bottom: 8.79rpx;
          }
    
          ._h6 {
            color: #333;
            font-weight: bold;
          }
    
          .name>text:nth-child(2) {
            padding: 0 14.65rpx;
          }
        }
    
        .confirm-rep {
          border: 1.46rpx solid #43C9A7;
        }
    
        .btn {
          width: 281.99rpx;
          height: 45.41rpx;
          margin: 12.45rpx auto 0 auto;
          background-color: #43C9A7;
          border-radius: 7.32rpx;
          text-align: center;
          line-height: 45.41rpx;
          color: #fff;
          font-size: 17.58rpx;
        }
    
        .no-data {
          .c-top {
            justify-content: flex-end;
          }
    
          .empty {
            margin-top: -73.24rpx;
          }
        }
      }
    }
  }
  @media screen and (max-width: 500px) {
    .step-content {
      width: 750rpx;
      max-width: 750rpx;
      padding: 25rpx 0rpx 150rpx 0rpx;
      .btn-group {
        justify-content: space-between;
        margin-top: 70rpx;
        padding: 0 26rpx;
        .btn-next {
          width: 408rpx;
          height: 98rpx;
          border-radius: 12rpx;
          line-height: 98rpx;
          font-size: 40rpx;
        }
        .btn-next-2 {
          width: 684rpx;
        }
        .btn-pre {
          font-size: 36rpx;
          margin-right: 0rpx;
          image {
            width: 40rpx;
            height: 40rpx;
            margin-right: 5rpx;
          }
        }
      }
      .btn-group-center {
        justify-content: center;
      }
      .step-begin {
        padding-top: 30rpx;
        .btn-group {
          justify-content: center;
          .btn-next {
            width: 684rpx;
          }
        }
        .title {
          font-size: 44rpx;
          margin-bottom: 36rpx;
        }
        .type-list {
          &>view {
            width: 684rpx;
            height: 148rpx;
            font-size: 40rpx;
            border: 2rpx solid #fff;
            border-radius: 20rpx;
            padding: 0 24rpx;
            margin: 0 auto 20rpx auto;
            
            .no-report {
              color: #FFB12F;
              font-size: 24rpx;
              padding-top: 8rpx;
              image {
                width: 28rpx;
                height: 26rpx;
                vertical-align: middle;
                margin: 0 6rpx 0 34rpx;
              }
              text {
                vertical-align: middle;
              }
            }
            .no-font {
              color: #999999;
            }
            .content {
              padding: 30rpx 0rpx;
              height: auto;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            
            .img-1 {
              width: 110rpx;
              height: 82rpx;
              margin-right: 14rpx;
            }
            .img-2 {
              width: 48rpx;
              height: 48rpx;
            }
          }
          &>view:nth-child(1) {
            .content0 {
              padding-top: 10rpx;
              .img-2 {
                align-self: flex-start !important;
              }
            }
          }
        }
      }
      .step-title {
        width: 698rpx;
        background-color: #fff;
        height: 258rpx;
        border-radius: 20rpx;
        padding: 0rpx 0 16rpx 0rpx;
        margin: 0 auto 20rpx auto;
        box-sizing: border-box;
        image {
          width: 698rpx;
          height: 258rpx;
          margin-left: 0;
        }
      }
      .form-box {
        width: 698rpx;
        padding: 24rpx 26rpx;
        border-radius: 20rpx;
        margin: 0 auto;
        box-sizing: border-box;
        .title {
          font-size: 40rpx;
          padding-bottom: 30rpx;
        }
        .form-input {
          flex-direction: column;
          height: auto;
          line-height: auto;
          margin-bottom: 30rpx;
        
          &>view:nth-child(1) {
            width: 100%;
            font-size: 30rpx;
          }
        
          &>view:nth-child(2) {
            width: 100%;
            height: 98rpx;
            border-radius: 12rpx;
            padding-left: 20rpx;
            .input-name {
              width: 100%;
            }
          }
          .uni-sex-input {
            height: 98rpx;
            border-radius: 12rpx;
            padding-left: 0rpx;
            width: 100%;
            
          }
          &>view.name {
            margin-right: 0;
            flex: 1 1 auto;
            
          }
          &>view.sex {
            margin-right: 0;
            flex: 0 0 auto;
            border: none;
            padding-left: 0;
          }
        
          .uni-input, ::v-deep .uni-select {
            height: 98rpx;
            line-height: 98rpx;
            font-size: 40rpx;
            width: 100%;
          }
          ::v-deep .uni-select__selector-item {
            font-size: 40rpx;
          }
           
          .uni-input-placeholder, ::v-deep .uni-select__input-placeholder {
            font-size: 40rpx;
          }
        }
      }
      .step-1 {
        
        .form-input-spec {
          height: auto;
          .re-title {
            height: 42rpx;
            line-height: 42rpx;
            position: relative;
            margin-bottom: 12rpx;
            .re-choose {
              position: absolute;
              right: 0rpx;
              top: 0rpx;
              height: 42rpx;
              line-height: 42rpx;
              image {
                width: 36rpx;
                height: 36rpx;
                vertical-align: middle;
              }
              text {
                vertical-align: middle;
                font-size: 30rpx;
                color: #874A94;
              }
            }
          }
          &>view:nth-child(2) {
            height: auto;
            padding: 30rpx;
            width: 100%;
            .img-add {
              width: 56rpx;
              height: 56rpx;
              margin: 12rpx auto 30rpx auto;
            }
            .tip {
              font-size: 40rpx;
              position: relative;
            }
          }
          .report-style {
            font-size: 32rpx;

            &>view {
              height: 45rpx;
              line-height: 45rpx;
              padding-bottom: 14rpx;
            }
        
            ._h6 {
              font-size: 40rpx;
            }
        
            .name>text:nth-child(2) {
              padding: 0 40rpx;
            }
            
          }
        }
        
      }
      .btn-appoint {
            
        width: 750rpx;
        max-width: 750rpx;
        margin-left: -375rpx;
        height: 116rpx;
        padding: 0 26rpx;
        &>view:nth-child(1) {
          font-size: 36rpx;
          margin-right: 16rpx;
          image {
            width: 40rpx;
            height: 40rpx;
            margin-right: 5rpx;
          }
        }
        &>view:nth-child(2) {
          .btn-buy {
            width: 364rpx;
            height: 98rpx;
            line-height: 98rpx;
            border-radius: 12rpx;
            margin-right: 58rpx;
            font-size: 34rpx;
          }
        }
        &>view:nth-child(3) {
          font-size: 22rpx;
          image {
            width: 60rpx;
            height: 60rpx;
            display: block;
            margin-bottom: 0rpx;
          }
          
        }
      }
      .get-report-box {
      
        .box-content {
          width: 660rpx;
          padding: 20rpx;
          border-radius: 20rpx;
          font-size: 30rpx;
      
          .c-top {
            margin-bottom: 32rpx;
      
            .close {
              padding: 20rpx;
              margin-right: -20rpx;
            }
          }
      
          .list-container {
            max-height: 520rpx;
          }
      
          .report-list {
            width: 620rpx;
            border-radius: 20rpx;
            padding: 34rpx 20rpx;
            
            margin-top: 12rpx;
            
            font-size: 32rpx;
      
            &>view {
              padding-bottom: 14rpx;
            }
      
            ._h6 {
              padding-bottom: 28rpx;
            }
      
            .name>text:nth-child(2) {
              padding: 0 40rpx;
            }
          }
      
          .confirm-rep {
            border: 2rpx solid #502459;
          }
      
          .btn {
            width: 620rpx;
            height: 98rpx;
            margin: 34rpx auto 0 auto;
            border-radius: 12rpx;
            line-height: 98rpx;
            font-size: 40rpx;
          }
      
          .no-data {
            .empty {
              margin-top: -73.24rpx;
            }
          }
        }
      }
    }
  }
  /* #ifdef MP */
  // @media screen and (min-width: 768px) {
  //   .swiper {
  //     max-height: 100vh;
  //     overflow: hidden;
  //   }
  // }
  /* #endif */
</style>