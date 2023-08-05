import isObject from 'is-object'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as ExtensionManifestStatus from '../ExtensionManifestStatus/ExtensionManifestStatus.js'
import * as ReadJson from '../JsonFile/JsonFile.js'
import * as Path from '../Path/Path.js'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.js'
import { VError } from '../VError/VError.js'

const RE_EXTENSION_FRAGMENT = /.+(\/|\\)(.+)$/

const inferExtensionId = (absolutePath) => {
  const match = absolutePath.match(RE_EXTENSION_FRAGMENT)
  if (match) {
    return match[2]
  }
  return ''
}

// TODO json parsing and error handling should happen in renderer process
export const get = async (path) => {
  const absolutePath = Path.join(path, 'extension.json')
  try {
    const json = await ReadJson.readJson(absolutePath)
    if (!isObject(json)) {
      // TODO should include stack of extension json file here
      throw new VError('Invalid manifest file: Not an JSON object.')
    }
    return {
      ...json,
      path,
      status: ExtensionManifestStatus.Resolved,
    }
  } catch (error) {
    const id = inferExtensionId(path)
    const enhancedError = new VError(error, `Failed to load extension manifest for ${id}`)
    if (IsEnoentError.isEnoentError(error)) {
      try {
        const monoRepoPath = Path.join(path, `packages`, 'extension', 'extension.json')
        const json = await ReadJson.readJson(monoRepoPath)
        if (!isObject(json)) {
          // TODO should include stack of extension json file here
          throw new VError('Invalid manifest file: Not an JSON object.')
        }
        return {
          ...json,
          path: Path.join(path, 'packages', 'extension'),
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
