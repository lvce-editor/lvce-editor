import { mkdir, readFile, writeFile } from 'node:fs/promises'
import * as Path from '../Path/Path.js'
import * as Json from '../Json/Json.js'

export const readJson = async (absolutePath) => {
  const content = await readFile(absolutePath, 'utf-8')
  const json = await Json.parse(content, absolutePath)
  return json
}

export const writeJson = async (absolutePath, value) => {
  await mkdir(Path.dirname(absolutePath), { recursive: true })
  await writeFile(absolutePath, Json.stringify(value))
}
