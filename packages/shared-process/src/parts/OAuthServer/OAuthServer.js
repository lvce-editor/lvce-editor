import { createServer } from 'node:http'
import * as Assert from '../Assert/Assert.js'

/** @type {Record<string, {
  server: import('node:http').Server | undefined,
  portPromise: Promise<number> | undefined,
  successHtml: string,
  errorHtml: string,
  codeQueue: string[],
  codePromise: Promise<string> | undefined,
  resolveCode: ((value: string) => void) | undefined,
  rejectCode: ((reason?: unknown) => void) | undefined,
}>} */
const states = Object.create(null)

const getOrCreateState = (id) => {
  if (!states[id]) {
    states[id] = {
      server: undefined,
      portPromise: undefined,
      successHtml: '',
      errorHtml: '',
      codeQueue: [],
      codePromise: undefined,
      resolveCode: undefined,
      rejectCode: undefined,
    }
  }
  return states[id]
}

const clearPendingCodePromise = (state) => {
  state.codePromise = undefined
  state.resolveCode = undefined
  state.rejectCode = undefined
}

const resolveCode = (state, code) => {
  if (state.resolveCode) {
    const { resolveCode } = state
    clearPendingCodePromise(state)
    resolveCode(code)
    return
  }
  state.codeQueue.push(code)
}

const rejectPendingCode = (state, error) => {
  if (!state.rejectCode) {
    return
  }
  const { rejectCode } = state
  clearPendingCodePromise(state)
  rejectCode(error)
}

const getCodeFromRequest = (request) => {
  if (!request.url) {
    return undefined
  }
  const url = new URL(request.url, 'http://localhost')
  const code = url.searchParams.get('code')
  return code || undefined
}

const handleRequest = (id, request, response) => {
  const state = states[id]
  let html = ''
  if (state) {
    const code = getCodeFromRequest(request)
    if (code) {
      resolveCode(state, code)
      html = state.successHtml
    } else {
      html = state.errorHtml
    }
  }
  response.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  response.end(html)
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

const getOrCreateCodePromise = (state) => {
  if (!state.codePromise) {
    const { promise, resolve, reject } = Promise.withResolvers()
    state.codePromise = promise
    state.resolveCode = resolve
    state.rejectCode = reject
  }
  return state.codePromise
}

export const create = async (id, successHtml, errorHtml) => {
  Assert.string(id)
  Assert.string(successHtml)
  Assert.string(errorHtml)
  const state = getOrCreateState(id)
  state.successHtml = successHtml
  state.errorHtml = errorHtml
  if (state.portPromise) {
    return state.portPromise
  }
  const server = createServer((request, response) => {
    handleRequest(id, request, response)
  })
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

export const getCode = async (id) => {
  Assert.string(id)
  const state = states[id]
  if (!state || !state.server) {
    throw new Error(`oauth server ${id} not found`)
  }
  if (state.codeQueue.length > 0) {
    return state.codeQueue.shift()
  }
  return getOrCreateCodePromise(state)
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
  state.codeQueue = []
  rejectPendingCode(state, new Error('oauth server disposed'))
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
