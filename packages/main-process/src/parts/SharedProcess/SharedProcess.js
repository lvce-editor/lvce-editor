const { Worker } = require('worker_threads')
const ChildProcess = require('../ChildProcess/ChildProcess.js')
const Command = require('../Command/Command.js')
const Path = require('../Path/Path.js')
const ErrorHandling = require('../ErrorHandling/ErrorHandling.js')
const Platform = require('../Platform/Platform.js')

const state = (exports.state = {
  /**
   * @type{Worker|undefined}
   */
  sharedProcess: undefined,
  onMessage(message) {},
})

const handleChildError = (error) => {
  console.info('[main] Child Error')
  console.error(error.toString())
  process.exit(1)
}

const handleStdError = (error) => {
  console.info('[main] Child std error')
  console.error(error.toString())
  process.exit(1)
}

const handleChildMessage = async (message) => {
  if (message === 'ready') {
    return
  }
  if (Array.isArray(message)) {
    console.warn('invalid message', message)
    return
  }
  const object = message
  if (object.result || object.error) {
    state.onMessage(message)
    return
  }
  if (!object.id && !object.params) {
    // TODO need better way to send terminal data
    const parsed = JSON.parse(object)
    state.onMessage(parsed)
    return
  }
  if (object.id) {
    if ('result' in object) {
      state.onMessage(object)
      return
    }
    let result
    try {
      result = await Command.invoke(object.method, ...object.params)
    } catch (error) {
      console.error(error)
      if (state.sharedProcess) {
        state.sharedProcess.postMessage({
          jsonrpc: '2.0',
          code: /* UnexpectedError */ -32001,
          id: object.id,
          error: 'UnexpectedError',
          // @ts-ignore
          data: error.toString(),
        })
      }
      return
    }
    if (state.sharedProcess) {
      state.sharedProcess.postMessage({
        jsonrpc: '2.0',
        result,
        id: object.id,
      })
    }
  } else {
    try {
      await Command.execute(object.method, ...object.params)
    } catch (error) {
      ErrorHandling.handleError(error)
    }
  }
}

const handleProcessExit = async () => {
  if (state.sharedProcess) {
    // await state.sharedProcess.terminate()
    // state.sharedProcess.postMessage('terminate')
    console.info('[main-process] terminating shared process')
    await state.sharedProcess.terminate()
    // state.sharedProcess.
  }
}

const handleChildExit = (code) => {
  console.info(`[main] shared process exited with code ${code}`)
  process.exit(code)
}

const handleChildDisconnect = () => {
  console.info('[main] shared process disconnected')
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
    state.sharedProcess.off('disconnect', handleChildDisconnect)
    state.sharedProcess.off('exit', handleChildExit)
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
