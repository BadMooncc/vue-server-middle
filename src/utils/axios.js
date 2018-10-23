import axios from 'axios';

const axiosFunc = {
  install(Vue, opt) {
    const Http = axios.create({
      baseURL:"/filter",
      timeout:20000
    });
    Vue.prototype.$http = Http;
  }
}

export default axiosFunc;