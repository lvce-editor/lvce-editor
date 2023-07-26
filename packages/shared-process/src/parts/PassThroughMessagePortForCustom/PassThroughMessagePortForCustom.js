import * as Assert from '../Assert/Assert.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

const getPath = (data) => {
  Assert.string(data)
  return data.slice('custom:'.length)
}

/**
 *
 * @returns
 */
export const handlePort = async (browserWindowPort, ...params) => {
  if (!browserWindowPort) {
    throw new Error(`browserWindowPort must be passed`)
  }
  const data = params[0]
  const path = getPath(data)
  const childProcess = await IpcParent.create({
    method: IpcParentType.ElectronUtilityProcess,
    path,
    argv: ['--ipc-type=electron-utility-process-message-port'],
  })
  console.log('created utility process')
  return browserWindowPort
}
