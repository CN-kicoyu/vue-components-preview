import Vue from 'vue'
import VueRouter from 'vue-router'
import VueUiFrames, { progress } from 'vue-ui-frames'
import routes from './routes'

Vue.use(VueRouter).use(VueUiFrames)
const router = new VueRouter({
  mode: 'history',
  fallback: false,
  routes: routes(true),
  scrollBehavior(to, from) {
    return { x: 0, y: 0 };
  }
})
console.log(routes(true))
router.beforeEach((to, from, next) => {
  if (to.path !== from.path) {
    progress.start()
  }
  next()
})

router.afterEach(() => {
  progress.done()
  if (!router.currentRoute.redirectedFrom) {
    Vue.nextTick(() => window.syncPath());
  }
})

window.vueRouter = router;

if (process.env.NODE_ENV !== 'production') {
  Vue.config.productionTip = false;
}

new Vue({
  el: "#app",
  router
})
