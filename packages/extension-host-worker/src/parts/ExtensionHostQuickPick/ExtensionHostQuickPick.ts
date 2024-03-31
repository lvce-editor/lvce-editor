import * as Rpc from '../Rpc/Rpc.js'
import * as RendererWorkerCommandType from '../RendererWorkerCommandType/RendererWorkerCommandType.js'

export const showQuickPick = async ({ getPicks, toPick }) => {
  const rawPicks = await getPicks()
  const picks = rawPicks.map(toPick)
  return Rpc.invoke(RendererWorkerCommandType.ExtensionHostQuickPickShow, picks)
}
