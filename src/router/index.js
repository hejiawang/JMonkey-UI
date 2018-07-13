import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login/index'
import main from '@/components/layout/main'
import home from '@/views/home/home'

import store from '@/store';
import { formatRoutes } from './router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '主页',
      redirect: '/main'
    },
    {
      path: '/main',
      name: 'main',
      component: main,
      children: [
        { path: '/home', name: '首页', component: home },
        ...formatRoutes(store.getters.menu)
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: login
    }
  ]
})
