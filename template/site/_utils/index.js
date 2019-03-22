export function getCurrentLang() {
  const hash = window.location.hash
  const switchLang = hash.indexOf('/zh-') >= 0 ? 'zh-CN' : hash.indexOf('/en-') >= 0 ? 'en-US' : ''
  return switchLang || localStorage.getItem('VCP_LANGUAGE') || window.navigator.language || 'zh-CN'
}

export const isMobile = /ios|iphone|ipod|ipad|android/.test(navigator.userAgent.toLowerCase())

export function iframeReady(iframe, callback) {
  const doc = iframe.contentDocument || iframe.contentWindow.document
  const interval = () => {
    if (iframe.contentWindow.syncPath) {
      callback()
    } else {
      setTimeout(() => {
        interval()
      }, 50)
    }
  }
  if (doc.readyState === 'complete') {
    interval()
  } else {
    iframe.onload = interval
  }
}
