import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const create = async () => {
  const isElectron = navigator.userAgent.includes('Electron')
  console.log({ isElectron })
  if (isElectron) {
    return IpcParent.create({
      method: IpcParentType.ElectronMessagePort,
      protocol: ['lvce.extension-host-helper-process'],
    })
  }
  return IpcParent.create({
    method: IpcParentType.WebSocket,
    protocol: ['lvce.extension-host-helper-process'],
  })
}
