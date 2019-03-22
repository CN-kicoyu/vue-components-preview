const fs = require('fs')
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')
const cheerio = require('cheerio')
const uppercamelize = require('uppercamelcase');
const Components = require('./getComponents')
const path = require('path')

const dir = '<$=componentsPath$>'
const demoRegExp = new RegExp('(?<=<vcp-demo>)[\\w\\W]*?(?=</vcp-demo>)', 'g')
const tips = `/* eslint-disable */
// This file is auto gererated by build/getDemos.js`
const isLangExist = (lang, name) => fs.existsSync(path.join(dir, `${name}/${lang}.md`))

rimraf.sync(path.join(__dirname, '../_demos'))
Components()
  .filter(Component => isLangExist('zh-CN', Component) || isLangExist('en-US', Component))
  .forEach(Component => {
    if (isLangExist('zh-CN', Component)) {
      getComponentEntry('zh-CN', Component)
    }
    if (isLangExist('en-US', Component)) {
      getComponentEntry('en-US', Component)
    }
  })

function getComponentEntry (lang, name) {
  const output = path.join(__dirname, `../_demos/${name}`)
  buildFileAsync(lang, name).then((fragments) => {
    if (!fragments) return
    const importList = fragments.map((item) => `import ${uppercamelize(item.file.split('.vue')[0])} from './${item.file}'`)
    const compList = fragments.map((item) => `<h2 class="vue-ui-frames-demo-section__title">${item.title}</h2>\n<`+`${uppercamelize(item.file.split('.vue')[0])}/>`)
    const content = `${tips}
<script>
${importList.join('\n')}

export default {
  render() {
    return (
      <vue-ui-frames-demo-section>
        ${compList.join('\n')}
      </vue-ui-frames-demo-section>
    )
  }
}
</script>
`
    fs.writeFile(path.join(path.join(output, `${lang}-index.vue`)), content, 'utf8', (err) => {
      if (err) throw err;
    })
  })
}

function compileMdFile (file) {
  const mdList = file.split('```html').map((item, index) => {
    item = item.replace(/^\s+|\s+$/g, '')
    if (!index) {
      const reg = /^#### /
      const title = item.split('\n')[0]
      return reg.test(title) && title.replace(reg, '').trim() || ''
    } else {
      return item.split('\n```')[0]
    }
  })
  return mdList
}

function buildFileAsync (lang, name) {
  const fragments = []
  const pathSrc = path.join(dir, name, `${lang}.md`)
  return new Promise((resolve, reject) => {
    fs.readFile(pathSrc, 'utf8', (err, data) => {
      if (err) reject(err)
      const matchRes = data.match(demoRegExp)
      if (!matchRes) return resolve()
      matchRes.forEach((item, index) => {
        const output = path.join(__dirname, `../_demos/${name}`)
        const fileContent = compileMdFile(item)
        mkdirp.sync(output)
        fs.writeFileSync(path.join(output, `${lang}-${index}.vue`), fileContent[1], 'utf8')
        fragments.push({file: `${lang}-${index}.vue`, title: fileContent[0]})
      })
      resolve(fragments)
    })
  })
}
