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
    console.log(123);
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
<style lang="scss">
$gray: #ccc;
#app {
  background: $gray;
}
</style>


