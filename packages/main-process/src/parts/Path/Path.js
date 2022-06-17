const { join } = require('path')

const Root = require('../Root/Root.js')

exports.absolute = (relativePath) => {
  return join(Root.root, relativePath)
}

exports.join = (...paths) => {
  return join(...paths)
}
