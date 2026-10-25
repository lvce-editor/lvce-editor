import * as Assert from '../Assert/Assert.ts'
import * as Character from '../Character/Character.js'
import * as Command from '../Command/Command.js'
import * as ExtensionHostCommands from '../ExtensionHost/ExtensionHostCommands.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as FileSystemProtocol from '../FileSystemProtocol/FileSystemProtocol.js'
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
import * as TerminalWorker from '../TerminalWorker/TerminalWorker.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as WindowTitle from '../WindowTitle/WindowTitle.js'
import * as WorkspaceConnection from '../WorkspaceConnection/WorkspaceConnection.js'
import { state } from '../WorkspaceState/WorkspaceState.js'

const pathSeparator = '/'
const workspaceProgressDelay = 300

let workspaceChangeId = 0
let nextWorkspaceProgressId = 0
let currentWorkspaceProgress
const cancelledWorkspaceProgressIds = new Set()

const clearWorkspaceProgressTimer = () => {
  if (currentWorkspaceProgress?.timer) {
    clearTimeout(currentWorkspaceProgress.timer)
  }
}

const emitWorkspaceProgress = (id, message) => {
  void GlobalEventBus.emitEvent('workspace.progress', { id, message }).catch(() => {})
}

export const startProgress = (message) => {
  clearWorkspaceProgressTimer()
  if (currentWorkspaceProgress) {
    cancelledWorkspaceProgressIds.add(currentWorkspaceProgress.id)
  }
  if (currentWorkspaceProgress?.visible) {
    emitWorkspaceProgress(currentWorkspaceProgress.id, '')
  }
  const id = ++nextWorkspaceProgressId
  const progress = {
    initialMessage: message,
    id,
    message,
    timer: setTimeout(() => {
      if (currentWorkspaceProgress !== progress) {
        return
      }
      progress.visible = true
      emitWorkspaceProgress(progress.id, progress.message)
    }, workspaceProgressDelay),
    visible: false,
  }
  currentWorkspaceProgress = progress
  return id
}

export const endProgress = (id) => {
  cancelledWorkspaceProgressIds.delete(id)
  if (!currentWorkspaceProgress || currentWorkspaceProgress.id !== id) {
    return
  }
  const wasVisible = currentWorkspaceProgress.visible
  clearWorkspaceProgressTimer()
  currentWorkspaceProgress = undefined
  if (wasVisible) {
    emitWorkspaceProgress(id, '')
  }
}

export const updateProgress = (id, message) => {
  if (!currentWorkspaceProgress || currentWorkspaceProgress.id !== id) {
    return
  }
  currentWorkspaceProgress.message = message
  if (currentWorkspaceProgress.visible) {
    emitWorkspaceProgress(id, message)
  }
}

export const handleExtensionProgressChange = (id, data) => {
  const progress = currentWorkspaceProgress
  if (!progress || progress.id !== id || !data || typeof data.message !== 'string') return
  if (!['idle', 'in-progress', 'finished', 'error'].includes(data.status)) return
  const message = data.status === 'idle' || !data.message ? progress.initialMessage : data.message
  updateProgress(progress.id, data.status === 'error' ? `Error: ${message}` : message)
}

export const cancelProgress = (id) => {
  if (!currentWorkspaceProgress || currentWorkspaceProgress.id !== id) {
    return
  }
  cancelledWorkspaceProgressIds.add(id)
  const wasVisible = currentWorkspaceProgress.visible
  clearWorkspaceProgressTimer()
  currentWorkspaceProgress = undefined
  if (wasVisible) {
    emitWorkspaceProgress(id, '')
  }
}

export const isProgressCancelled = (id) => {
  return cancelledWorkspaceProgressIds.has(id)
}

const toWorkspaceUri = (path) => {
  if (!path || path.startsWith('file://') || GetProtocol.getProtocol(path) !== FileSystemProtocol.Disk) {
    return path
  }
  return PathToFileUri.pathToFileUri(path)
}

const fileUriToPath = (uri) => {
  const url = new URL(uri)
  const path = decodeURIComponent(url.pathname)
  if (url.hostname) {
    return `//${url.hostname}${path}`
  }
  return /^\/[A-Za-z]:\//.test(path) ? path.slice(1) : path
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

const canChangeWorkspace = async () => {
  if (!ViewletStates.getInstance('Main') || !(await Command.execute('Main.hasDirtyTabs'))) {
    return true
  }
  await Command.execute('Main.closeAllEditorsAndSave')
  return !(await Command.execute('Main.hasDirtyTabs'))
}

/**
 * @param {string|undefined} path
 */
export const setPath = async (path) => {
  Assert.string(path)
  if (GetProtocol.getProtocol(path) === 'remote-ssh') {
    await setUri(path)
    return
  }
  const changeId = ++workspaceChangeId
  await validateLocalPath(path)
  if (changeId !== workspaceChangeId) return
  const workspaceChanged = path !== state.workspacePath
  if (workspaceChanged && !(await canChangeWorkspace())) return
  if (changeId !== workspaceChangeId) return
  await updateWindowTitle(path, pathSeparator)
  if (workspaceChanged) {
    await GlobalEventBus.emitEvent('workspace.beforeChange', state.workspacePath, path)
  }
  if (changeId !== workspaceChangeId) return
  // @ts-ignore
  state.workspacePath = path
  // @ts-ignore
  state.workspaceUri = toWorkspaceUri(path)
  state.pathSeparator = pathSeparator
  if (workspaceChanged) {
    await WorkspaceConnection.dispose()
    RemoteCli.stop()
    await TerminalWorker.resetWorkspaceConnection()
  }
  await onWorkspaceChange()
}

export const setUri = async (uri, connectionOrPathSeparator, legacyConnection, openUri = '') => {
  let connection = legacyConnection || (typeof connectionOrPathSeparator === 'object' ? connectionOrPathSeparator : undefined)
  const changeId = ++workspaceChangeId
  const protocol = GetProtocol.getProtocol(uri)
  const prepareRemoteConnection = protocol === 'remote-server' && !connection
  if (prepareRemoteConnection) {
    connection = await ExtensionHostCommands.executeCommand('remote-server.prepareWorkspace', uri)
    if (!connection || changeId !== workspaceChangeId) return false
  }
  if (protocol === 'remote-ssh' && !connection) {
    const prepared = await ExtensionHostCommands.executeCommand('remote-ssh.prepareWorkspace', uri)
    if (prepared !== true || changeId !== workspaceChangeId) return false
  }
  const path = connection?.workspacePath || (protocol === 'file' ? fileUriToPath(uri) : uri)
  if (
    prepareRemoteConnection &&
    uri === state.workspaceUri &&
    path === state.workspacePath &&
    WorkspaceConnection.getCommand() === connection.command
  ) {
    if (openUri) await Command.execute('Main.openUri', openUri)
    return true
  }
  if (protocol === 'file' && !connection) {
    await validateLocalPath(path)
  }
  if (changeId !== workspaceChangeId) return false
  if (path !== state.workspacePath && !(await canChangeWorkspace())) return false
  if (changeId !== workspaceChangeId) return false
  await updateWindowTitle(path, pathSeparator)
  if (changeId !== workspaceChangeId) return false
  if (Platform.getPlatform() === PlatformType.Electron) {
    await Location.setWorkspaceUri(uri)
  }
  if (path !== state.workspacePath) {
    await GlobalEventBus.emitEvent('workspace.beforeChange', state.workspacePath, path)
  }
  if (changeId !== workspaceChangeId) return false
  if (state.workspaceUri !== uri) await WorkspaceConnection.dispose()
  if (changeId !== workspaceChangeId) return false
  state.workspacePath = path
  state.workspaceUri = uri
  state.pathSeparator = pathSeparator
  if (connection) {
    WorkspaceConnection.set(
      uri,
      connection.command,
      connection.remoteCliUrl,
      connection.webSocketUrl,
      connection.terminalSpawnOptions,
      connection.disposeCommand,
    )
    if (connection.remoteCliUrl) {
      void RemoteCli.start(connection.remoteCliUrl, connection.remoteCliUrl, handleRemoteCliOpenRequest).catch(() => {})
    } else {
      RemoteCli.stop()
    }
  } else {
    WorkspaceConnection.reset()
    RemoteCli.stop()
  }
  await TerminalWorker.resetWorkspaceConnection()
  await onWorkspaceChange()
  if (openUri) {
    await Command.execute('Main.openUri', openUri)
  }
  return true
}

const handleRemoteCliOpenRequest = async (request) => {
  const currentUri = state.workspaceUri
  const command = WorkspaceConnection.getCommand()
  const remoteCliUrl = WorkspaceConnection.getRemoteCliUrl()
  const webSocketUrl = WorkspaceConnection.getWebSocketUrlTemplate()
  const terminalSpawnOptions = WorkspaceConnection.getTerminalSpawnOptions()
  if (!currentUri || !command) {
    throw new Error('Remote workspace connection is not available')
  }
  const resolved = RemoteCli.resolveOpenRequest(currentUri, request)
  await setUri(resolved.workspaceUri, {
    command,
    remoteCliUrl,
    webSocketUrl,
    terminalSpawnOptions,
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
  const { workspacePath, workspaceUri } = state
  if (Platform.getPlatform() === PlatformType.Web || Platform.getPlatform() === PlatformType.Remote) {
    const pathName = getPathName(workspacePath)
    await Location.setPathName(pathName)
    if (Platform.getPlatform() === PlatformType.Web) await Location.setRemoteWorkspaceUri(workspaceUri)
  }
  await GlobalEventBus.emitEvent('workspace.change', workspacePath)
}

export const hydrate = async ({ href, workspaceUri = '' }) => {
  if (state.workspacePath) {
    return
  }
  const resolvedRoot = await GetResolvedRoot.getResolvedRoot(href, workspaceUri)
  if (state.isTest) {
    state.homeDir = resolvedRoot.homeDir
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
  const hydrationChangeId = workspaceChangeId
  const hydrationUri = state.workspaceUri
  if (hydrationUri?.startsWith('remote-server://')) {
    try {
      const connection = await ExtensionHostCommands.executeCommand('remote-server.prepareWorkspace', hydrationUri, false)
      if (hydrationChangeId !== workspaceChangeId || state.workspaceUri !== hydrationUri) return
      if (connection) {
        state.workspacePath = connection.workspacePath
        WorkspaceConnection.set(
          state.workspaceUri,
          connection.command,
          connection.remoteCliUrl,
          connection.webSocketUrl,
          connection.terminalSpawnOptions,
          connection.disposeCommand,
        )
      }
    } catch {
      if (hydrationChangeId !== workspaceChangeId || state.workspaceUri !== hydrationUri) return
      await Notification.create('warning', 'The remote session could not be restored. Connect with a fresh pairing URL.')
    }
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
