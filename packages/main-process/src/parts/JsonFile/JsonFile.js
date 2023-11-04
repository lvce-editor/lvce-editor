import { readFileSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import * as EncodingType from '../EncodingType/EncodingType.js'
import * as Json from '../Json/Json.js'

export const readJson = async (path) => {
  const content = await readFile(path, EncodingType.Utf8)
  const json = Json.parse(content, path)
  return json
}

export const readJsonSync = (path) => {
  const content = readFileSync(path, EncodingType.Utf8)
  const json = Json.parse(content, path)
  return json
}

export const writeJson = async (path, value) => {
  const content = Json.stringify(value)
  await writeFile(path, content)
}
