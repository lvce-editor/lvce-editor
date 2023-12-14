import * as ParentIpc from '../ParentIpc/ParentIpc.js'

const ElectronUtilityProcess = 3

export const create = async (options) => {
  // TODO how to launch process without race condition?
  // when promise resolves, process might have already exited
  const messagePort = await ParentIpc.invoke('IpcParent.create', {
    ...options,
    method: ElectronUtilityProcess,
    noReturn: true,
  })
  // TODO return uuid, use uuid to send messages to process
  console.log({ options })
  return options.name
}

export const wrap = (name) => {
  console.log({ name })
  return {
    send(message) {
      console.log({ message })
    },
    async sendAndTransfer(message, transfer) {
      await ParentIpc.invokeAndTransfer('ElectronUtilityProcess.invokeAndTransfer', transfer, name, message)
    },
    on(event, listener) {
      // TODO
    },
  }
}
