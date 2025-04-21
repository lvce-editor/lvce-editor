import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const create = (id, uri, x, y, width, height) => {
  return {
    browserViewMap: {},
    x,
    y,
    width,
    height,
  }
}

export const loadContent = async (state) => {
  const browserViewMap = await SharedProcess.invoke('ElectronBrowserView.getAll')
  return {
    ...state,
    browserViewMap,
  }
}
