import { validatenull } from  "@/utils/validate";


/**
 * 初始化左侧菜单router
 * @param router
 * @param menu
 */
export const initMenu = (router, menu) => {
  if (menu.length === 0) {
    return
  }
  router.addRoutes(formatRoutes(menu));
}

/**
 * 格式化菜单路由格式
 * @param menu
 */
export const formatRoutes = (menu) => {
  console.info(menu);

  const aRouter = [];

  //{ path: '/sys/user', name: '用户管理', component: user }
  // import user from '@/views/sys/user/user'
  const oRouter = {
    path: '/sys/user',
    name: '用户管理',
    component(resolve) {
      let componentPath = 'views/sys/user/user';
      require([`@/${componentPath}.vue`], resolve)
    },
  }

  aRouter.push(oRouter);

  return aRouter
}
