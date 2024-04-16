import * as SharedProcess from '../SharedProcess/SharedProcess.ts'

export const createWebContentsView = async (restoreId, fallThroughKeyBindings) => {
  const id = await SharedProcess.invoke('ElectronWebContentsView.createWebContentsView', restoreId, fallThroughKeyBindings)
  console.log({ id })
  return id
}

export const disposeWebContentsView = (id) => {
  return SharedProcess.invoke('ElectronWebContentsView.disposeWebContentsView', id)
}
