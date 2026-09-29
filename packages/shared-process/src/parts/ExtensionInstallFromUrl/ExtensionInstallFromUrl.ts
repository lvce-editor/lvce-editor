import { mkdir, rename, rm } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import * as Download from '../Download/Download.ts'
import * as Extract from '../Extract/Extract.ts'
import * as JsonFile from '../JsonFile/JsonFile.ts'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.ts'
import * as TmpFile from '../TmpFile/TmpFile.ts'
import { VError } from '../VError/VError.ts'

export const install = async ({ url }: any): Promise<any> => {
  try {
    // TODO cache extension tar br file, probably by url <cachedExtensions>/user/repo/releases/<tag>/<fileName>
    // const cachedExtensionsPath = Platform.getCachedExtensionsPath()
    // const outFile = join(cachedExtensionsPath, 'installed-extension.tar.br')
    const extensionsPath = PlatformPaths.getExtensionsPath()
    const tmpFile = await TmpFile.getTmpFile()
    await Download.download(url, tmpFile)
    const tmpDir = await TmpFile.getTmpDir()
    await Extract.extractTarBr(tmpFile, tmpDir)
    const manifestPath = join(tmpDir, 'extension.json')
    const manifestJson = await JsonFile.readJson(manifestPath)
    const { id } = manifestJson
    if (!id) {
      throw new Error('missing id in extension manifest')
    }
    const outDir = join(extensionsPath, id)
    await rm(outDir, { force: true, recursive: true })
    await mkdir(dirname(outDir), { recursive: true })
    await rename(tmpDir, outDir)
  } catch (error) {
    throw new VError(error, `Failed to install "${url}"`)
  }
}
