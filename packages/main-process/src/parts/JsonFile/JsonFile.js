const { readFile } = require('node:fs/promises')

exports.readJson = async (path) => {
  const content = await readFile(path, 'utf8')
  const json = JSON.parse(content)
  return json
}
