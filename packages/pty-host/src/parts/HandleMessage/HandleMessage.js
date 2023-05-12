import * as Debug from '../Debug/Debug.js'
import * as PtyController from '../PtyController/PtyController.js'

export const handleMessage = (message) => {
  switch (message.method) {
    case 'Terminal.create':
      Debug.debug('create terminal')
      PtyController.create(...message.params)
      break
    case 'Terminal.write':
      PtyController.write(...message.params)
      break
    default:
      console.warn('unknown message', message)
      break
  }
}
