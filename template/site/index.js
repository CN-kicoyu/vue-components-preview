import Vue from 'vue'
import VueRouter from 'vue-router'
import VueUiFrames, { progress } from 'vue-ui-frames'
import routes from './routes'
import { isMobile } from './_utils'

Vue.use(VueRouter).use(VueUiFrames)

const router = new VueRouter({
  mode: 'history',
  fallback: false,
  routes: routes(),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 }
  }
})

router.beforeEach((to, from, next) => {
  if (isMobile) {
    location.replace(`mobile.html${location.pathname}`)
  }
  if (to.path !== from.path) {
    progress.start()
    document.title = to.meta.title || document.title
  }
  next()
})

router.afterEach(() => {
  progress.done()
  Vue.nextTick(() => window.syncPath())
})

window.vueRouter = router;

if (process.env.NODE_ENV !== 'production') {
  Vue.config.productionTip = false;
}

new Vue({
  el: "#app",
  router,
})
