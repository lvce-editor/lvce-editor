import * as FileSystem from '../FileSystem/FileSystem.js'
import * as Jsonc from '../Jsonc/Jsonc.js'

export const readJsonc = async (absolutePath) => {
  const content = await FileSystem.readFile(absolutePath)
  // @ts-ignore
  const json = await Jsonc.parse(content)
  return json
}
