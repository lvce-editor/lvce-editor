import * as Character from '../Character/Character.js'
import * as Command from '../Command/Command.js'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as ExtensionManifestStatus from '../ExtensionManifestStatus/ExtensionManifestStatus.js'
import * as ExtensionMetaState from '../ExtensionMetaState/ExtensionMetaState.js'
import * as GetWebExtensions from '../GetWebExtensions/GetWebExtensions.js'
import * as Languages from '../Languages/Languages.js'
import * as Logger from '../Logger/Logger.js'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import { VError } from '../VError/VError.js'

const getId = (path) => {
  const slashIndex = path.lastIndexOf(Character.Slash)
  return path.slice(slashIndex + 1)
}

const getWebManifestPath = (path) => {
  const manifestPath = `${path}/extension.json`
  return manifestPath
}

const getWebExtensionManifest = async (path, manifestPath) => {
  try {
    const manifest = await Command.execute(/* Ajax.getJson */ 'Ajax.getJson', /* url */ manifestPath)
    return {
      ...manifest,
      path,
    }
  } catch (error) {
    const id = getId(path)
    throw new VError(error, `Failed to load extension manifest for ${id}`)
  }
}

export const addWebExtension = async (path) => {
  const manifestPath = getWebManifestPath(path)
  const manifest = await getWebExtensionManifest(path, manifestPath)
  // TODO avoid side effect here
  if (manifest.languages) {
    for (const language of manifest.languages) {
      language.tokenize &&= manifest.path + Character.Slash + language.tokenize
    }
  }
  manifest.status = ExtensionManifestStatus.Resolved
  ExtensionMetaState.state.webExtensions.push(manifest)
  if (manifest.languages) {
    // TODO handle case when languages is not of type array
    await Languages.addLanguages(manifest.languages)
  }
  // const absolutePath = manifest.path + '/' + manifest.browser
  // await ExtensionHostWorker.invoke('ExtensionHostExtension.activate', manifest, absolutePath)
}

// TODO status fulfilled should be handled as resolved
export const organizeExtensions = (extensions) => {
  const rejected = []
  const resolved = []
  for (const extension of extensions) {
    switch (extension.status) {
      case ExtensionManifestStatus.Resolved:
        resolved.push(extension)
        break
      case ExtensionManifestStatus.Rejected:
        rejected.push(extension)
        break
      default:
        resolved.push(extension)
        break
    }
  }
  return {
    resolved,
    rejected,
  }
}

export const filterByMatchingEvent = (extensions, event) => {
  const extensionsToActivate = []
  for (const extension of extensions) {
    // TODO handle error when extension.activation is not of type array (null or number or ...)
    if (extension.activation && extension.activation.includes(event)) {
      extensionsToActivate.push(extension)
    }
  }
  return extensionsToActivate
}

const getCodeFrameFromError = (error) => {
  if (error && error.jse_cause && error.jse_cause.codeFrame) {
    return error.jse_cause.codeFrame
  }
  return ''
}

const getOriginalStackFromError = (error) => {
  if (error && error.originalStack) {
    return error.originalStack
  }
  return ''
}

const handleRejectedExtension = async (extension) => {
  const { reason } = extension
  const { message, code } = reason
  if (code === ErrorCodes.E_MANIFEST_NOT_FOUND || code === ErrorCodes.ENOTDIR) {
    return
  }
  const codeFrame = getCodeFrameFromError(reason)
  const stack = getOriginalStackFromError(reason)
  Logger.error(`${message}\n${codeFrame}\n${stack}`)
}

export const handleRejectedExtensions = async (extensions) => {
  for (const extension of extensions) {
    await handleRejectedExtension(extension)
  }
}

const getSharedProcessExtensions = () => {
  return SharedProcess.invoke(/* ExtensionManagement.getExtensions */ 'ExtensionManagement.getExtensions')
}

export const getExtensions = async () => {
  if (Platform.platform === PlatformType.Web) {
    const webExtensions = await GetWebExtensions.getWebExtensions()
    return webExtensions
  }
  if (Platform.platform === PlatformType.Remote) {
    const webExtensions = await GetWebExtensions.getWebExtensions()
    const sharedProcessExtensions = await getSharedProcessExtensions()
    return [...sharedProcessExtensions, ...webExtensions]
  }
  const extensions = await getSharedProcessExtensions()
  return extensions
}

export const addNodeExtension = async (path) => {
  // TODO add support for dynamically loading node extensions
  // e.g. for testing multiple extensions
  throw new Error('not implemented')
}
