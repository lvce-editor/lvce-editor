import { readFile, rename, rm } from 'fs/promises'
import { join } from 'path'
import VError from 'verror'
import * as Download from '../Download/Download.js'
import * as Extract from '../Extract/Extract.js'
import * as Platform from '../Platform/Platform.js'
import * as TmpFile from '../TmpFile/TmpFile.js'

export const install = async ({ url }) => {
  try {
    // TODO cache extension tar br file, probably by url <cachedExtensions>/user/repo/releases/<tag>/<fileName>
    // const cachedExtensionsPath = Platform.getCachedExtensionsPath()
    // const outFile = join(cachedExtensionsPath, 'installed-extension.tar.br')
    const extensionsPath = Platform.getExtensionsPath()
    const tmpFile = await TmpFile.getTmpFile()
    await Download.download(url, tmpFile)
    const tmpDir = await TmpFile.getTmpDir()
    await Extract.extractTarBr(tmpFile, tmpDir)
    const manifestPath = join(tmpDir, 'extension.json')
    const manifestContent = await readFile(manifestPath, 'utf8')
    const manifestJson = JSON.parse(manifestContent)
    const id = manifestJson.id
    if (!id) {
      throw new Error('missing id in extension manifest')
    }
    const outDir = join(extensionsPath, id)
    await rm(outDir, { recursive: true, force: true })
    await rename(tmpDir, outDir)
  } catch (error) {
    throw new VError(error, `Failed to install "${url}"`)
  }
}
