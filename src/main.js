import Vue from 'vue'
import App from './App'
import router from './router'
import VueAxios from 'vue-axios'
import axios from './utils/request'
import VueMoment from 'vue-moment'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'
import store from './store'
import 'babel-polyfill'
import './permission' // 权限

Vue.config.productionTip = false

Vue.use(ElementUI, { size: 'medium' })
Vue.use(VueMoment)
Vue.use(VueAxios, axios)

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
