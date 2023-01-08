const { join } = require('node:path')

const Root = require('../Root/Root.js')

exports.absolute = (relativePath) => {
  return join(Root.root, relativePath)
}

exports.join = (...paths) => {
  return join(...paths)
}
