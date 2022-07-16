import * as ChildProcess from '../ChildProcess/ChildProcess.js'
import * as Platform from '../Platform/Platform.js'

export const create = () => {
  const extensionHostPath = Platform.getExtensionHostPath()
  const childProcess = ChildProcess.fork(extensionHostPath, {
    execArgv: [
      '--experimental-json-modules',
      '--max-old-space-size=60',
      '--enable-source-maps',
    ],
    env: {
      ...process.env,
      LOGS_DIR: Platform.getLogsDir(),
      CONFIG_DIR: Platform.getConfigDir(),
    },
  })
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
  }
}
