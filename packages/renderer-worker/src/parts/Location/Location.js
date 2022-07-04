import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const getPathName = () => {
  return RendererProcess.invoke(
    /* Location.getPathName */ 'Location.getPathName'
  )
}

export const setPathName = (pathName) => {
  return RendererProcess.invoke(
    /* Location.setPathName */ 'Location.setPathName',
    /* pathName */ pathName
  )
}

export const hydrate = () => {
  return RendererProcess.invoke(/* Location.hydrate */ 'Location.hydrate')
}
