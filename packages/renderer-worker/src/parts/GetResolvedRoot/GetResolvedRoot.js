import * as Command from '../Command/Command.js'
import * as PathSeparatorType from '../PathSeparatorType/PathSeparatorType.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as SharedProcessCommandType from '../SharedProcessCommandType/SharedProcessCommandType.js'
import { state } from '../IsTest/IsTest.js'

const getResolvedRootFromSharedProcess = async () => {
  const resolvedRoot = await SharedProcess.invoke(/* Workspace.resolveRoot */ SharedProcessCommandType.WorkspaceResolveRoot)
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
  const resolvedRoot = await Command.execute(/* SessionStorage.getJson */ 'SessionStorage.getJson', /* key */ 'workspace')
  if (!isValid(resolvedRoot)) {
    return undefined
  }
  return resolvedRoot
}

const getResolvedRootFromRendererProcess = async (href) => {
  const url = new URL(href)
  if (href.includes('tests/')) {
    state.isTest = true
    return {
      path: href,
      homeDir: '',
      pathSeparator: PathSeparatorType.Slash,
      source: 'test',
    }
  }
  if (url.pathname.startsWith('/github')) {
    const path = `github://${url.pathname.slice('/github'.length + 1)}`
    return {
      path,
      homeDir: '',
      pathSeparator: PathSeparatorType.Slash,
      source: 'renderer-process',
    }
  }

  if (Platform.getPlatform() === PlatformType.Web) {
    const defaultWorkspace = Preferences.get('workspace.defaultWorkspace')
    const resolvedRoot = {
      path: defaultWorkspace,
      homeDir: '',
      pathSeparator: PathSeparatorType.Slash,
      source: 'renderer-process',
    }
    return resolvedRoot
  }
  const resolvedRootFromSessionStorage = await getResolveRootFromSessionStorage()
  if (resolvedRootFromSessionStorage) {
    return resolvedRootFromSessionStorage
  }

  return undefined
}

const getResolvedRootRemote = async (href) => {
  const resolvedRootFromRendererProcess = await getResolvedRootFromRendererProcess(href)
  if (resolvedRootFromRendererProcess) {
    return resolvedRootFromRendererProcess
  }
  return getResolvedRootFromSharedProcess()
}

export const getResolvedRoot = async (href) => {
  switch (Platform.getPlatform()) {
    case PlatformType.Web:
      return getResolvedRootFromRendererProcess(href)
    default:
      return getResolvedRootRemote(href)
  }
}
