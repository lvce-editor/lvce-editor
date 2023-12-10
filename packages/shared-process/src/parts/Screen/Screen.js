import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const getWidth = () => {
  return ParentIpc.invoke('Screen.getWidth')
}

export const getHeight = () => {
  return ParentIpc.invoke('Screen.getHeight')
}

export const getBounds = () => {
  return ParentIpc.invoke('Screen.getBounds')
}
