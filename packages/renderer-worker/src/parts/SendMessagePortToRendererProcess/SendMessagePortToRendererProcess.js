import * as Assert from '../Assert/Assert.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const sendMessagePortToRendererProcess = async (port, initialCommand) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await RendererProcess.invokeAndTransfer([port], initialCommand)
}
