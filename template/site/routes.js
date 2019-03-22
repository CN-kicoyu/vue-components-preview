import Layout from './components/Layout.vue'
import Iframe from './components/Iframe.vue'
import NoMatch from './components/NoMatch.vue'
import config from './site.config.js'
import Test from './components/Test.vue'
import componentDocs from './docsEntry'
import componentDemos from './demoEntry'
import { getCurrentLang, iframeReady, isMobile } from './_utils'

const LANG = getCurrentLang()

const router = (isMobile) => {
  const route = [{
    path: '*',
    redirect: () => isMobile ? `/mobile.html/${LANG}/` : `/${LANG}/`,
  }]

  Object.keys(config).forEach((lang) => {
    const menus = config['zh-CN'].menus || []
    const childrenList = []

    const homeRoute = isMobile ? {
      path: `/mobile.html/${lang}`,
      component: Iframe,
      children: childrenList,
      props: () => {
        return {config: config[lang], base: `/${LANG}`}
      },
      meta: { lang }
    } : {
      path: `/${lang}`,
      component: Layout,
      props: () => {
        return {config: config[lang], base: `/${LANG}`}
      },
      redirect: `/${lang}${getVaildPath(menus)}`,
      children: childrenList
    }

    route.push(homeRoute)
    menus.forEach(menu => {
      if (menu.groups) {
        menu.groups.forEach(group => {
          group.list.forEach(page => pushRoute(page, lang, isMobile, childrenList))
        })
      } else if (menu.children) {
        menu.children.forEach(page => pushRoute(page, lang, isMobile, childrenList))
      } else {
        pushRoute(menu, lang, isMobile, childrenList)
      }
    })
    if (isMobile) {
      childrenList.push({
        path: `/mobile.html/${lang}*`,
        component: NoMatch,
        props: () => {
          return {config: config[lang], base: `/${LANG}`}
        }
      })
    }
  })
  console.log(route)
  return route
}

function getVaildPath (obj) {
  const result = (path) => {
    if (!(path instanceof Array)) return ''
    for (let i = 0; i < path.length; i++) {
      if (path[i] && path[i].path) {
        return path[i].path
      } else if (path[i] && path[i] instanceof Object) {
        const list = Object.values(path[i])
        const search = result(list[list.length - 1])
        if (search) return search
      }
    }
  }
  return result(obj) || ''
}

function pushRoute (page, lang, isMobile, route) {
  let { path } = page
  if (path) {
    path = path.replace('/', '')
    const component = isMobile ? componentDemos[`${path}.${lang}`] : componentDocs[`${path}.${lang}`]

    if (!component) return

    route.push({
      name: `${lang}/${path}`,
      component,
      path: isMobile ? path : `/${lang}/${path}`,
      meta: {
        lang,
        path,
        name: page.title
      }
    })
  }
}

window.syncPath = function () {
  const router = window.vueRouter
  const isInIframe = window !== window.top
  const currentDir = router.history.current.path
  const pathParts = currentDir.replace(/\/mobile.html/g, '').split('/')
  const lang = currentDir[0] === '/' ? pathParts[1] : pathParts[0]
  if (!isInIframe && !isMobile) {
    const iframe = document.querySelector('iframe')
    if (iframe) {
      iframeReady(iframe, () => {
        iframe.contentWindow.vueRouter.replace(`/mobile.html${currentDir}`)
        // iframe.contentWindow.changePath(`/mobile.html${currentDir}`)
      })
    }
  } else if (isInIframe) {
    window.top.vueRouter.replace(currentDir.replace(/\/mobile.html/g, ''))
    // window.top.changePath(currentDir.replace(/\/mobile.html/g, ''))
  }
}

// window.changePath = function (path = '') {
//   window.vueRouter.replace(path)
// }

export default router

