const { fork } = require('node:child_process')
const Platform = require('../Platform/Platform.js')
const Logger = require('../Logger/Logger.js')

exports.handlePort = async (event) => {
  const extensionHostPath = Platform.getExtensionHostHelperProcessPath()
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
  Logger.info(`[main-process] Starting extension host helper with pid ${pid} (fork took ${forkTime} ms).`)
  const browserWindowPort = event.ports[0]

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
  console.log('host is ready')
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
