import * as Debug from './parts/Debug/Debug.js'
import * as IpcChild from './parts/IpcChild/IpcChild.js'
import * as IpcChildType from './parts/IpcChildType/IpcChildType.js'
import * as PtyController from './parts/PtyController/PtyController.js'

const handleMessage = (message) => {
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

const main = async () => {
  const ipc = await IpcChild.listen({ method: IpcChildType.Auto() })
  ipc.on('message', handleMessage)
}

main()
