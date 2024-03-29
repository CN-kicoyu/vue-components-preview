const fs = require('fs')
const path = require('path')

const excludes = [
  'index.js',
  'index.less',
  'style',
  'mixins',
  'utils',
  '.DS_Store',
]

module.exports = function () {
  const dirs = fs.readdirSync('<$=componentsPath$>')
  return dirs.filter(dirName => excludes.indexOf(dirName) === -1 && !/^_/.test(dirName))
}
