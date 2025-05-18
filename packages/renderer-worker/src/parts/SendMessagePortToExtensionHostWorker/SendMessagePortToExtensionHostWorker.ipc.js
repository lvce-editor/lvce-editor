import * as SendMessagePortToExtensionHostWorker from './SendMessagePortToExtensionHostWorker.js'

export const name = 'SendMessagePortToExtensionHostWorker'

export const Commands = {
  sendMessagePortToExtensionHostWorker: SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionHostWorker,
  sendMessagePortToSharedProcess: SendMessagePortToExtensionHostWorker.sendMessagePortToSharedProcess,
}
