import * as ChildProcess from '../ChildProcess/ChildProcess.js'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'

export const create = async () => {
  const extensionHostPath = await PlatformPaths.getExtensionHostPath()
  const childProcess = ChildProcess.fork(
    extensionHostPath,
    ['--ipc-type=websocket', '--experimental-json-modules', '--max-old-space-size=60', '--enable-source-maps'],
    {
      env: {
        ...process.env,
        LOGS_DIR: PlatformPaths.getLogsDir(),
        CONFIG_DIR: PlatformPaths.getConfigDir(),
      },
    },
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
