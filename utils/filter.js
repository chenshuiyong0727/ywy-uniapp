import Vue from 'vue'
import DICT_KEYS from '@/utils/staticEnum'
import { myRequest } from '@/utils/request.js'

let sysDictList = uni.getStorageSync('sysDictList') ? JSON.parse(uni.getStorageSync('sysDictList')) : []
if (!sysDictList.length) {
  myRequest({
    url: '/gw/h5/v1/base/sys/dict/listSysDictFront',
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