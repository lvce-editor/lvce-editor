import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

const getTsPath = () => {
  return ``
}

export const createNodeIpc = async () => {
  const tsPath = getTsPath()
  const ipc = await IpcParent.create({
    method: IpcParentType.ElectronMessagePort,
    type: `custom:${tsPath}`,
  })
  console.log({ ipc })
  return ipc
}
