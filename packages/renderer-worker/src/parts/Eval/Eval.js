import * as RendererProcess from '../RendererProcess/RendererProcess.js'

/*
 * should only be used for testing
 */
export const evalInRendererProcess = (code) => {
  return RendererProcess.invoke('Eval.evalCode', code)
}
