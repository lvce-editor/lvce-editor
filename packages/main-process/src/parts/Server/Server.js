const ChildProcess = require('../ChildProcess/ChildProcess.js')
const Command = require('../Command/Command.js')
const Path = require('../Path/Path.js')
const Logger = require('../Logger/Logger.js')
const JsonRpcVersion = require('../JsonRpcVersion/JsonRpcVersion.js')

const state = (exports.state = {
  /**
   * @type{any|undefined}
   */
  child: undefined,
})

const handleChildError = (error) => {
  Logger.info('[main] Child Error')
  Logger.error(error)
  process.exit(1)
}

const handleStdError = (error) => {
  Logger.info('[main] Child std error')
  Logger.error(error)
  process.exit(1)
}

const handleChildMessage = async (message) => {
  if (Array.isArray(message)) {
    Logger.warn('invalid message', message)
    return
  }
  const object = message
  if (object.id) {
    let result
    try {
      result = await Command.execute(object.method, ...object.params)
    } catch (error) {
      Logger.error(error)
      if (state.child) {
        state.child.send({
          jsonrpc: JsonRpcVersion.Two,
          code: /* UnexpectedError */ -32001,
          id: object.id,
          error: 'UnexpectedError',
          // @ts-ignore
          data: error.toString(),
        })
      }
    }
    if (state.child) {
      state.child.send({
        jsonrpc: JsonRpcVersion.Two,
        result,
        id: object.id,
      })
    }
  } else {
    Command.execute(object.method, ...object.params)
  }
}

const handleProcessExit = () => {
  if (state.child) {
    state.child.kill()
  }
}

const handleChildExit = (code) => {
  Logger.info(`[main] web process exited with code ${code}`)
  process.exit(code)
}

const handleChildDisconnect = () => {
  Logger.info('[main] child disconnected')
}

exports.hydrate = async () => {
  // console.log('hydrate server')
  // TODO spawn seems to be a lot faster than fork for unknown reasons
  // const child = fork('../../packages/web/bin/web.js', {
  //   // stdio: 'pipe',
  //   // stdio: 'inherit',
  //   stdio: 'overlapped',
  // })

  // TODO inherit stdout but listen to ready event
  state.child = ChildProcess.create(Path.absolute('packages/web/bin/web.js'), {
    stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
    env: {
      ...process.env,
      // ELECTRON_RUN_AS_NODE: '1', // TODO
    },
  })
  console.log(process.versions.electron)
  // TODO handle all possible errors from web server process
  state.child.on('error', handleChildError)
  state.child.on('message', handleChildMessage)
  state.child.on('exit', handleChildExit)
  state.child.on('disconnect', handleChildDisconnect)
  process.on('exit', handleProcessExit)
  await new Promise((resolve) => {
    state.child.on('ready', resolve)
  })
}
