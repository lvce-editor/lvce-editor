import * as BabelWorkerCommandType from '../BabelWorkerCommandType/BabelWorkerCommandType.js'
import * as TranspileFile from '../TranspileFile/TranspileFile.js'

export const commandMap = {
  [BabelWorkerCommandType.TranspileFile]: TranspileFile.transpileFile,
}
