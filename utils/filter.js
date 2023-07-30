import Vue from 'vue'
import DICT_KEYS from '@/utils/staticEnum'
import { parseTime } from './index'
import { request } from '@/utils/request.js' // 引入api文件

let sysDictList = uni.getStorageSync('sysDictList') ? JSON.parse(uni.getStorageSync('sysDictList')) : []
if (!sysDictList.length) {
  request({
    url: '/gw/op/v1/base/sys/dict/listSysDict',
    method: 'post'
  }).then(res => {
    if (res.status === 1000) {
      sysDictList = res.data
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

Vue.filter('dictToDesc', (value, type) => {
  let res = sysDictList.filter(item => item.typeValue == DICT_KEYS[type] && item.fieldValue == value)
  return res.length ? res[0].fieldName : '--'
})
Vue.filter('dictToDesc', (value, type) => {
  let res = sysDictList.filter(
      item => item.typeValue == DICT_KEYS[type] && item.fieldValue == value)
  return res.length ? res[0].fieldName : '--'
})
Vue.filter('dictToDescTypeValue', (value, type) => {
  let res = sysDictList.filter(
      item => item.typeValue == type && item.fieldValue == value)
  return res.length ? res[0].fieldName : '--'
})
Vue.filter('dictToDescTypeValue2', (value, type) => {
  let res = sysDictList.filter(
      item => item.typeValue == type && item.fieldValue == value)
  let name= res.length ? res[0].fieldName : '--'
  // 截取当前数据到小数点后两位
  if (!name || name.length < 3) {
    return name
  }
  let realVal = name.substring(0,3)
  return realVal
})
Vue.filter('numFilter', (value) => {
  // 截取当前数据到小数点后两位
  let realVal = parseFloat(value).toFixed(2)
  return realVal
})
Vue.filter('numFilterTo0', (value) => {
  // 截取当前数据到小数点后两位
  let realVal = parseFloat(value).toFixed(0)
  return realVal
})
Vue.filter('numFilter0', (value) => {
  // 截取当前数据到小数点后两位
  let realVal = parseFloat(value).toFixed(0)
  let price1 = realVal.substring(0,realVal.length -1)
  let price2 = realVal.substring(realVal.length - 1,realVal.length)
  if (price2 != 9){
    price2=9
  }
  return price1 +""+price2
})
Vue.filter('sizeFilter', (value) => {
  // 截取当前数据到小数点后两位
  if (!value || value.length < 27) {
    return value
  }
  let realVal = value.substring(0,27) + '...'
  return realVal
})
Vue.filter('sizeFilterNum', (value , num) => {
  // 截取当前数据到小数点后两位
  if (!value || value.length < num) {
    return value
  }
  let realVal = value.substring(0,num)
  if (value.length > num ){
    realVal = realVal  + '...'
  }
  return realVal
})

Vue.filter('formateTime', parseTime)
