const { utilityProcess } = require('electron')
const Assert = require('../Assert/Assert.js')

const getPath = (data) => {
  Assert.string(data)
  return data.slice('custom:'.length)
}

/**
 *
 * @param {import('electron').IpcMainEvent} event
 * @returns
 */
exports.handlePort = async (event, data) => {
  const browserWindowPort = event.ports[0]
  if (!browserWindowPort) {
    throw new Error(`browserWindowPort must be passed`)
  }
  const path = getPath(data)
  const p = utilityProcess.fork(path, [], { stdio: 'pipe' })
  // p.postMessage('hello')
  p.postMessage({}, [browserWindowPort])
  p.on('spawn', () => {
    console.log('process spawned')
  })
  // @ts-ignore
  p.stdout.pipe(process.stdout)
  // @ts-ignore
  p.stderr.pipe(process.stderr)
}
