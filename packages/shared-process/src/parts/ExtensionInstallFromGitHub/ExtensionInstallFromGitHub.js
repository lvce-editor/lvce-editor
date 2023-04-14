import * as DownloadAndExtract from '../DownloadAndExtract/DownloadAndExtract.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import { VError } from '../VError/VError.js'

export const install = async ({ user, repo, branch }) => {
  try {
    const cachedExtensionsPath = Platform.getCachedExtensionsPath()
    const url = `https://codeload.github.com/${user}/${repo}/tar.gz/${branch}`
    const cachedExtensionPath = Path.join(cachedExtensionsPath, `github-${user}-${repo}-${branch}`)
    await DownloadAndExtract.downloadAndExtractTarGz({
      url,
      outDir: cachedExtensionPath,
      strip: 1,
    })
    const extensionsPath = Platform.getExtensionsPath()
    const manifestPath = Path.join(cachedExtensionPath, 'extension.json')
    const manifestJson = await JsonFile.readJson(manifestPath)
    const { id } = manifestJson
    if (!id) {
      throw new Error('missing id in extension manifest')
    }
    const outDir = Path.join(extensionsPath, id)
    await FileSystem.remove(outDir)
    await FileSystem.mkdir(extensionsPath)
    await FileSystem.rename(cachedExtensionPath, outDir)
  } catch (error) {
    throw new VError(error, `Failed to install ${user}/${repo}`)
  }
}
