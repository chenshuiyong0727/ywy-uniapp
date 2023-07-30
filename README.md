# 主要目录内容说明
```
├─App.vue	// 是uni-app 项目根组件，所有页面都是在App.vue下进行切换的，是页面入口文件，可以调用应用的生命周期函数
├─main.js	// 是uni-app 项目的入口文件，主要作用是初始化vue实例并使用需要的插件
├─manifest.json	// 文件是应用的配置文件，用于指定应用的名称、图标、权限等
├─package.json	// npm安装包管理
├─pages.json	// 文件用来对 uni-app 进行全局配置，决定页面文件的路径、窗口样式、原生的导航栏、底部的原生tabbar 等
├─uni.scss	// 预置了一些常用样式变量，方便整体控制应用的风格。比如按钮颜色、边框风格
├─utils
|   ├─env.js	// 请求环境区分
|   ├─prototype.js	// 将自定义的一些常用属性或者方法挂载到vue上
|   ├─request.js	// 接口请求封装
|   └util.js	// 常用工具封装
├─static	// 存放uni-app 项目所有的静态资源，例如图片、字体等
├─pages	// 存放整个 uni-app 项目的所有的页面
├─components	// 组件存放目录
├─unpackage	// 存放uni-app 项目打包输出的文件，存有各个平台的打包文件

```
---

# 安装

```bash
# 安装依赖包
$ yarn install
```

# 路由新增

1：在pages页面下新增文件 xxx.vue

2：在pages.json中的pages数组中添加对应的path

# 单位转换

1. 设计稿如果是pad（768*1024）1px = （1024/750 * 设计稿尺寸）rpx，方便计算可以使用HbuilderX自带的转换工具（设置 => 编辑器配置 => 勾选启用px转rpx/upx选项）；
2. 设计稿如果是手机（750*1226）1px = (750/750 * 设计稿尺寸) rpx，即 1px = 1rpx

# 接口请求

1. 通过this.$request进行请求
2. 如果请求的接口需要登录，则需要传token值，否则不需要
```
const res = await this.$request({
	url: '/gw/h5/v1/fastsieve/web', 
	method: 'get',
	data: { 
		token: this.userInfo.token,  // 接口需要登录
		type: this.$pad ? 'pad' : '',
		requestType: 1
	}
})
```

# 其他

- 在vue原型上已挂载了是否是pad的判断的属性$pad，可以直接使用；
```
// 在js中使用
console.log(this.$pad) // true => 当前设备是pad设备 false => 非pad设备

// 在页面中使用
<view v-if="$pad" :class="[$pad ? '' : 'not-pad', '_span']">今日锻炼</view>
```

- 路由跳转可直接引入navigateTo
```
import {navigateTo} from '../../utils/util.js'
navigateTo('/pages/web-view/web-view', {  // 没有参数可不传
		link: res.data
	})
}
```