import { createServer } from 'node:http'

/** @type {{ server: import('node:http').Server | undefined, portPromise: Promise<number> | undefined }} */
const state = {
  server: undefined,
  portPromise: undefined,
}

const handleRequest = (request, response) => {
  response.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8',
  })
  response.end('Authentication completed. You can close this window.')
}

const listen = (server) => {
  return new Promise((resolve, reject) => {
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
  })
}

export const create = async () => {
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
    throw error
  }
}

export const dispose = async () => {
  if (!state.server) {
    state.portPromise = undefined
    return
  }
  const { server } = state
  state.server = undefined
  state.portPromise = undefined
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error)
        return
      }
      resolve(undefined)
    })
  })
}
