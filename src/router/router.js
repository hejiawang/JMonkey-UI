import { validatenull } from  "@/utils/validate";


/**
 * 动态初始化左侧菜单router
 * @param router
 * @param menu
 */
export const initMenu = (router, menu) => {
  if (menu.length === 0) return;

  let baseRouter = {
    path: '/main',
    name: 'main',
    component(resolve) { require(['../components/layout/main' ], resolve) },
    children: [
      { path: '/home', name: '首页', component(resolve) { require(['../views/home/home' ], resolve) } }
    ]
  };

  formatRoutes(menu).forEach(r => { baseRouter.children.push(r); });
  router.addRoutes( [baseRouter] );
}

/**
 * 格式化菜单路由格式
 * @param menu
 */
export const formatRoutes = (treeMenu) => {
  const aRouter = [];

  let menuList = converToList(treeMenu);
  menuList.forEach(menu => {
    const { path, component, name } = menu;
    if( !validatenull(component) && !validatenull(path) ){
      const oRouter = {
        path: path,
        name: name,
        component(resolve) {
          require(['../views' + component ], resolve)
        }
      }

      aRouter.push(oRouter);
    }
  });

  return aRouter
}

/**
 * 将树形菜单转化为list
 * @param treeMenu
 * @returns {Array}
 */
export const converToList = ( treeMenu ) => {
  let menuList = new Array();

  treeMenu.forEach(menu => {
    if( !validatenull(menu.children) ) converToList(menu.children).forEach( cMenu => menuList.push(cMenu) );
    menuList.push(menu);
  });

  return menuList;
}
