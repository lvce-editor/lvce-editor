import * as Rpc from '../Rpc/Rpc.js'

export const evalInRendererProcess = async (code) => {
  await Rpc.invoke('Eval.evalInRendererProcess', code)
}
