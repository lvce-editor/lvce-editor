import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const getPathName = () => {
  return location.pathname
}

export const getHref = () => {
  return location.href
}

// TODO should do nothing if it is already at this path
export const setPathName = (pathName) => {
  const currentPathName = getPathName()
  if (currentPathName === pathName) {
    return
  }
  history.pushState(null, null, pathName)
}

const handlePopState = (event) => {
  RendererWorker.send(/* Workspace.hydrate */ 'Workspace.hydrate')
}

export const hydrate = () => {
  addEventListener('popstate', handlePopState)
}
