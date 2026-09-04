import * as Assert from '../Assert/Assert.ts'
import * as Character from '../Character/Character.js'
import * as Command from '../Command/Command.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as FileSystemProtocol from '../FileSystemProtocol/FileSystemProtocol.js'
import * as FileSystemWorker from '../FileSystemWorker/FileSystemWorker.js'
import * as GetResolvedRoot from '../GetResolvedRoot/GetResolvedRoot.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as GetProtocol from '../GetProtocol/GetProtocol.js'
import * as IsTest from '../IsTest/IsTest.js'
import * as Location from '../Location/Location.js'
import * as Notification from '../Notification/Notification.js'
import * as PathToFileUri from '../PathToFileUri/PathToFileUri.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Product from '../Product/Product.js'
import * as RemoteCli from '../RemoteCli/RemoteCli.js'
import * as StatusBarWorker from '../StatusBarWorker/StatusBarWorker.js'
import * as WindowTitle from '../WindowTitle/WindowTitle.js'
import * as WorkspaceConnection from '../WorkspaceConnection/WorkspaceConnection.js'
import { state } from '../WorkspaceState/WorkspaceState.js'

const pathSeparator = '/'

const toWorkspaceUri = (path) => {
  if (!path || path.startsWith('file://') || GetProtocol.getProtocol(path) !== FileSystemProtocol.Disk) {
    return path
  }
  return PathToFileUri.pathToFileUri(path)
}

const validateLocalPath = async (path) => {
  if (IsTest.isTest()) {
    return
  }
  if (path && !(await FileSystem.exists(path))) {
    const message = `Workspace folder does not exist: '${path}'`
    await Notification.create('error', message)
    throw new Error(message)
  }
}

/**
 * @param {string|undefined} path
 */
export const setPath = async (path) => {
  Assert.string(path)
  await validateLocalPath(path)
  await updateWindowTitle(path, pathSeparator)
  const workspaceChanged = path !== state.workspacePath
  if (workspaceChanged) {
    await GlobalEventBus.emitEvent('workspace.beforeChange', state.workspacePath, path)
  }
  // @ts-ignore
  state.workspacePath = path
  // @ts-ignore
  state.workspaceUri = toWorkspaceUri(path)
  state.pathSeparator = pathSeparator
  if (workspaceChanged) {
    WorkspaceConnection.reset()
    RemoteCli.stop()
    await FileSystemWorker.dispose()
  }
  await onWorkspaceChange()
}

export const setUri = async (uri, connectionOrPathSeparator, legacyConnection) => {
  const connection = legacyConnection || (typeof connectionOrPathSeparator === 'object' ? connectionOrPathSeparator : undefined)
  const protocol = GetProtocol.getProtocol(uri)
  const path = connection?.workspacePath || (protocol === 'file' ? decodeURIComponent(uri.slice('file://'.length)) : uri)
  if (protocol === 'file' && !connection) {
    await validateLocalPath(path)
  }
  await updateWindowTitle(path, pathSeparator)
  if (Platform.getPlatform() === PlatformType.Electron) {
    await Location.setWorkspaceUri(uri)
  }
  if (path !== state.workspacePath) {
    await GlobalEventBus.emitEvent('workspace.beforeChange', state.workspacePath, path)
  }
  state.workspacePath = path
  state.workspaceUri = uri
  state.pathSeparator = pathSeparator
  if (connection) {
    WorkspaceConnection.set(uri, connection.command, connection.remoteCliUrl, connection.webSocketUrl)
    if (connection.remoteCliUrl) {
      void RemoteCli.start(connection.remoteCliUrl, connection.remoteCliUrl, handleRemoteCliOpenRequest).catch(() => {})
    } else {
      RemoteCli.stop()
    }
  } else {
    WorkspaceConnection.reset()
    RemoteCli.stop()
  }
  await FileSystemWorker.dispose()
  await onWorkspaceChange()
}

const handleRemoteCliOpenRequest = async (request) => {
  const currentUri = state.workspaceUri
  const command = WorkspaceConnection.getCommand()
  const remoteCliUrl = WorkspaceConnection.getRemoteCliUrl()
  const webSocketUrl = WorkspaceConnection.getWebSocketUrlTemplate()
  if (!currentUri || !command) {
    throw new Error('Remote workspace connection is not available')
  }
  const resolved = RemoteCli.resolveOpenRequest(currentUri, request)
  await setUri(resolved.workspaceUri, {
    command,
    remoteCliUrl,
    webSocketUrl,
    workspacePath: resolved.workspacePath,
  })
  if (resolved.fileUri) {
    await Command.execute('Main.openUri', resolved.fileUri)
  }
}

export const getPath = () => {
  return state.workspacePath
}

export const getUri = () => {
  return state.workspaceUri
}

export const supportsConnectionCommand = () => true

export const close = async () => {
  await Command.execute('Main.closeAllEditorsAndSave')
  const hasDirtyTabs = await Command.execute('Main.hasDirtyTabs')
  if (hasDirtyTabs) {
    return
  }
  await setPath('')
  await StatusBarWorker.invoke('StatusBar.handleEditorStatusChanged', undefined)
}

export { isTest } from '../IsTest/IsTest.js'

const getTitle = (workspacePath, pathSeparator) => {
  if (!workspacePath) {
    return Product.getProductNameLong()
  }
  return workspacePath.slice(workspacePath.lastIndexOf(pathSeparator) + 1)
}

const updateWindowTitle = async (workspacePath, pathSeparator) => {
  const title = getTitle(workspacePath, pathSeparator)
  await WindowTitle.set(title)
  await GlobalEventBus.emitEvent('workspace.titleChange', workspacePath)
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
  if (Platform.getPlatform() === PlatformType.Web || Platform.getPlatform() === PlatformType.Remote) {
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
  state.pathSeparator = pathSeparator
  state.workspaceUri = resolvedRoot.uri
  state.source = resolvedRoot.source

  if (state.workspaceUri && state.workspaceUri.startsWith('/')) {
    state.workspaceUri = `file://${state.workspaceUri}`
  }
  await updateWindowTitle(state.workspacePath, state.pathSeparator)
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
