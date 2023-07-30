if (process.env.UNI_PLATFORM === 'h5') {
  // 由于这种方式的打包，会导致编译生成微信小程序（只验证了微信小程序）无法正常使用，所以必须分开
  let filePath = 'static/js/'
  let Timestamp = new Date().getTime()
  module.exports = {
    filenameHashing: false,
    configureWebpack: { // webpack 配置 解决js缓存的问题，目前只适配H5端打包
      output: {
        filename: `${filePath}[name].js?v=${Timestamp}`,
        chunkFilename: `${filePath}[name].js?v=${Timestamp}`
      }
    }
  }
} else {
  // 其他打包需要的相关配置
  module.exports = {
    filenameHashing: false
  }
}

