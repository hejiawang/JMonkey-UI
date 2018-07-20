import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login/index'
import main from '@/components/layout/main'

import store from '@/store';
import { formatRoutes } from './router'

Vue.use(Router)

//TODO 动态路由处理的不好，有待处理
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
