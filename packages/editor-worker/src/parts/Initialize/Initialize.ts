import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'

export const intialize = async () => {
  await RendererProcess.listen()
  await ExtensionHostWorker.listen()
}
