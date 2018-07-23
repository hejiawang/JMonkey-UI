import axios from 'axios'
import store from '../store'
import router from '../router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/utils/auth'
import errorCode from '@/const/errorCode'
import { Message } from 'element-ui'

NProgress.configure({ showSpinner: false });

axios.defaults.timeout = 50000; //超时时间
axios.defaults.withCredentials = true;  // 跨域请求，允许保存cookie
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

/**
 * HTTPrequest拦截
 */
axios.interceptors.request.use(config => {
  NProgress.start();
  if (store.getters.access_token) config.headers['Authorization'] = 'Bearer ' + getToken();
  return config;
}, error => {
  return Promise.reject(error);
})

/**
 * HTTPresponse拦截
 */
axios.interceptors.response.use(data => {
  NProgress.done();
  return data.data;
}, error => {
  NProgress.done();

  let errMsg = error.toString()
  console.error("jmonkey request error:" + errMsg);
  let code = errMsg.substr(errMsg.indexOf('code') + 5)
  Message({
    message: errorCode[code] || errorCode['default'],
    type: 'error'
  })

  if( code == '401' || code == '403' ){
    store.dispatch("LogOut").then(() => {
      router.push({ path: "/login" });
    });
  }

  return Promise.reject(new Error(error));
})

export default axios;
