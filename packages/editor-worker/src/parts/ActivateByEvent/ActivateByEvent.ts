import * as Assert from '../Assert/Assert.ts'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.js'
import * as Origin from '../Origin/Origin.js'

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

const actuallyActivateExtension = async (extensionHost: any, extension: any) => {
  if (!(extension.id in state.activatedExtensions)) {
    // @ts-ignore
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

const actuallyActivateByEvent = async (event: any) => {
  // TODO should not query extensions multiple times
  // @ts-ignore
  const extensions = await ExtensionMeta.getExtensions()
  // @ts-ignore
  const { resolved, rejected } = ExtensionMeta.organizeExtensions(extensions)
  // TODO if many (more than two?) extensions cannot be loaded,
  // it shouldn't should that many error messages
  // @ts-ignore
  await ExtensionMeta.handleRejectedExtensions(rejected)
  // @ts-ignore
  const extensionsToActivate = ExtensionMeta.filterByMatchingEvent(resolved, event)
  // TODO how to handle when multiple reference providers are registered for nodejs and webworker extension host?
  // what happens when all of them / some of them throw error?
  // what happens when some of them take very long to activate?

  // @ts-ignore
  const extensionHostManagerTypes = ExtensionHostManagementBrowser
  // @ts-ignore
  const extensionHostsWithExtensions = getManagersWithExtensionsToActivate(extensionHostManagerTypes, extensionsToActivate)
  const extensionHosts = []
  for (const managerWithExtensions of extensionHostsWithExtensions) {
    // @ts-ignore
    const extensionHost = await ExtensionHostManagementShared.startExtensionHost(managerWithExtensions.manager.ipc)
    // TODO register text document change listener and sync text documents
    // @ts-ignore
    await startSyncing(extensionHost)
    Assert.object(extensionHost)
    for (const extension of managerWithExtensions.toActivate) {
      await actuallyActivateExtension(extensionHost, extension)
    }
    if (extensionHosts.length === 0) {
      extensionHosts.push(extensionHost)
    }
  }

  // @ts-ignore
  state.extensionHosts = extensionHosts

  // TODO support querying completion items from multiple extension hosts
  // e.g. completion items from node extension host and word based completions from web worker extension host
  return extensionHosts
}

// TODO add tests for this
export const activateByEvent = async (event: any) => {
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
