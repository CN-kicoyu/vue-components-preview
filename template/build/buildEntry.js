const fs = require('fs-extra')
const glob = require('fast-glob')
const path = require('path')
const Components = require('./getComponents')()
const uppercamelize = require('uppercamelcase');
const packageJson = require('../package.json')
const LANG = ['en-US', 'zh-CN']

const version = process.env.VERSION || packageJson.version
const tips = `/* eslint-disable */
// This file is auto gererated by build/buildEntry.js`;
const root = path.join(__dirname, '../')
const join = dir => path.join(root, dir)
const compPath = '<$=componentsPath$>'

function buildComponentEntry() {
  const importList = Components.map(name => `import ${uppercamelize(name)} from '${compPath}/${name}'`)
  const installList = Components.map(name => `${uppercamelize(name)}`)
  const content = `${tips}
${importList.join('\n')}

const version = '${version}'
const components = [
  ${installList.join(',\n  ')}
]

const install = Vue => {
  components.forEach(Component => {
    Vue.use(Component)
  })
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export {
  install,
  version,
  ${installList.join(',\n  ')}
}

export default {
  install,
  version
}
`
  const dirWork = path.join(__dirname, '../_demos')
  if (!fs.existsSync(dirWork)) fs.mkdirpSync(dirWork)
  fs.writeFileSync(path.join(dirWork, 'components.js'), content)
}

function buildDemoEntry() {
  const dir = path.join(__dirname, '../_demos')
  const demosList = []
  const demos = fs.readdirSync(dir)
  const getList = (list, lang) => {
    return list
      .filter(name => fs.existsSync(path.join(dir, `${name}/${lang}-index.vue`)))
      .map(name => `'${name}.${lang}': () => wrapper(import('../_demos/${name}/${lang}-index.vue'), '${name}.${lang}')`)
  }

  LANG.forEach(item => demosList.push(...getList(demos, item)))

  const content = `${tips}
import { wrapper } from './demoWrap'

export default {
  ${demosList.join(',\n  ')}
}
`
  fs.writeFileSync(path.join(dir, '../site/demoEntry.js'), content)
}


function buildDocsEntry() {
  const output = join('site/docsEntry.js')
  const getName = fullPath => {
    return fullPath.replace(/\/(en|zh)/, '.$1').split('/').pop().replace('.md', '')
  }
  const docs = glob.sync([
    `<$=docsPath$>/**/*.md`,
    `${compPath}/**/*.md`,
    '!**/node_modules/**'
  ])
  .map(fullPath => {
    const name = getName(fullPath)
    return `'${name}': () => import('${path.relative(join('site'), fullPath).replace(/\\/g, '/')}')`
  })

  const content = `${tips}
export default {
  ${docs.join(',\n  ')}
}
`
  fs.writeFileSync(output, content)
}

buildComponentEntry()
buildDemoEntry()
buildDocsEntry()
