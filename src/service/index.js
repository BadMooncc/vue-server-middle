
/**
* 获取城市列表
* @param { String } username 姓名
* @param { Num } age 年龄
*/
export const getCityList = (vue, params) =>  vue.$http.get('/api/getdata', { params });

/**
* 登陆
* @param { String } username 姓名
* @param { String } password 年龄
*/
export const setLogin = (vue, params) =>  vue.$http.get('/api/login', { params });