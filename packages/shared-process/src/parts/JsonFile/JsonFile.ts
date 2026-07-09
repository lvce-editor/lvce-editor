import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as Json from '../Json/Json.ts'
import * as Path from '../Path/Path.ts'

export const readJson = async (absolutePath) => {
  const content = await FileSystem.readFile(absolutePath)
  const json = await Json.parse(content, absolutePath)
  return json
}

export const writeJson = async (absolutePath, value) => {
  await FileSystem.mkdir(Path.dirname(absolutePath))
  await FileSystem.writeFile(absolutePath, Json.stringify(value))
}
