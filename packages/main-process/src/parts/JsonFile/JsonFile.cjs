const { readFile, writeFile } = require('node:fs/promises')
const { readFileSync } = require('node:fs')
const EncodingType = require('../EncodingType/EncodingType.cjs')
const Json = require('../Json/Json.cjs')

exports.readJson = async (path) => {
  const content = await readFile(path, EncodingType.Utf8)
  const json = Json.parse(content, path)
  return json
}

exports.readJsonSync = (path) => {
  const content = readFileSync(path, EncodingType.Utf8)
  const json = Json.parse(content, path)
  return json
}

exports.writeJson = async (path, value) => {
  const content = Json.stringify(value)
  await writeFile(path, content)
}
