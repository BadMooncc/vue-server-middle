<template>
  <div id="app">
    <img src="./assets/logo.png">
    <img src="/static/logo.png">
    <router-view/>
  </div>
</template>

<script>
import { getCityList } from './service/'

export default {
  name: 'App',
  mounted() {
    const params = {
      username: 'xiaow',
      password: '123345'
    }
    getCityList(this, params).then((res) => {
      if (res.code) ;
      else return Promise.reject(res); 
    }).catch((err) => {
      // 统一处理错误信息
    });
  }
}
</script>

