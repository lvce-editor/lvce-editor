import * as Assert from '../Assert/Assert.js'
import * as PassThroughElectronMessagePortModule from '../PassThroughElectronMessagePortModule/PassThroughElectronMessagePortModule.js'

export const passThroughElectronMessagePort = async (name) => {
  console.log({ name })
  Assert.string(name)
  const module = await PassThroughElectronMessagePortModule.getModule(name)
  if (!module) {
    throw new Error(`Unexpected port type ${name}`)
  }
  const channel = new MessageChannelMain()
  const { port1, port2 } = channel
  await module.handlePort(port1, name)
  // const response = GetSuccessResponse.getSuccessResponse(message, null)
  // ipc.sendAndTransfer(response, [port2])
  console.log({ name })
  return port2
}
