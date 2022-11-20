import * as Assert from '../Assert/Assert.js'
import * as ExtensionMeta from '../ExtensionMeta/ExtensionMeta.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as Workspace from '../Workspace/Workspace.js'
import * as ExtensionHostManagementBrowser from './ExtensionHostManagementBrowser.js'
import * as ExtensionHostManagementElectron from './ExtensionHostManagementElectron.js'
import * as ExtensionHostManagementNode from './ExtensionHostManagementNode.js'
import * as ExtensionHostManagementShared from './ExtensionHostManagementShared.js'

export const state = {
  /**
   * @type {any[]}
   */
  extensionHosts: [],
  cachedActivationEvents: Object.create(null),
}

const getExtensionHostManagementTypes = () => {
  const platform = Platform.platform
  switch (platform) {
    case PlatformType.Web:
      return [ExtensionHostManagementBrowser]
    case PlatformType.Remote:
      return [ExtensionHostManagementBrowser, ExtensionHostManagementNode]
    case PlatformType.Electron:
      return [ExtensionHostManagementBrowser, ExtensionHostManagementElectron]
    default:
      throw new Error('unsupported platform')
  }
}

const getManagersWithExtensionsToActivate = (
  extensionHostManagers,
  extensions
) => {
  const managersToActivate = []
  for (const manager of extensionHostManagers) {
    const toActivate = []
    for (const extension of extensions) {
      if (manager.canActivate(extension)) {
        toActivate.push(extension)
      }
    }
    if (toActivate.length > 0) {
      managersToActivate.push({ manager, toActivate })
    }
  }
  return managersToActivate
}

const startSynching = async (extensionHost) => {
  const handleEditorCreate = (editor) => {
    const text = TextDocument.getText(editor)
    return extensionHost.ipc.invoke(
      'ExtensionHostTextDocument.syncFull',
      editor.uri,
      editor.id,
      editor.languageId,
      text
    )
  }
  GlobalEventBus.addListener('editor.create', handleEditorCreate)

  const handleEditorChange = (editor, changes) => {
    return extensionHost.ipc.invoke(
      'ExtensionHostTextDocument.syncIncremental',
      editor.id,
      changes
    )
  }
  GlobalEventBus.addListener('editor.change', handleEditorChange)

  const handleEditorLanguageChange = (editor) => {
    return extensionHost.ipc.invoke(
      'ExtensionHostTextDocument.setLanguageId',
      editor.id,
      editor.languageId
    )
  }

  GlobalEventBus.addListener(
    'editor.languageChange',
    handleEditorLanguageChange
  )

  const handleWorkspaceChange = async (workspacePath) => {
    await extensionHost.ipc.invoke('Workspace.setWorkspacePath', workspacePath)
    if (Workspace.state.mockExec) {
      await extensionHost.ipc.invoke(
        'ExtensionHostMockExec.mockExec',
        `${Workspace.state.mockExec}`
      )
    }
  }

  const handlePreferencesChange = () => {
    return extensionHost.ipc.invoke('Configuration.configurationChanged')
  }

  GlobalEventBus.addListener('workspace.change', handleWorkspaceChange)
  GlobalEventBus.addListener('preferences.changed', handlePreferencesChange)

  const instances = ViewletStates.getAllInstances()
  const editorInstance = instances.EditorText
  if (editorInstance) {
    await handleEditorCreate(editorInstance.state)
  }
  await handleWorkspaceChange(Workspace.state.workspacePath, Workspace.isTest())
}

const actuallyActivateByEvent = async (event) => {
  // TODO should not query extensions multiple times
  const extensions = await ExtensionMeta.getExtensions()
  const { resolved, rejected } = ExtensionMeta.organizeExtensions(extensions)
  // TODO if many (more than two?) extensions cannot be loaded,
  // it shouldn't should that many error messages
  await ExtensionMeta.handleRejectedExtensions(rejected)
  const extensionsToActivate = ExtensionMeta.filterByMatchingEvent(
    resolved,
    event
  )
  // TODO how to handle when multiple reference providers are registered for nodejs and webworker extension host?
  // what happens when all of them / some of them throw error?
  // what happens when some of them take very long to activate?

  const extensionHostManagerTypes = getExtensionHostManagementTypes()
  const extensionHostsWithExtensions = getManagersWithExtensionsToActivate(
    extensionHostManagerTypes,
    extensionsToActivate
  )
  const extensionHosts = []
  for (const managerWithExtensions of extensionHostsWithExtensions) {
    const extensionHost =
      await ExtensionHostManagementShared.startExtensionHost(
        managerWithExtensions.manager.name,
        managerWithExtensions.manager.ipc
      )
    // TODO register text document change listener and sync text documents
    await startSynching(extensionHost)
    Assert.object(extensionHost)
    for (const extension of managerWithExtensions.toActivate) {
      // TODO tell extension host to activate extension
      await extensionHost.ipc.invoke(
        'ExtensionHostExtension.enableExtension',
        extension
      )
    }
    extensionHosts.push(extensionHost)
  }

  state.extensionHosts = extensionHosts

  // TODO support querying completion items from multiple extension hosts
  // e.g. completion items from node extension host and word based completions from web worker extension host
  return extensionHosts
}

// TODO add tests for this
export const activateByEvent = async (event) => {
  Assert.string(event)
  if (!(event in state.cachedActivationEvents)) {
    state.cachedActivationEvents[event] = actuallyActivateByEvent(event)
  }
  return state.cachedActivationEvents[event]
}

export const getExtensionHosts = () => {
  return state.extensionHosts
}
