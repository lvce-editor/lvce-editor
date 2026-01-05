import * as Character from '../Character/Character.js'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'
import * as ExtensionManifestStatus from '../ExtensionManifestStatus/ExtensionManifestStatus.js'
import * as ExtensionMetaState from '../ExtensionMetaState/ExtensionMetaState.js'
import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
import * as Languages from '../Languages/Languages.js'
import * as Logger from '../Logger/Logger.js'
import * as WebViews from '../WebViews/WebViews.ts'

export const addWebExtension = async (path) => {
  const manifest = await ExtensionHostWorker.invoke('Extensions.addWebExtension', path)
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
  if (manifest.webViews) {
    for (const webView of manifest.webViews) {
      if (webView.path) {
        webView.path = manifest.path + Character.Slash + webView.path
        webView.uri = webView.path
      } else {
        webView.path = manifest.path
        webView.uri = webView.path
      }
    }
    WebViews.addMany(manifest.webViews)
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

const validateEvents = (extension) => {
  if (!extension) {
    return []
  }
  if (!extension.activation) {
    return []
  }
  // TODO handle error when extension.activation is not of type array (null or number or ...)
  const warnings = []
  for (const item of extension.activation) {
    if (item.startsWith('onWebview:')) {
      warnings.push(`[renderer-worker] Invalid extension activation event in ${extension.path}: should be onWebView:`)
    }
  }
  return warnings
}

export const filterByMatchingEvent = (extensions, event) => {
  const extensionsToActivate = []
  for (const extension of extensions) {
    const warnings = validateEvents(extension)
    for (const warning of warnings) {
      console.warn(warning)
    }
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

export const getExtensions = async (assetDir, platform) => {
  return ExtensionManagementWorker.invoke('Extensions.getAllExtensions', assetDir, platform)
}

export const addNodeExtension = async (path) => {
  // TODO add support for dynamically loading node extensions
  // e.g. for testing multiple extensions
  throw new Error('not implemented')
}
