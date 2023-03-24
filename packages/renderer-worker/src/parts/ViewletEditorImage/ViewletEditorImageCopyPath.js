import * as Command from '../Command/Command.js'
import * as RendererWorkerCommandType from '../RendererWorkerCommandType/RendererWorkerCommandType.js'

export const copyPath = async (state) => {
  await Command.execute(RendererWorkerCommandType.ClipBoardWriteText, state.uri)
  return state
}
