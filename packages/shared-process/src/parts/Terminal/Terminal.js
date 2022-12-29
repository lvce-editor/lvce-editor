import exitHook from 'exit-hook'
import { ChildProcess, fork } from 'node:child_process'
import * as Assert from '../Assert/Assert.js'
import * as Debug from '../Debug/Debug.js'
import * as PtyHostPath from '../PtyHostPath/PtyHostPath.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'

export const state = {
  /**
   * @type {ChildProcess|undefined}
   */
  ptyHost: undefined,
  ptyHostState: /* None */ 0,
  /**
   * @type {any[]}
   */
  pendingMessages: [],
  send(message) {
    state.pendingMessages.push(message)
  },
}

// const getSpawnOptions = () => {
//   if (Platform.isWindows) {
//     return {
//       command: 'powershell.exe',
//       args: [],
//     }
//   }
//   return {
//     command: 'bash',
//     args: ['-i'],
//   }
// }

const cleanUpAll = () => {
  if (state.ptyHost) {
    state.ptyHost.kill()
  }
}

const handleProcessExit = () => {
  Debug.debug('shared process exit, clean terminals')
  cleanUpAll()
}

const createPtyHost = async () => {
  exitHook(handleProcessExit)
  const ptyHostPath = await PtyHostPath.getPtyHostPath()
  const ptyHost = fork(ptyHostPath, { stdio: 'inherit' })
  return ptyHost
}

// const send = (method, ...params) => {

//   state.ptyHost.send({
//     jsonrpc: '2.0',
//     method,
//     params,
//   })
// }

export const create = async (socket, id, cwd) => {
  Assert.object(socket)
  Assert.number(id)
  Assert.string(cwd)

  Debug.debug('creating pty host')
  switch (state.ptyHostState) {
    case /* None */ 0: {
      state.ptyHostState = /* Creating */ 1
      const ptyHost = await createPtyHost()
      const handleFirstMessage = () => {
        Debug.debug('pty host ready')
        state.ptyHostState = /* Ready */ 2
        const handleMessage = (message) => {
          const data = message.params[1]
          socket.send({
            jsonrpc: JsonRpcVersion.Two,
            method: 'Viewlet.send',
            params: ['Terminal', 'handleData', data],
          })
        }
        ptyHost.on('message', handleMessage)
        state.send = (message) => {
          ptyHost.send(message)
        }
        while (state.pendingMessages.length > 0) {
          state.send(state.pendingMessages.shift())
        }
      }
      ptyHost.once('message', handleFirstMessage)
      state.ptyHost = ptyHost
      break
    }
    case /* Creating */ 1: {
      break
    }
    case /* Ready */ 2: {
      break
    }
    default:
      break
  }
  state.send({
    jsonrpc: JsonRpcVersion.Two,
    method: 'Terminal.create',
    params: [id, cwd],
  })
  const handleClose = () => {
    if (state.ptyHost) {
      state.ptyHost.removeAllListeners()
      state.ptyHost.kill()
      state.ptyHost = undefined
      state.ptyHostState = /* None */ 0
      state.send = (message) => {
        state.pendingMessages.push(message)
      }
    }
  }
  socket.on('close', handleClose)
}

export const write = (id, data) => {
  Assert.number(id)
  Assert.string(data)
  if (!state.ptyHost) {
    console.log('[shared-process] pty host not ready')
    return
  }
  state.send({
    jsonrpc: JsonRpcVersion.Two,
    method: 'Terminal.write',
    params: [id, data],
  })
}

export const resize = (state, columns, rows) => {
  // state.pty.resize(columns, rows)
}

export const dispose = (id) => {
  state.send({
    jsonrpc: JsonRpcVersion.Two,
    method: 'Terminal.dispose',
    params: [id],
  })
}

export const disposeAll = () => {
  if (state.ptyHost) {
    state.ptyHost.removeAllListeners()
    state.ptyHost.kill()
    state.ptyHost = undefined
    state.ptyHostState = /* None */ 0
    state.send = (message) => {
      state.pendingMessages.push(message)
    }
  }
}
