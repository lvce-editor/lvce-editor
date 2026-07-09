import * as TypeScriptCompileProcess from '../TypeScriptCompileProcess/TypeScriptCompileProcess.ts'
import * as TranspileTypeScriptCached from '../TranspileTypeScriptCached/TranspileTypeScriptCached.ts'

export const transpileTypeScript = (code: any, useCache: any): any => {
  if (useCache) {
    return TranspileTypeScriptCached.transpileTypeScriptCached(code)
  }
  return TypeScriptCompileProcess.invoke('TranspileTypeScript.transpileTypeScript2', code)
}
