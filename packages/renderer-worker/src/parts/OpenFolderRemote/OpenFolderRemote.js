import * as Command from '../Command/Command.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const openFolder = async () => {
  const path = await RendererProcess.invoke(/* Dialog.prompt */ 'Dialog.prompt', /* message */ 'Choose path:')
  if (!path) {
    return
  }
  await Command.execute(/* Workspace.setPath */ 'Workspace.setPath', /* path */ path)
}
