import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const getPathName = () => {
  return RendererProcess.invoke(/* Location.getPathName */ 5611)
}

export const setPathName = (pathName) => {
  return RendererProcess.invoke(
    /* Location.setPathName */ 5612,
    /* pathName */ pathName
  )
}

export const hydrate = () => {
  return RendererProcess.invoke(/* Location.hydrate */ 5613)
}
