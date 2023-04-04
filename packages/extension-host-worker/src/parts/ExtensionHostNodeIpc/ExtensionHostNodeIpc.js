import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as Assert from '../Assert/Assert.js'

export const createNodeIpc = async ({ path }) => {
  Assert.string(path)
  const ipc = await IpcParent.create({
    method: IpcParentType.ElectronMessagePort,
    type: `custom:${path}`,
  })
  console.log({ ipc })
  return ipc
}
