// prod 生产 dev 开发
// const env = "test"

const domainName = {
  test: 'natt.yimed.cn',
  prod: 'www.hj-health.cn'
}

const downAppLink = {
  test: 'http://fir.hj-health.cn/portaltest',
  prod: 'http://fir-release.hj-health.cn/release'
}

const baseUrl = {
	test: 'http://192.168.43.245:28027',
	// test: 'http://192.168.1.125:28027',
	prod: 'http://114.132.243.79:28027'
}

const imgHost = {
  test: 'http://114.132.243.79:9000',
  prod: 'http://114.132.243.79:9000'
}

// const env = process.env.NODE_ENV === 'production' ? 'prod' : 'test'
const env = 'test'
// const env = 'test'

export const envSetting = {
  baseURL: baseUrl[env],
  fileUrl: imgHost[env],
  domainName: domainName[env],
  downAppLink: downAppLink[env]
}
