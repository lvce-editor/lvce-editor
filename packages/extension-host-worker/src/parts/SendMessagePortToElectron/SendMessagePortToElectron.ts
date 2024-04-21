import * as Rpc from '../Rpc/Rpc.ts'

export const sendMessagePortToElectron = async (port, initialCommand) => {
  await Rpc.invokeAndTransfer([port], 'SendMessagePortToElectron.sendMessagePortToElectron', port, initialCommand)
}
