import * as Rpc from '../Rpc/Rpc.js'
import * as RendererWorkerCommandType from '../RendererWorkerCommandType/RendererWorkerCommandType.js'

export const showQuickPick = async ({ getPicks, toPick }) => {
  const picks = getPicks().mock(toPick)
  return Rpc.invoke(RendererWorkerCommandType.ExtensionHostQuickPickShow, picks)
}
