import VError from 'verror'
import * as Assert from '../Assert/Assert.js'
import * as Download from '../Download/Download.js'
import * as ExtractZip from '../ExtractZip/ExtractZip.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'

const getExtensionPath = async (tmpDir) => {
  const dirents = await FileSystem.readDirWithFileTypes(tmpDir)
  if (dirents.length === 1 && dirents[0].type === 'directory') {
    return Path.join(tmpDir, dirents[0].name)
  }
  return tmpDir
}

export const install = async (name, url) => {
  try {
    // TODO
    // figure out download url
    // download extension
    // extract extension
    // figure out extension path
    // move extension to extensions folder
    Assert.string(name)
    Assert.string(url)
    const cachedChromeExtensionsPath = Platform.getCachedExtensionsPath()
    const tempFileCompressed = Path.join(
      cachedChromeExtensionsPath,
      `${name}.zip`
    )
    const tmpDir = Path.join(cachedChromeExtensionsPath, name)
    const chromeExtensionsPath = Platform.getChromeExtensionsPath()
    await Download.download(url, tempFileCompressed)
    await ExtractZip.extractZip({ inFile: tempFileCompressed, outDir: tmpDir })
    const cachedExtensionPath = await getExtensionPath(tmpDir)
    const outDir = Path.join(chromeExtensionsPath, name)
    await FileSystem.remove(outDir)
    await FileSystem.rename(cachedExtensionPath, outDir)
  } catch (error) {
    throw new VError(error, `Failed to install chrome extension ${name}`)
  }
}

export const uninstall = async (name) => {
  try {
    Assert.string(name)

    // TODO
    // figure out extension path
    // remove file
  } catch (error) {
    throw new VError(error, `Failed to uninstall chrome extension ${name}`)
  }
}
