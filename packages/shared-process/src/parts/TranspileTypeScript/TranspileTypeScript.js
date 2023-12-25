import { VError } from '@lvce-editor/verror'
import * as GetTypeScriptPath from '../GetTypeScriptPath/GetTypeScriptPath.js'
import * as Assert from '../Assert/Assert.js'
import * as LoadTypeScript from '../LoadTypeScript/LoadTypeScript.js'

export const transpileTypeScript = async (code) => {
  try {
    Assert.string(code)
    const typescriptPath = GetTypeScriptPath.getTypeScriptPath()
    console.log({ typescriptPath })
    const typescript = await LoadTypeScript.loadTypeScript(typescriptPath)
    console.log({ k: Object.keys(typescript) })
    const newContent = await typescript.transpileModule(code, {
      compilerOptions: {
        target: 'esnext',
      },
    })
    console.log({ newContent })
    return newContent
  } catch (error) {
    console.log({ error })
    throw new VError(error, `Failed to transpile typescript`)
  }
}
