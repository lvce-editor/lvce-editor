import { join } from 'path'
import VError from 'verror'
import * as Download from '../Download/Download.js'
import * as Extract from '../Extract/Extract.js'
import * as Platform from '../Platform/Platform.js'

const getUrl = (input) => {
  const slashCount = input.split('/').length
  if (slashCount === 2) {
    return `https://github.com/${input}`
  }
  throw new Error(`Failed to parse url`)
}

export const install = async (input) => {
  try {
    const cachedExtensionsPath = Platform.getCachedExtensionsPath()
    const extensionsPath = Platform.getExtensionsPath()
    const url = getUrl(input)
    const outFile = join(cachedExtensionsPath, 'installed-extension.tar.br')
    const outDir = join(extensionsPath, 'installed-extension')
    // const tmpFile = await TmpFile.getTmpFile()
    await Download.download(url, outDir)
    // const tmpDir = await TmpFile.getTmpDir()
    await Extract.extract(outDir, outFile)
  } catch (error) {
    throw new VError(error, `Failed to install "${input}"`)
  }
}
