const fs = require('node:fs/promises')

exports.readDir = (path) => {
  return fs.readdir(path)
}
