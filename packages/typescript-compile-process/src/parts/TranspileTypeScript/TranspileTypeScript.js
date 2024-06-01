import { VError } from '@lvce-editor/verror'
import * as Assert from '../Assert/Assert.js'
import * as LoadTypeScript from '../LoadTypeScript/LoadTypeScript.js'
import * as TypeScriptPath from '../TypeScriptPath/TypeScriptPath.js'

export const transpileTypeScript = async (code) => {
  try {
    Assert.string(code)
    const typescriptUri = TypeScriptPath.get()
    const typescript = await LoadTypeScript.loadTypeScript(typescriptUri)
    const newContent = await typescript.transpileModule(code, {
      compilerOptions: {
        target: 'esnext',
      },
    })
    return newContent
  } catch (error) {
    throw new VError(error, `Failed to transpile typescript`)
  }
}
