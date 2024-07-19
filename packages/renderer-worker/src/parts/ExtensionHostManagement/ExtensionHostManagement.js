import * as Assert from '../Assert/Assert.ts'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.js'
import * as ExtensionMeta from '../ExtensionMeta/ExtensionMeta.js'
import * as GetExtensionAbsolutePath from '../GetExtensionAbsolutePath/GetExtensionAbsolutePath.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as Origin from '../Origin/Origin.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as Workspace from '../Workspace/Workspace.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as ExtensionHostManagementBrowser from './ExtensionHostManagementBrowser.js'
import * as ExtensionHostManagementShared from './ExtensionHostManagementShared.js'

export const state = {
  /**
   * @type {readonly any[]}
   */
  extensionHosts: [],
  cachedActivationEvents: Object.create(null),
  /**
   * @type {any}
   */
  activatedExtensions: Object.create(null),
}

const getManagersWithExtensionsToActivate = (manager, extensions) => {
  const managersToActivate = []
  const toActivate = []
  for (const extension of extensions) {
    if (manager.canActivate(extension)) {
      toActivate.push(extension)
    }
  }
  if (toActivate.length > 0) {
    managersToActivate.push({ manager, toActivate })
  }
  return managersToActivate
}

const startSyncing = async (extensionHost) => {
  // TODO when extension host closes, remove event listeners
  if (extensionHost.ipc.isSyncing) {
    return
  }
  extensionHost.ipc.isSyncing = true
  const handleEditorCreate = (editor) => {
    const text = TextDocument.getText(editor)
    return extensionHost.ipc.invoke('ExtensionHostTextDocument.syncFull', editor.uri, editor.uid, editor.languageId, text)
  }
  GlobalEventBus.addListener('editor.create', handleEditorCreate)

  const handleEditorChange = (editor, changes) => {
    return extensionHost.ipc.invoke('ExtensionHostTextDocument.syncIncremental', editor.uid, changes)
  }
  GlobalEventBus.addListener('editor.change', handleEditorChange)

  const handleEditorLanguageChange = (editor) => {
    return extensionHost.ipc.invoke('ExtensionHostTextDocument.setLanguageId', editor.uid, editor.languageId)
  }

  GlobalEventBus.addListener('editor.languageChange', handleEditorLanguageChange)

  const handleWorkspaceChange = async (workspacePath) => {
    await extensionHost.ipc.invoke('Workspace.setWorkspacePath', workspacePath)
  }

  const handlePreferencesChange = () => {
    return extensionHost.ipc.invoke('Configuration.configurationChanged')
  }

  GlobalEventBus.addListener('workspace.change', handleWorkspaceChange, { prepend: true })
  GlobalEventBus.addListener('preferences.changed', handlePreferencesChange, { prepend: true })

  // @ts-ignore
  const instances = ViewletStates.getAllInstances()
  const editorInstance = ViewletStates.getInstance(ViewletModuleId.EditorText)
  if (editorInstance) {
    await handleEditorCreate(editorInstance.state)
  }
  // @ts-ignore
  await handleWorkspaceChange(Workspace.state.workspacePath, Workspace.isTest())
  extensionHost.ipc.invoke('ExtensionHostConfiguration.setConfiguration', Preferences.getAll())
}

const actuallyActivateExtension = async (extensionHost, extension) => {
  if (!(extension.id in state.activatedExtensions)) {
    const absolutePath = GetExtensionAbsolutePath.getExtensionAbsolutePath(
      extension.id,
      extension.isWeb,
      extension.builtin,
      extension.path,
      extension.browser,
      Origin.origin,
    )
    state.activatedExtensions[extension.id] = extensionHost.ipc.invoke(ExtensionHostCommandType.ExtensionActivate, extension, absolutePath)
  }
  return state.activatedExtensions[extension.id]
}

const actuallyActivateByEvent = async (event) => {
  // TODO should not query extensions multiple times
  const extensions = await ExtensionMeta.getExtensions()
  const { resolved, rejected } = ExtensionMeta.organizeExtensions(extensions)
  // TODO if many (more than two?) extensions cannot be loaded,
  // it shouldn't should that many error messages
  await ExtensionMeta.handleRejectedExtensions(rejected)
  const extensionsToActivate = ExtensionMeta.filterByMatchingEvent(resolved, event)
  // TODO how to handle when multiple reference providers are registered for nodejs and webworker extension host?
  // what happens when all of them / some of them throw error?
  // what happens when some of them take very long to activate?

  const extensionHostManagerTypes = ExtensionHostManagementBrowser
  const extensionHostsWithExtensions = getManagersWithExtensionsToActivate(extensionHostManagerTypes, extensionsToActivate)
  const extensionHosts = []
  for (const managerWithExtensions of extensionHostsWithExtensions) {
    const extensionHost = await ExtensionHostManagementShared.startExtensionHost(managerWithExtensions.manager.ipc)
    // TODO register text document change listener and sync text documents
    await startSyncing(extensionHost)
    Assert.object(extensionHost)
    for (const extension of managerWithExtensions.toActivate) {
      await actuallyActivateExtension(extensionHost, extension)
    }
    if (extensionHosts.length === 0) {
      extensionHosts.push(extensionHost)
    }
  }

  state.extensionHosts = extensionHosts

  // TODO support querying completion items from multiple extension hosts
  // e.g. completion items from node extension host and word based completions from web worker extension host
  return extensionHosts
}

// TODO add tests for this
export const activateByEvent = async (event) => {
  Assert.string(event)
  if (event === 'none') {
    const all = await Promise.all(Object.values(state.cachedActivationEvents))
    const flatAll = all.flat(1)
    return [flatAll[0]]
  }
  if (!(event in state.cachedActivationEvents)) {
    state.cachedActivationEvents[event] = actuallyActivateByEvent(event)
  }
  return state.cachedActivationEvents[event]
}

export const getExtensionHosts = () => {
  return state.extensionHosts
}
