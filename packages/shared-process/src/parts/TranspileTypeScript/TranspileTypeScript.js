import * as TypeScriptCompileProcess from '../TypeScriptCompileProcess/TypeScriptCompileProcess.js'

export const transpileTypeScript = (code) => {
  return TypeScriptCompileProcess.invoke('TranspileTypeScript.transpileTypeScript', code)
}
