import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as Json from '../Json/Json.ts'
import * as Path from '../Path/Path.ts'

export const readJson = async (absolutePath: any): Promise<any> => {
  const content = await FileSystem.readFile(absolutePath)
  const json = await Json.parse(content, absolutePath)
  return json
}

export const writeJson = async (absolutePath: any, value: any): Promise<any> => {
  await FileSystem.mkdir(Path.dirname(absolutePath))
  await FileSystem.writeFile(absolutePath, Json.stringify(value))
}
