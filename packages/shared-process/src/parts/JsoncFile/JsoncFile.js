import * as FileSystem from '../FileSystem/FileSystem.js'
import * as Jsonc from '../Jsonc/Jsonc.js'

export const readJsonc = async (absolutePath) => {
  const content = await FileSystem.readFile(absolutePath)
  const json = await Jsonc.parse(content)
  return json
}
