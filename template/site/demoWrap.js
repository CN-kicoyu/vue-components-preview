import Vue from 'vue'
import Components from '../_demos/components'

Vue.use(Components)

export function wrapper(promise, name) {
  return promise.then(component => {
    component = component.default
    name = 'demo-' + name
    component.name = name
    return component
  })
}
