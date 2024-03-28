import * as SendMessagePortToElectron from '../SendMessagePortToElectron/SendMessagePortToElectron.ts'

export const create = async () => {
  const { port1, port2 } = new MessageChannel()
  await SendMessagePortToElectron.sendMessagePortToElectron(port2, '')
  return port1
}
