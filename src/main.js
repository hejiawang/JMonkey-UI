import Vue from 'vue'
import App from './App'
import router from './router'
import VueAxios from 'vue-axios'
import axios from './utils/request'
import VueMoment from 'vue-moment'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
import '@/styles/index.scss'
import '@/assets/css/iconfont/iconfont.css'
import store from './store'
import 'babel-polyfill'
import * as filters from './filters' //全局filter
import waves from "@/directive/waves/index.js"; //按钮水波纹效果
import './permission' // 权限

Vue.config.productionTip = false

Vue.use(ElementUI, { size: 'medium' })
Vue.use(preview)
Vue.use(VueMoment)
Vue.use(VueAxios, axios)

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.directive("waves", waves)

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
