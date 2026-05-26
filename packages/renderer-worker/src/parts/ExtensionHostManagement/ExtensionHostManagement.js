import * as Assert from '../Assert/Assert.ts'
import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
import * as ExtensionMeta from '../ExtensionMeta/ExtensionMeta.js'
import * as ExtensionMetaState from '../ExtensionMetaState/ExtensionMetaState.js'
import * as GetExtensionAbsolutePath from '../GetExtensionAbsolutePath/GetExtensionAbsolutePath.js'
import * as Origin from '../Origin/Origin.js'
import * as Platform from '../Platform/Platform.js'

export const state = {
  /**
   * @type {readonly any[]}
   */
  extensionHosts: [],
  /**
   * @type {any}
   */
  activatingExtensions: Object.create(null),
  /**
   * @type {any}
   */
  runningExtensions: Object.create(null),
}

const actuallyActivateExtension = async (extension, event) => {
  const platform = Platform.getPlatform()
  if (extension.id in state.runningExtensions) {
    return
  }
  if (!(extension.id in state.activatingExtensions)) {
    const absolutePath = GetExtensionAbsolutePath.getExtensionAbsolutePath(
      extension.id,
      extension.isWeb,
      extension.builtin,
      extension.path,
      extension.browser,
      Origin.origin,
      Platform.getPlatform(),
    )
    state.activatingExtensions[extension.id] = ExtensionManagementWorker.invoke('Extensions.activate3', extension, absolutePath, event, platform)
      .then((result) => {
        delete state.activatingExtensions[extension.id]
        state.runningExtensions[extension.id] = true
        return result
      })
      .catch((error) => {
        delete state.activatingExtensions[extension.id]
        throw error
      })
  }
  return state.activatingExtensions[extension.id]
}

const actuallyActivateByEvent = async (event, assetDir, platform) => {
  // TODO should not query extensions multiple times
  const extensions = await ExtensionManagementWorker.invoke('Extensions.getAllExtensions', assetDir, platform)
  const { resolved, rejected } = ExtensionMeta.organizeExtensions(extensions)
  // TODO if many (more than two?) extensions cannot be loaded,
  // it shouldn't should that many error messages
  await ExtensionMeta.handleRejectedExtensions(rejected)
  const extensionsToActivate = ExtensionMeta.filterByMatchingEvent(resolved, event)
  // TODO how to handle when multiple reference providers are registered for nodejs and webworker extension host?
  // what happens when all of them / some of them throw error?
  // what happens when some of them take very long to activate?

  for (const extension of extensionsToActivate) {
    await actuallyActivateExtension(extension, event)
  }
  const additionalExtensions = ExtensionMetaState.state.webExtensions
  const additionalExtensionsToActivate = ExtensionMeta.filterByMatchingEvent(additionalExtensions, event)
  for (const extension of additionalExtensionsToActivate) {
    await actuallyActivateExtension(extension, event)
  }
}

// TODO add tests for this
export const activateByEvent = async (event, assetDir, platform) => {
  console.log('activate called', event, assetDir, platform)
  Assert.string(event)
  if (event === 'none') {
    const all = await Promise.all(Object.values(state.activatingExtensions))
    return [all[0]]
  }
  return actuallyActivateByEvent(event, assetDir, platform)
}
