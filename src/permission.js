import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

NProgress.configure({ showSpinner: false });
const whiteList = ['/login', '/404', '/401'];

router.beforeEach((to, from, next) => {
  NProgress.start();
  if (store.getters.access_token) { //有token，已经登录过
      if( to.path === '/login' ){
        next({ path: '/' });
        NProgress.done();
      } else {
        if (store.getters.roles.length === 0) {
          store.dispatch('GetUserInfo').then(res => {
            next({ ...to, replace: true })
          }).catch(() => {
              next({ path: '/login' })
              NProgress.done()
          })
        } else {
          next();
        }
      }
  } else { //没有token，没有登录
    if (whiteList.indexOf(to.path) !== -1) next();
    else next('/login');

    NProgress.done();
  }
});

router.afterEach((to, from) => {
  let toPath = to.path;
  let treeMenu = store.getters.menu;
  treeMenu.forEach( menu => {
    if( menu.path == toPath  ){
      store.commit('SET_CRUMB',  [to.name]);
      NProgress.done();
      return ;
    } else {
      if( menu.children.length > 0 ){
        menu.children.forEach( cMenu => {
          if( cMenu.path == toPath  ){
            store.commit('SET_CRUMB',  [menu.name, to.name]);
            NProgress.done();
            return ;
          }
        });
      }
    }
  });
})


