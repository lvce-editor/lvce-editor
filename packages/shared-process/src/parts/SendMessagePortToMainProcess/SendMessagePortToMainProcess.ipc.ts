import * as SendMessagePortToMainProcess from './SendMessagePortToMainProcess.ts'

export const name = 'SendMessagePortToMainProcess'

export const Commands = {
  sendMessagePortToMainProcess: SendMessagePortToMainProcess.sendMessagePortToMainProcess,
}
