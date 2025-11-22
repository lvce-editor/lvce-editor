import * as Assert from '../Assert/Assert.ts'
import * as Character from '../Character/Character.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as GetResolvedRoot from '../GetResolvedRoot/GetResolvedRoot.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as Location from '../Location/Location.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as WindowTitle from '../WindowTitle/WindowTitle.js'
import { state } from '../WorkspaceState/WorkspaceState.js'

/**
 * @param {string|undefined} path
 */
export const setPath = async (path) => {
  Assert.string(path)
  // TODO not in electron
  const pathSeparator = await FileSystem.getPathSeparator(path)
  // @ts-ignore
  state.workspacePath = path
  // @ts-ignore
  state.workspaceUri = path
  state.pathSeparator = pathSeparator
  await onWorkspaceChange()
}

export const setUri = async (uri) => {
  const path = uri.slice('file://'.length)
  state.workspacePath = path
  state.workspaceUri = uri
  await onWorkspaceChange()
}

export const getPath = () => {
  return state.workspacePath
}

export const getUri = () => {
  return state.workspaceUri
}

export const close = () => {
  return setPath('')
}

export { isTest } from '../IsTest/IsTest.js'

const getTitle = (workspacePath) => {
  if (!workspacePath) {
    return ''
  }
  const pathSeparator = state.pathSeparator
  return workspacePath.slice(workspacePath.lastIndexOf(pathSeparator) + 1)
}

const getPathName = (workspacePath) => {
  if (!workspacePath) {
    return ''
  }
  if (workspacePath.startsWith('github://')) {
    return '/github/' + workspacePath.slice('github://'.length)
  }
  return ''
}

const onWorkspaceChange = async () => {
  const title = getTitle(state.workspacePath)
  await WindowTitle.set(title)
  if (Platform.platform === PlatformType.Web || Platform.platform === PlatformType.Remote) {
    const pathName = getPathName(state.workspacePath)
    await Location.setPathName(pathName)
  }
  await GlobalEventBus.emitEvent('workspace.change', state.workspacePath)
}

export const hydrate = async ({ href }) => {
  if (state.workspacePath) {
    return
  }
  const resolvedRoot = await GetResolvedRoot.getResolvedRoot(href)
  if (state.isTest) {
    return
  }
  if (state.workspacePath) {
    return
  }
  // TODO why is this if statement here?
  if (state.homeDir !== resolvedRoot.homeDir) {
    state.homeDir = resolvedRoot.homeDir
  }
  if (!FileSystem.canBeRestored(resolvedRoot.path)) {
    return
  }
  // TODO how to check that path from renderer process is valid?
  // TODO also need to check whether it is a folder or file
  state.workspacePath = resolvedRoot.path
  state.homeDir = resolvedRoot.homeDir
  state.pathSeparator = resolvedRoot.pathSeparator
  state.workspaceUri = resolvedRoot.uri
  state.source = resolvedRoot.source

  if (state.workspaceUri && state.workspaceUri.startsWith('/')) {
    state.workspaceUri = `file://${state.workspaceUri}`
  }
  await onWorkspaceChange()
}

/**
 * @deprecated use getWorkspaceUri instead
 * @returns
 */
export const getWorkspacePath = () => {
  return state.workspacePath
}

export const getWorkspaceUri = () => {
  return state.workspaceUri
}

export const getHomeDir = () => {
  return state.homeDir
}

// TODO this should be in FileSystem module
export const pathBaseName = (path) => {
  if (!path) {
    return ''
  }
  return path.slice(path.lastIndexOf('/') + 1)
}

export const pathRelative = (path) => {
  if (path.startsWith(state.workspacePath)) {
    return path.slice(state.workspacePath.length + 1, path.lastIndexOf('/'))
  }
  return path
}

// TODO this should be in FileSystem module
export const pathDirName = (path) => {
  const pathSeparator = state.pathSeparator || '/'
  const index = path.lastIndexOf(pathSeparator)
  if (index === -1) {
    return Character.EmptyString
  }
  return path.slice(0, index)
}

export const getAbsolutePath = (relativePath) => {
  if (relativePath.startsWith('./')) {
    return `${state.workspacePath}/${relativePath.slice(2)}` // TODO support windows paths
  }
  return `${state.workspacePath}/${relativePath}` // TODO support windows paths
}

export { state }
