import axios from 'axios';

const axiosFunc = {
  install(Vue, opt) {
    const Http = axios.create({
      baseURL:"/api",
      timeout:20000
    });
    Vue.prototype.$http = Http;
  }
}

export default axiosFunc;