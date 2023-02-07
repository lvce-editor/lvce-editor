const { Worker } = require('node:worker_threads')
const Command = require('../Command/Command.js')
const ErrorHandling = require('../ErrorHandling/ErrorHandling.js')
const Platform = require('../Platform/Platform.js')
const Logger = require('../Logger/Logger.js')
const GetResponse = require('../GetResponse/GetResponse.js')
const ExitCode = require('../ExitCode/ExitCode.js')
const Process = require('../Process/Process.js')

const state = (exports.state = {
  /**
   * @type{Worker|undefined}
   */
  sharedProcess: undefined,
  onMessage(message) {},
})

const handleChildError = (error) => {
  Logger.info('[main] Child Error')
  Logger.error(error.toString())
  Process.exit(ExitCode.Error)
}

const handleStdError = (error) => {
  Logger.info('[main] Child std error')
  Logger.error(error.toString())
  Process.exit(ExitCode.Error)
}

const handleChildMessage = async (message) => {
  if (message === 'ready') {
    return
  }
  if (Array.isArray(message)) {
    Logger.warn('invalid message', message)
    return
  }
  if (message.result || message.error) {
    state.onMessage(message)
    return
  }
  if (!message.id && !message.params) {
    // TODO need better way to send terminal data
    const parsed = JSON.parse(message)
    state.onMessage(parsed)
    return
  }
  if (message.id) {
    if ('result' in message) {
      state.onMessage(message)
      return
    }
    const response = await GetResponse.getResponse(message)
    if (state.sharedProcess) {
      state.sharedProcess.postMessage(response)
    }
  } else {
    try {
      await Command.execute(message.method, ...message.params)
    } catch (error) {
      ErrorHandling.handleError(error)
    }
  }
}

const handleProcessExit = async () => {
  if (state.sharedProcess) {
    // await state.sharedProcess.terminate()
    // state.sharedProcess.postMessage('terminate')
    Logger.info('[main-process] terminating shared process')
    await state.sharedProcess.terminate()
    // state.sharedProcess.
  }
}

const handleChildExit = (code) => {
  Logger.info(`[main] shared process exited with code ${code}`)
  Process.exit(code)
}

const handleChildDisconnect = () => {
  Logger.info('[main] shared process disconnected')
}

exports.send = (message) => {
  // @ts-ignore
  state.sharedProcess.postMessage(message)
}

exports.sendPort = (port) => {
  console.log('send port to shared process')
  // @ts-ignore
  state.sharedProcess.postMessage(port, [port])
}

exports.setOnMessage = (fn) => {
  state.onMessage = fn
}

// TODO not possible because  TypeError [ERR_INVALID_HANDLE_TYPE]: This handle type cannot be sent
// exports.sendPort = (port) => {
//   state.sharedProcess.send('here-is-the-port', port)
// }

exports.hydrate = async (env = {}) => {
  if (state.sharedProcess) {
    return state.sharedProcess
  }
  // console.log('hydrate server')
  // TODO spawn seems to be a lot faster than fork for unknown reasons
  // const child = fork('../../packages/web/bin/web.js', {
  //   // stdio: 'pipe',
  //   // stdio: 'inherit',
  //   stdio: 'overlapped',
  // })

  if (state.sharedProcess) {
    // @ts-ignore
    state.sharedProcess.off('disconnect', handleChildDisconnect)
    // @ts-ignore
    state.sharedProcess.off('exit', handleChildExit)
    // @ts-ignore
    state.sharedProcess.terminate()
    state.sharedProcess = undefined
  }
  // console.log('env', process.env.ELECTRON_RUN_AS_NODE)
  // console.log(process.env)
  // TODO inherit stdout but listen to ready event
  const sharedProcessPath = Platform.getSharedProcessPath()
  const sharedProcess = new Worker(sharedProcessPath, {
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: '1', // TODO
      ...env,
    },
    execArgv: ['--enable-source-maps'],
  })
  // TODO handle all possible errors from web server process
  sharedProcess.on('error', handleChildError)
  sharedProcess.on('message', handleChildMessage)
  sharedProcess.on('exit', handleChildExit)
  sharedProcess.on('disconnect', handleChildDisconnect)
  process.on('exit', handleProcessExit)
  state.sharedProcess = sharedProcess
  return sharedProcess
}
