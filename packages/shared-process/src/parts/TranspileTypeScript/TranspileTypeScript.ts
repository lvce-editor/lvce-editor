import * as TranspileTypeScriptCached from '../TranspileTypeScriptCached/TranspileTypeScriptCached.ts'
import * as TypeScriptCompileProcess from '../TypeScriptCompileProcess/TypeScriptCompileProcess.ts'

export const transpileTypeScript = (code: any, useCache: any): any => {
  if (useCache) {
    return TranspileTypeScriptCached.transpileTypeScriptCached(code)
  }
  return TypeScriptCompileProcess.invoke('TranspileTypeScript.transpileTypeScript2', code)
}
