import isObject from 'is-object'
import VError from 'verror'
import * as ExtensionManifestStatus from '../ExtensionManifestStatus/ExtensionManifestStatus.js'
import * as ReadJson from '../JsonFile/JsonFile.js'
import * as Path from '../Path/Path.js'
import * as FileSystemErrorCodes from '../FileSystemErrorCodes/FileSystemErrorCodes.js'

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
  try {
    const absolutePath = Path.join(path, 'extension.json')
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
    if (error.code === FileSystemErrorCodes.ENOENT) {
      return {
        path,
        status: ExtensionManifestStatus.Rejected,
        reason: new VError(`no extension manifest found`),
      }
    }
    return {
      path,
      status: ExtensionManifestStatus.Rejected,
      reason: new VError(
        error,
        `Failed to load extension "${id}": Failed to load extension manifest`
      ),
    }
  }
}
