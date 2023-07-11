import * as TranspileTypeScript from '../TranspileTypeScript/TranspileTypeScript.js'
import * as FileSystem from '../FileSystem/FileSystem.js'

export const transpileFile = async (from, to) => {
  const input = await FileSystem.readFile(from)
  const output = TranspileTypeScript.transpileTypeScript(input)
  await FileSystem.writeFile(to, output)
  console.log({ from, to })
}
