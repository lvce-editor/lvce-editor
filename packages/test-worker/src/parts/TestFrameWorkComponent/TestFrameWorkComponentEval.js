import * as Command from '../Command/Command.js'

export const evalInRendererProcess = async (code) => {
  await Command.execute('Eval.evalInRendererProcess', code)
}
