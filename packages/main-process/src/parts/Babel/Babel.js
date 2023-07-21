import * as Assert from '../Assert/Assert.cjs'
import * as BabelWorker from '../BabelWorker/BabelWorker.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

export const transpile = async (from, to) => {
  Assert.string(from)
  const ipc = await BabelWorker.getOrCreate()
  await JsonRpc.invoke(ipc, 'TranspileFile.transpileFile', from, to)
}
