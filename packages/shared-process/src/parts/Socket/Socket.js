import VError from 'verror'
import * as Command from '../Command/Command.js'
import * as GetResponse from '../GetResponse/GetResponse.js'

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
    const response = await GetResponse.getResponse(object, state.socket)
    send(response)
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
