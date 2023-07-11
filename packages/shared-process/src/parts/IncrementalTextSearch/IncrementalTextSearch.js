import * as RipGrep from '../RipGrep/RipGrep.js'

const connectProcess = (ipc, id, childProcess) => {
  let count = 0
  const cleanup = () => {
    childProcess.kill()
  }
  childProcess.stdout.on('data', (data) => {
    count++
    if (count > 20) {
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

export const start = async (ipc, id, { searchDir = '', maxSearchResults = 20_000, ripGrepArgs = [] } = {}) => {
  console.log({ ipc })
  const emitter = new EventTarget()
  const childProcess = RipGrep.spawn(ripGrepArgs, {
    cwd: searchDir,
  })
  console.log('start', { searchDir, ripGrepArgs, id })
  connectProcess(ipc, id, childProcess)
}
