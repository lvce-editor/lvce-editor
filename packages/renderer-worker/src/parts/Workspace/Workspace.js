import * as Command from '../Command/Command.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as Location from '../Location/Location.js'
import * as Platform from '../Platform/Platform.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as Window from '../Window/Window.js'

export const state = {
  workspacePath: '',
  homeDir: '',
  pathSeparator: '',
  workspaceUri: '',
  source: '',
  href: '',
  isTest: false,
}

/**
 * @param {string|undefined} path
 */
export const setPath = async (path) => {
  console.log('[workspace] set path', path)
  // TODO not in electron
  state.workspacePath = path
  await onWorkspaceChange()
}

export const setUri = async (uri) => {
  const path = uri.slice('file://'.length)
  state.workspacePath = path
  state.workspaceUri = uri
  await onWorkspaceChange()
}

const getResolvedRootFromSharedProcess = async () => {
  const resolvedRoot = await SharedProcess.invoke(
    /* Workspace.resolveRoot */ 'Workspace.resolveRoot'
  )
  return resolvedRoot
}

const isValid = (resolvedRoot) => {
  return (
    resolvedRoot &&
    typeof resolvedRoot.path === 'string' &&
    typeof resolvedRoot.uri === 'string' &&
    typeof resolvedRoot.homeDir === 'string' &&
    typeof resolvedRoot.pathSeparator === 'string'
  )
}

const getResolveRootFromSessionStorage = async () => {
  const resolvedRoot = await Command.execute(
    /* SessionStorage.getJson */ 'SessionStorage.getJson',
    /* key */ 'workspace'
  )
  if (!isValid(resolvedRoot)) {
    return undefined
  }
  return resolvedRoot
}

export const isTest = () => {
  return state.isTest
}

const getResolvedRootFromRendererProcess = async (href) => {
  const url = new URL(href)
  if (url.searchParams.has('replayId')) {
    const replayId = url.searchParams.get('replayId')
    await Command.execute(
      'SessionReplay.replaySession',
      /* sessionId */ replayId
    )
    return undefined
  }
  if (href.includes('tests/')) {
    state.isTest = true
    return {
      path: href,
      homeDir: '',
      pathSeparator: '/',
      source: 'test',
    }
  }
  if (url.pathname.startsWith('/github')) {
    const path = `github://${url.pathname.slice('/github'.length + 1)}`
    return {
      path,
      homeDir: '',
      pathSeparator: '/',
      source: 'renderer-process',
    }
  }
  if (Platform.platform === 'web') {
    const resolvedRoot = {
      path: 'web:///workspace',
      homeDir: '',
      pathSeparator: '/',
      source: 'renderer-process',
    }
    return resolvedRoot
  }
  return undefined
}

const getResolvedRoot = async (href) => {
  if (Platform.platform === 'web') {
    return getResolvedRootFromRendererProcess(href)
  }
  if (Platform.platform === 'remote') {
    const resolvedRootFromRendererProcess =
      await getResolvedRootFromRendererProcess(href)
    if (resolvedRootFromRendererProcess) {
      return resolvedRootFromRendererProcess
    }
  }
  const resolvedRootFromSessionStorage =
    await getResolveRootFromSessionStorage()
  if (resolvedRootFromSessionStorage) {
    return resolvedRootFromSessionStorage
  }
  return getResolvedRootFromSharedProcess()
}

const getTitle = (workspacePath) => {
  const pathSeparator = state.pathSeparator
  return workspacePath.slice(workspacePath.lastIndexOf(pathSeparator) + 1)
}

const getPathName = (workspacePath) => {
  if (workspacePath.startsWith('github://')) {
    return '/github/' + workspacePath.slice('github://'.length)
  }
  return ''
}

const onWorkspaceChange = async () => {
  const title = getTitle(state.workspacePath)
  await Window.setTitle(title)
  if (Platform.platform === 'web' || Platform.platform === 'remote') {
    const pathName = getPathName(state.workspacePath)
    await Location.setPathName(pathName)
  }
  await GlobalEventBus.emitEvent('workspace.change', state.workspacePath)
}

export const hydrate = async ({ href }) => {
  if (state.workspacePath) {
    return
  }
  const resolvedRoot = await getResolvedRoot(href)
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
  // TODO how to check that path from renderer process is valid?
  // TODO also need to check whether it is a folder or file
  state.workspacePath = resolvedRoot.path
  state.homeDir = resolvedRoot.homeDir
  state.pathSeparator = resolvedRoot.pathSeparator
  state.workspaceUri = resolvedRoot.uri
  state.source = resolvedRoot.source
  console.log({ state })
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
  const pathSeparator = state.pathSeparator
  return path.slice(path.lastIndexOf(pathSeparator) + 1)
}

// TODO this should be in FileSystem module
export const pathDirName = (path) => {
  const pathSeparator = state.pathSeparator
  return path.slice(0, path.lastIndexOf(pathSeparator))
}

export const getAbsolutePath = (relativePath) => {
  if (relativePath.startsWith('./')) {
    return `${state.workspacePath}/${relativePath.slice(2)}` // TODO support windows paths
  }
  return `${state.workspacePath}/${relativePath}` // TODO support windows paths
}
