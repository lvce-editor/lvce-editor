import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const create = async (options) => {
  // TODO how to launch process without race condition?
  // when promise resolves, process might have already exited
  const messagePort = await ParentIpc.invoke('IpcParent.create', { ...options })
  return messagePort
}

export const wrap = (messagePort) => {
  return {}
}
