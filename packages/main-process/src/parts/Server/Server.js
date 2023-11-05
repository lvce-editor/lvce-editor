import * as ChildProcess from '../ChildProcess/ChildProcess.js'
import * as Command from '../Command/Command.js'
import * as Path from '../Path/Path.js'
import * as Logger from '../Logger/Logger.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'
import * as ExitCode from '../ExitCode/ExitCode.js'
import * as Process from '../Process/Process.js'

export const state = {
  /**
   * @type{any|undefined}
   */
  child: undefined,
}

const handleChildError = (error) => {
  Logger.info('[main] Child Error')
  Logger.error(error)
  Process.exit(ExitCode.Error)
}

const handleStdError = (error) => {
  Logger.info('[main] Child std error')
  Logger.error(error)
  Process.exit(ExitCode.Error)
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
  Process.exit(code)
}

const handleChildDisconnect = () => {
  Logger.info('[main] child disconnected')
}

export const hydrate = async () => {
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
  Process.on('exit', handleProcessExit)
  await new Promise((resolve) => {
    state.child.on('ready', resolve)
  })
}
