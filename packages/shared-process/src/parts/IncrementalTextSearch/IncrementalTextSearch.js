import * as RipGrep from '../RipGrep/RipGrep.js'
import * as EncodingType from '../EncodingType/EncodingType.js'

const maxResults = 800

const connectProcess = (ipc, id, childProcess, cleanup) => {
  let count = 0
  childProcess.stdout.setEncoding(EncodingType.Utf8)
  childProcess.stdout.on('data', (data) => {
    count++
    if (count > maxResults) {
      cleanup()
      return
    }
    // console.log({ data: data.toString() })
    ipc.send({
      jsonrpc: '2.0',
      method: 'IncrementalTextSearch.handleData',
      params: [id, data.toString()],
    })
    // emitter.dispatchEvent(new Event('data', x))
  })

  childProcess.on('exit', () => {
    ipc.send({
      jsonrpc: '2.0',
      method: 'IncrementalTextSearch.handleExit',
      params: [id],
    })
    // emitter.dispatchEvent(new Event('exit'))
  })
  childProcess.on('error', () => {
    ipc.send({
      jsonrpc: '2.0',
      method: 'IncrementalTextSearch.handleError',
      params: [id],
    })
    // emitter.dispatchEvent(new Event('error'))
  })
}

const state = {
  searches: Object.create(null),
}

export const start = async (ipc, id, { searchDir = '', maxSearchResults = 20_000, ripGrepArgs = [] } = {}) => {
  console.log({ ipc })
  const childProcess = RipGrep.spawn(ripGrepArgs, {
    cwd: searchDir,
  })
  console.log('start', { searchDir, ripGrepArgs, id })
  const dispose = () => {
    delete state.searches[id]
    childProcess.kill()
  }
  connectProcess(ipc, id, childProcess, dispose)
  state.searches[id] = {
    dispose,
  }
}

export const cancel = (id) => {
  const search = state.searches[id]
  if (!search) {
    return
  }
  search.dispose()
}
