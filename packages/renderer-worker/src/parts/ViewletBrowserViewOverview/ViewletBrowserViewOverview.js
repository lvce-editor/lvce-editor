import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

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
  const browserViewMap = await ElectronProcess.invoke('ElectronBrowserView.getAll')
  console.log({ browserViewMap })
  return {
    ...state,
    browserViewMap,
  }
}
