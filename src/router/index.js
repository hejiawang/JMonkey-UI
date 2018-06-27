import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login/index'
import index from '@/components/layout/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '主页',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      component: index,
    },
    {
      path: '/login',
      name: 'login',
      component: login
    }
  ]
})
