const { readFile, writeFile } = require('node:fs/promises')
const EncodingType = require('../EncodingType/EncodingType.js')
const Json = require('../Json/Json.js')

exports.readJson = async (path) => {
  const content = await readFile(path, EncodingType.Utf8)
  const json = Json.parse(content, path)
  return json
}

exports.writeJson = async (path, value) => {
  const content = Json.stringify(value)
  await writeFile(path, content)
}
