const Assert = require('../Assert/Assert.js')
const IpcParent = require('../IpcParent/IpcParent.js')
const IpcParentType = require('../IpcParentType/IpcParentType.js')

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
  const childProcess = await IpcParent.create({
    method: IpcParentType.ElectronUtilityProcess,
    path,
    argv: [],
  })
  console.log('created utility process')
  childProcess.postMessage({}, [browserWindowPort])
}
