import * as Workspace from '../Workspace/Workspace.js'

export const getTitle = (uri) => {
  const homeDir = Workspace.getHomeDir()
  // TODO tree shake this out in web
  if (homeDir && uri.startsWith(homeDir)) {
    return `~${uri.slice(homeDir.length)}`
  }
  return uri
}

export const getLabel = (uri) => {
  return Workspace.pathBaseName(uri)
}
