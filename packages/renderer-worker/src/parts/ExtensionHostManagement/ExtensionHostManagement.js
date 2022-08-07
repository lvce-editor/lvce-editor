import * as Assert from '../Assert/Assert.js'
import * as Command from '../Command/Command.js'
import * as ExtensionMeta from '../ExtensionMeta/ExtensionMeta.js'
import * as Languages from '../Languages/Languages.js'
import * as Platform from '../Platform/Platform.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as ExtensionHostManagementBrowser from './ExtensionHostManagementBrowser.js'
import * as ExtensionHostManagementNode from './ExtensionHostManagementNode.js'
import * as ExtensionHostManagementShared from './ExtensionHostManagementShared.js'

export const state = {
  /**
   * @type {any[]}
   */
  extensionHosts: [],
}

const getExtensionHostManagementTypes = () => {
  const platform = Platform.getPlatform()
  switch (platform) {
    case 'web':
      return [ExtensionHostManagementBrowser]
    case 'remote':
    case 'electron':
      return [ExtensionHostManagementBrowser, ExtensionHostManagementNode]
    default:
      throw new Error('unsupported platform')
  }
}

const getExtensionsToActivate = (extensions, event) => {
  const extensionsToActivate = []
  for (const extension of extensions) {
    if (extension.activation && extension.activation.includes(event)) {
      extensionsToActivate.push(extension)
    }
  }
  return extensionsToActivate
}

const getExtensionsWithError = (extensions) => {
  const extensionsWithError = []
  for (const extension of extensions) {
    if (extension.status === 'rejected') {
      extensionsWithError.push(extension)
    }
  }
  return extensionsWithError
}

const handleExtensionActivationError = async (extension) => {
  const message = extension.reason.message
  if (message.includes(`Failed to load extension manifest: ENOENT`)) {
    return
  }
  const codeFrame = extension.reason.jse_cause.codeFrame
  const stack = extension.reason.originalStack
  await Command.execute(
    /* Dialog.showMessage */ 'Dialog.showMessage',
    /* error */ { message, codeFrame, stack }
  )
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

const startTextDocumentSyncing = async (extensionHost) => {
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

  const instances = Viewlet.state.instances
  const editorInstance = instances.EditorText
  if (editorInstance) {
    await handleEditorCreate(editorInstance.state)
  }
  console.log('finish text document synching')
}

// TODO add tests for this
export const activateByEvent = async (event) => {
  Assert.string(event)
  if (!Languages.hasLoaded()) {
    await Languages.waitForLoad()
  }
  // TODO should not query extensions multiple times
  const extensions = await ExtensionMeta.getExtensions()

  // TODO if many (more than two?) extensions cannot be loaded,
  // it shouldn't should that many error messages
  const extensionsWithError = getExtensionsWithError(extensions)
  for (const extension of extensionsWithError) {
    await handleExtensionActivationError(extension)
  }
  const extensionsToActivate = getExtensionsToActivate(extensions, event)
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
    Assert.object(extensionHost)
    for (const extension of managerWithExtensions.toActivate) {
      // TODO tell extension host to activate extension
      await extensionHost.ipc.invoke(
        'ExtensionHostExtension.enableExtension',
        extension
      )
      // TODO register text document change listener and sync text documents
      await startTextDocumentSyncing(extensionHost)
    }
    extensionHosts.push(extensionHost)
  }

  state.extensionHosts = extensionHosts

  // TODO support querying completion items from multiple extension hosts
  // e.g. completion items from node extension host and word based completions from web worker extension host
  return extensionHosts
}

export const getExtensionHosts = () => {
  return state.extensionHosts
}
