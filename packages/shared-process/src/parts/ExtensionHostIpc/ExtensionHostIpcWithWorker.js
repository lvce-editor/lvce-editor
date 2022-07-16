import { Worker } from 'worker_threads'
import * as Platform from '../Platform/Platform.js'

export const create = () => {
  const extensionHostPath = Platform.getExtensionHostPath()
  const child = new Worker(extensionHostPath, {
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
          child.on('message', listener)
          break
        case 'error':
          child.on('error', listener)
          break
        default:
          break
      }
    },
    send(message) {
      child.postMessage(message)
    },
    dispose() {
      child.terminate()
    },
  }
}
