import * as HandleElectronMessagePort from '../HandleElectronMessagePort/HandleElectronMessagePort.js'
import * as TranspileTypeScript from '../TranspileTypeScript/TranspileTypeScript.js'

export const commandMap = {
  'TranspileTypeScript.transpileTypeScript': TranspileTypeScript.transpileTypeScript,
  'HandleElectronMessagePort.handleElectronMessagePort': HandleElectronMessagePort.handleElectronMessagePort,
}
