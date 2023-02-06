const { readFile, writeFile } = require('node:fs/promises')
const Json = require('../Json/Json.js')

exports.readJson = async (path) => {
  const content = await readFile(path, 'utf8')
  const json = Json.parse(content)
  return json
}

exports.writeJson = async (path, value) => {
  const content = Json.stringify(value)
  await writeFile(path, content)
}
