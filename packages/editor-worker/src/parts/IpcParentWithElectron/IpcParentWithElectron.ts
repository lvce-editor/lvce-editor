import * as SendMessagePortToElectron from '../SendMessagePortToElectron/SendMessagePortToElectron.ts'

export const create = async (options: any) => {
  const { port1, port2 } = new MessageChannel()
  await SendMessagePortToElectron.sendMessagePortToElectron(port2, options.initialCommand)
  return port1
}
