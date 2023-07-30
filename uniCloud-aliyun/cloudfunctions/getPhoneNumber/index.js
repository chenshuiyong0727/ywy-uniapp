'use strict';

const db = uniCloud.database()

exports.main = async (event, context) => {
  const res = await uniCloud.getPhoneNumber({
    appid: '__UNI__8DD410E', // 替换成自己开通一键登录的应用的DCloud appid
    provider: 'univerify',
    apiKey: '4e4be9f90cea18628814d20e05958d18', // 在开发者中心开通服务并获取apiKey
    apiSecret: '5eec0cdc6c79138991fba15f93d2adc7', // 在开发者中心开通服务并获取apiSecret
    access_token: event.access_token,
    openid: event.openid
  });

  console.log('我是number',res); // res里的数据格式	{ code: 0, success: true, phoneNumber: '186*****078' }

  // 执行入库等操作，正常情况下不要把完整手机号返回给前端	
  return res
};
