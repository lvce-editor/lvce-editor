import { createServer } from 'node:http'
import * as Assert from '../Assert/Assert.js'

/** @type {Record<string, { server: import('node:http').Server | undefined, portPromise: Promise<number> | undefined }>} */
const states = Object.create(null)

const getOrCreateState = (id) => {
  if (!states[id]) {
    states[id] = {
      server: undefined,
      portPromise: undefined,
    }
  }
  return states[id]
}

const handleRequest = (request, response) => {
  response.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8',
  })
  response.end('Authentication completed. You can close this window.')
}

const listen = (server) => {
  const { promise, resolve, reject } = Promise.withResolvers()

  const onError = (error) => {
    server.off('listening', onListening)
    reject(error)
  }

  const onListening = () => {
    server.off('error', onError)
    const address = server.address()
    if (!address || typeof address === 'string') {
      reject(new Error('failed to determine oauth server port'))
      return
    }
    resolve(address.port)
  }

  server.once('error', onError)
  server.once('listening', onListening)
  server.listen(0, 'localhost')
  return promise
}

export const create = async (id) => {
  Assert.string(id)
  const state = getOrCreateState(id)
  if (state.portPromise) {
    return state.portPromise
  }
  const server = createServer(handleRequest)
  state.server = server
  state.portPromise = listen(server)
  try {
    return await state.portPromise
  } catch (error) {
    state.server = undefined
    state.portPromise = undefined
    delete states[id]
    throw error
  }
}

export const dispose = async (id) => {
  Assert.string(id)
  const state = getOrCreateState(id)
  if (!state.server) {
    delete states[id]
    return
  }
  const { server } = state
  state.server = undefined
  state.portPromise = undefined
  const { promise, resolve, reject } = Promise.withResolvers()
  server.close((error) => {
    if (error) {
      reject(error)
      return
    }
    resolve(undefined)
  })
  await promise
  delete states[id]
}
