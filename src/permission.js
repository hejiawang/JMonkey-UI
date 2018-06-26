import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

NProgress.configure({ showSpinner: false })

router.beforeEach((to, from, next) => {
  NProgress.start()

  const value = to.query.src ? to.query.src : to.path
  const label = to.query.name ? to.query.name : to.name
  console.info(value);
  console.info(label);

  NProgress.done()
});
