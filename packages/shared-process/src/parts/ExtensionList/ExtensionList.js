import { readdir, readFile } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import VError from 'verror'
import * as Platform from '../Platform/Platform.js'
import * as JsonFile from '../JsonFile/JsonFile.js'

const extensionPath = Platform.getExtensionsPath()

const getAbsolutePath = (dirent) => {
  return join(extensionPath, dirent)
}

const getManifestVersion = (json) => {
  if (json && json.version && typeof json.version === 'string') {
    return json.version
  }
  return 'n/a'
}

const getManifestId = (json, jsonPath) => {
  if (json && json.id && typeof json.id === 'string') {
    return json.id
  }
  return basename(jsonPath)
}

const getManifestInfo = async (extensionPath) => {
  const manifestPath = join(extensionPath, 'extension.json')
  const json = await JsonFile.readJson(manifestPath)
  const id = getManifestId(json, extensionPath)
  const version = getManifestVersion(json)
  return {
    id,
    version,
  }
}

const isFulfilled = (result) => {
  return result.status === 'fulfilled'
}

const getValue = (result) => {
  return result.value
}

const getManifestInfos = async (manifestPaths) => {
  const manifestInfos = await Promise.allSettled(
    manifestPaths.map(getManifestInfo)
  )
  const results = manifestInfos.filter(isFulfilled).map(getValue)
  return results
}

export const list = async () => {
  try {
    const dirents = await readdir(extensionPath)
    const extensionPaths = dirents.map(getAbsolutePath)
    const infos = await getManifestInfos(extensionPaths)
    return infos
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return []
    }
    throw new VError(error, `Failed to list extensions`)
  }
}
