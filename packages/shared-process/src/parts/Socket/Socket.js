import VError from 'verror'
import * as Command from '../Command/Command.js'
import * as Error from '../Error/Error.js'
import { requiresSocket } from '../RequiresSocket/RequiresSocket.js'

export const state = {
  /**
   * @type {any}
   */
  socket: undefined,
}

export const send = (message) => {
  if (!state.socket) {
    console.warn('socket not yet available')
    return
  }
  state.socket.send(message)
}

const JSON_RPC_VERSION = '2.0'

const handleMessage = async (event) => {
  const object = JSON.parse(event.data)
  if (object.id) {
    if (!object.params) {
      console.warn(
        '[shared-process] invalid message 1',
        typeof object,
        object.params,
        object
      )
      return
    }
    let result
    try {
      result = requiresSocket(object.method)
        ? await Command.invoke(object.method, state.socket, ...object.params)
        : await Command.invoke(object.method, ...object.params)
    } catch (error) {
      if (error instanceof Error.OperationalError) {
        // console.log({ error })
        const rawCause = error.cause()
        const errorCause = rawCause ? rawCause.message : ''
        const errorMessage = rawCause
          ? error.message.slice(0, error.message.indexOf(errorCause))
          : ''

        // console.info('expected error', error)
        send({
          jsonrpc: JSON_RPC_VERSION,
          id: object.id,
          error: {
            code: /* ExpectedError */ -32000,
            message: error.message,
            data: {
              stack: error.originalStack,
              codeFrame: error.originalCodeFrame,
              category: error.category,
              // @ts-ignore
              stderr: error.stderr,
            },
          },
        })
      } else {
        console.error(error)
        // TODO check if socket is active
        send({
          jsonrpc: JSON_RPC_VERSION,
          id: object.id,
          error: {
            code: /* UnexpectedError */ -32001,
            // @ts-ignore
            message: error.toString(),
          },
        })
      }
      return
    }
    send({
      jsonrpc: JSON_RPC_VERSION,
      result,
      id: object.id,
    })
  } else {
    if (!object.params) {
      console.warn('invalid message', typeof object, object.params, object)
      return
    }
    Command.execute(object.method, state.socket, ...object.params)
  }
}

const handleError = (error) => {
  console.log('EEERRR')
  // console.error(error)
  throw new VError(error, 'Shared Process Socket Error')

  // console.error('[Shared Process: Socket Error]', event)
}

// TODO
const createAbstractSocket = (socket) => {
  return {
    _socket: socket,
    send(message) {
      socket.send(JSON.stringify(message))
    },
    on(event, listener) {
      switch (event) {
        case 'message':
          socket.on('message', listener)
          break
        case 'close':
          socket.on('close', listener)
          break
        default:
          console.warn('socket event not implemented', event, listener)
          break
      }
    },
  }
}

export const set = (socket) => {
  socket.on('close', () => {
    console.log('[shared-process] socket closed')
  })
  socket.onmessage = handleMessage
  // socket.onerror = handleError
  socket.on('error', handleError)
  const abstractSocket = createAbstractSocket(socket)
  state.socket = abstractSocket
}
