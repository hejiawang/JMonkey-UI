import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login/index'
import main from '@/components/layout/main'
import home from '@/views/home/home'
import user from '@/views/sys/user/user'
import menu from '@/views/sys/menu/menu'
import role from '@/views/sys/role/role'

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
        { path: '/home', name: '首页', component: home }

        ,{ path: '/sys/user', name: '用户管理', component: user }
        ,{ path: '/sys/menu', name: '菜单管理', component: menu }
        ,{ path: '/sys/role', name: '角色管理', component: role }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: login
    }
  ]
})
