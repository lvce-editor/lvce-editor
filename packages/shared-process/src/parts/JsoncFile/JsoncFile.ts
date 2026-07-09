import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as Jsonc from '../Jsonc/Jsonc.ts'

export const readJsonc = async (absolutePath) => {
  const content = await FileSystem.readFile(absolutePath)
  // @ts-ignore
  const json = await Jsonc.parse(content)
  return json
}
