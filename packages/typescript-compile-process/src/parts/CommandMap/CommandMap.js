import * as HandleElectronMessagePort from '../HandleElectronMessagePort/HandleElectronMessagePort.js'
import * as TranspileTypeScript from '../TranspileTypeScript/TranspileTypeScript.js'
import * as TypeScriptPath from '../TypeScriptPath/TypeScriptPath.js'

export const commandMap = {
  'TranspileTypeScript.transpileTypeScript': TranspileTypeScript.transpileTypeScript,
  'TypeScript.setTypeScriptPath': TypeScriptPath.set,
  'HandleElectronMessagePort.handleElectronMessagePort': HandleElectronMessagePort.handleElectronMessagePort,
}
