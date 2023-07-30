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
	test: 'https://natt.yimed.cn:11900',
	prod: 'https://www.hj-health.cn'
}

const imgHost = {
  test: 'https://natt.yimed.cn:11902',
  prod: 'https://hjom-oss.hj-health.cn'
}

// const env = process.env.NODE_ENV === 'production' ? 'prod' : 'test'
const env = 'test'

export const envSetting = {
  baseURL: baseUrl[env],
	imgPrefix: imgHost[env],
  domainName: domainName[env],
  downAppLink: downAppLink[env]
}
