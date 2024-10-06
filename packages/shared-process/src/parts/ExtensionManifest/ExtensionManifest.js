import isObject from 'is-object'
import { pathToFileURL } from 'node:url'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as ExtensionManifestStatus from '../ExtensionManifestStatus/ExtensionManifestStatus.js'
import * as InferExtensionId from '../InferExtensionId/InferExtensionId.js'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.js'
import * as ReadJson from '../JsonFile/JsonFile.js'
import * as Path from '../Path/Path.js'
import { VError } from '../VError/VError.js'

// TODO json parsing and error handling should happen in renderer process
export const get = async (path) => {
  const absolutePath = Path.join(path, 'extension.json')
  try {
    const json = await ReadJson.readJson(absolutePath)
    if (!isObject(json)) {
      // TODO should include stack of extension json file here
      throw new VError('Invalid manifest file: Not an JSON object.')
    }
    const uri = pathToFileURL(path).toString()
    return {
      ...json,
      path,
      uri,
      status: ExtensionManifestStatus.Resolved,
    }
  } catch (error) {
    const id = InferExtensionId.inferExtensionId(path)
    const enhancedError = new VError(error, `Failed to load extension manifest for ${id}`)
    if (IsEnoentError.isEnoentError(error)) {
      try {
        const monoRepoPath = Path.join(path, `packages`, 'extension', 'extension.json')
        const json = await ReadJson.readJson(monoRepoPath)
        if (!isObject(json)) {
          // TODO should include stack of extension json file here
          throw new VError('Invalid manifest file: Not an JSON object.')
        }
        const extensionPath = Path.join(path, 'packages', 'extension')
        const uri = pathToFileURL(extensionPath).toString()
        return {
          ...json,
          path: extensionPath,
          uri,
          status: ExtensionManifestStatus.Resolved,
        }
      } catch {}
      // @ts-ignore
      enhancedError.path = absolutePath
      // @ts-ignore
      enhancedError.code = ErrorCodes.E_MANIFEST_NOT_FOUND
    } else {
      // @ts-ignore
      enhancedError.code = error.code
    }
    return {
      path,
      status: ExtensionManifestStatus.Rejected,
      reason: enhancedError,
    }
  }
}
