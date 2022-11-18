import * as ChildProcess from '../ChildProcess/ChildProcess.js'
import * as Platform from '../Platform/Platform.js'

export const create = () => {
  const extensionHostHelperProcessPath =
    Platform.getExtensionHostHelperProcessPath()
  const childProcess = ChildProcess.fork(
    extensionHostHelperProcessPath,
    ['--ipc-type=websocket', '--max-old-space-size=60', '--enable-source-maps'],
    {}
  )
  return {
    on(event, listener) {
      switch (event) {
        case 'message':
          childProcess.on('message', listener)
          break
        case 'error':
          childProcess.on('error', listener)
          break
        case 'exit':
          childProcess.on('exit', listener)
          break
        default:
          throw new Error(`unsupported event type ${event}`)
      }
    },
    off(event, listener) {
      switch (event) {
        case 'message':
          childProcess.off('message', listener)
          break
        case 'error':
          childProcess.off('error', listener)
          break
        case 'exit':
          childProcess.off('exit', listener)
          break
        default:
          throw new Error(`unsupported event type ${event}`)
      }
    },
    send(message) {
      childProcess.send(message)
    },
    dispose() {
      childProcess.kill()
    },
    _process: childProcess,
  }
}
