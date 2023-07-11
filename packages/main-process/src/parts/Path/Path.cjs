const { join } = require('node:path')

const Root = require('../Root/Root.cjs')

exports.absolute = (relativePath) => {
  return join(Root.root, relativePath)
}

exports.join = (...paths) => {
  return join(...paths)
}
