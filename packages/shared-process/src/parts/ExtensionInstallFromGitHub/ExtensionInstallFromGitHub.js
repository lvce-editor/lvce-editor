import VError from 'verror'
import * as Download from '../Download/Download.js'
import * as Extract from '../Extract/Extract.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'

export const install = async ({ user, repo, branch, outDir = '/tmp' }) => {
  console.time('install')
  try {
    const cachedExtensionsPath = Platform.getCachedExtensionsPath()
    const getCachePath = (etag) => {
      const cacheKey = `github-${user}-${repo}-${etag.slice(3, -1)}.tar.gz`
      const cacheKeyPath = Path.join(cachedExtensionsPath, cacheKey)
      console.log({ cacheKeyPath })
      return cacheKeyPath
    }

    const url = `https://codeload.github.com/${user}/${repo}/tar.gz/${branch}`

    console.log({ url })
    console.time('request')
    const { cachePath, fromCache, etag } = await Download.downloadCached({
      url,
      getCachePath,
    })

    const cachedExtensionPath = Path.join(
      cachedExtensionsPath,
      `github-${user}-${repo}-${etag.slice(3)}`
    )
    console.timeEnd('request')
    console.log({ fromCache, cachePath })
    console.time('extract')
    await Extract.extractTarGz({
      inFile: cachePath,
      outDir: cachedExtensionPath,
      strip: 1,
    })
    console.timeEnd('extract')
    const extensionsPath = Platform.getExtensionsPath()
    const manifestPath = Path.join(cachedExtensionPath, 'extension.json')
    const manifestContent = await FileSystem.readFile(manifestPath)
    const manifestJson = JSON.parse(manifestContent)
    const id = manifestJson.id
    if (!id) {
      throw new Error('missing id in extension manifest')
    }
    const outDir = Path.join(extensionsPath, id)
    await FileSystem.remove(outDir)
    await FileSystem.rename(cachedExtensionPath, outDir)
  } catch (error) {
    throw new VError(error, `Failed to install ${user}/${repo}`)
  }
  console.timeEnd('install')
}
