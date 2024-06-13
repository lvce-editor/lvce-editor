import * as Rpc from '../Rpc/Rpc.ts'

export const sendMessagePortToElectron = async (port: MessagePort, initialCommand: string) => {
  await Rpc.invokeAndTransfer([port], 'SendMessagePortToElectron.sendMessagePortToElectron', port, initialCommand)
}
