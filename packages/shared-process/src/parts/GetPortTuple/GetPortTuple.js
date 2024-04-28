import * as TemporaryMessagePort from '../TemporaryMessagePort/TemporaryMessagePort.js'

// workaround for MessageChannelMain not being available in utility process
export const getPortTuple = async () => {
  const { port1, port2 } = await TemporaryMessagePort.getPortTuple()
  return { port1, port2 }
}
