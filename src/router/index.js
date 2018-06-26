import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: login
    }
  ]
})
