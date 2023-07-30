import Vue from 'vue'
import { myRequest } from '@/utils/request.js' // 引入api文件
import { envSetting } from '@/utils/env.js'
import { formatTime } from '@/utils/util.js'

// #ifdef H5
import "@/utils/iosNoScale.js"
// #endif

import '@/utils/filter'


// #ifdef H5
import VConsole from 'vconsole'
const vConsole = new VConsole()
Vue.use(vConsole)

import networkTip from '@/components/network-tip'
Vue.use(networkTip)
// #endif


Vue.filter('formatTime', formatTime)

Vue.prototype.$request = myRequest // 挂载到原型上
Vue.prototype.$imgPrefix = envSetting.imgPrefix

// 判断是否是平板
uni.getSystemInfo({
  success: (res) => {
    console.log(res)
    console.log("屏幕尺寸：", res.windowWidth, res.windowHeight)
    Vue.prototype.$windowWidth = res.screenWidth
    Vue.prototype.$screenScale = res.windowWidth / res.windowHeight
    Vue.prototype.$platform = res.platform
    Vue.prototype.$systemInfo = res
    if (res.screenWidth > 500) {
      Vue.prototype.$pad = true
    } else {
      Vue.prototype.$pad = false
    }
  }
});

// 判断是否是微信浏览器
// #ifdef H5
  let ua = window.navigator.userAgent.toLowerCase()
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    // 判断是微信浏览器，将头部隐藏
    Vue.prototype.$isWechat = true
  } else {
    Vue.prototype.$isWechat = false
  }
  
// #endif

// #ifdef APP-PLUS
Vue.prototype.$openType = 'APP'
// #endif

// #ifdef H5
Vue.prototype.$openType = 'H5'
// #endif

// #ifdef MP-WEIXIN
Vue.prototype.$openType = 'APPLET'
// #endif
