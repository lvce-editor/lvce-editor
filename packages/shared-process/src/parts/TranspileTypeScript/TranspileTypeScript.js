import * as TypeScriptCompileProcess from '../TypeScriptCompileProcess/TypeScriptCompileProcess.js'
import * as TranspileTypeScriptCached from '../TranspileTypeScriptCached/TranspileTypeScriptCached.js'

export const transpileTypeScript = (code, useCache) => {
  if (useCache) {
    return TranspileTypeScriptCached.transpileTypeScript(code)
  }
  return TypeScriptCompileProcess.invoke('TranspileTypeScript.transpileTypeScript', code)
}
