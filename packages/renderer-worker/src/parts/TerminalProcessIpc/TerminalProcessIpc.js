import * as IpcParent from '../IpcParent/IpcParent.js'

export const listen = (method) => {
  return IpcParent.create({
    method,
    type: 'terminal-process',
    name: 'Terminal Process',
    protocol: 'lvce.terminal-process',
  })
}
