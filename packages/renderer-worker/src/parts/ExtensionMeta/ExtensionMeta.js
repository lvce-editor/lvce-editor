import * as Command from '../Command/Command.js'
import * as ExtensionManifestStatus from '../ExtensionManifestStatus/ExtensionManifestStatus.js'
import * as FileSystemErrorCodes from '../FileSystemErrorCodes/FileSystemErrorCodes.js'
import * as Languages from '../Languages/Languages.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import { VError } from '../VError/VError.js'
export const state = {
  /**
   * @type {any[]}
   */
  webExtensions: [],
}

const getId = (path) => {
  const slashIndex = path.lastIndexOf('/')
  return path.slice(slashIndex + 1)
}

const getWebExtensionManifest = async (path) => {
  try {
    const manifestPath = `${path}/extension.json`
    const manifest = await Command.execute(
      /* Ajax.getJson */ 'Ajax.getJson',
      /* url */ manifestPath
    )
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
  const manifest = await getWebExtensionManifest(path)
  // TODO avoid side effect here
  if (manifest.languages) {
    for (const language of manifest.languages) {
      if (language.tokenize) {
        language.tokenize = manifest.path + '/' + language.tokenize
      }
    }
  }
  manifest.status = ExtensionManifestStatus.Resolved
  state.webExtensions.push(manifest)
  if (manifest.languages) {
    // TODO handle case when languages is not of type array
    await Languages.addLanguages(manifest.languages)
  }
}

const getSharedProcessExtensions = () => {
  return SharedProcess.invoke(
    /* ExtensionManagement.getExtensions */ 'ExtensionManagement.getExtensions'
  )
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
  if (
    code === FileSystemErrorCodes.ENOENT ||
    code === FileSystemErrorCodes.ENOTDIR
  ) {
    return
  }
  const codeFrame = getCodeFrameFromError(reason)
  const stack = getOriginalStackFromError(reason)
  await Command.execute(
    /* Dialog.showMessage */ 'Dialog.showMessage',
    /* error */ { message, codeFrame, stack }
  )
}

export const handleRejectedExtensions = async (extensions) => {
  for (const extension of extensions) {
    await handleRejectedExtension(extension)
  }
}

export const getExtensions = async () => {
  if (Platform.platform === PlatformType.Web) {
    return state.webExtensions
  }
  if (Platform.platform === PlatformType.Remote) {
    const sharedProcessExtensions = await getSharedProcessExtensions()
    return [...sharedProcessExtensions, ...state.webExtensions]
  }
  const extensions = await getSharedProcessExtensions()
  return extensions
}

export const addNodeExtension = async (path) => {
  // TODO add support for dynamically loading node extensions
  // e.g. for testing multiple extensions
  throw new Error('not implemented')
}
