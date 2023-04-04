const { fork } = require('node:child_process')
const Platform = require('../Platform/Platform.js')
const Logger = require('../Logger/Logger.js')

exports.handlePort = async (event, browserWindowPort) => {
  const extensionHostPath = Platform.getExtensionHostPath()
  const start = Date.now()
  const extensionHost = fork(extensionHostPath, ['--ipc-type=parent'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: '1',
    },
  })
  const end = Date.now()
  const { pid } = extensionHost
  const forkTime = end - start
  Logger.info(`[main-process] Starting extension host with pid ${pid} (fork took ${forkTime} ms).`)

  await new Promise((resolve, reject) => {
    const handleFirstMessage = (event) => {
      if (event === 'ready') {
        resolve(undefined)
      } else {
        reject(new Error('unexpected first message'))
      }
    }
    extensionHost.once('message', handleFirstMessage)
  })
  browserWindowPort.on('message', (event) => {
    console.log({ event })
    extensionHost.send(event.data)
  })
  extensionHost.on('message', (event) => {
    console.log({ event })
    browserWindowPort.postMessage(event)
  })
  browserWindowPort.start()
}
