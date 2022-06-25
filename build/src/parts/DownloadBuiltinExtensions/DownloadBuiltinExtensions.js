import got from 'got'
import { createReadStream, createWriteStream, existsSync } from 'node:fs'
import { mkdir, rm } from 'node:fs/promises'
import { pipeline } from 'node:stream/promises'
import { createBrotliDecompress } from 'node:zlib'
import tar from 'tar-fs'
import VError from 'verror'
import * as Path from '../Path/Path.js'
import extensions from './builtinExtensions.json' assert { type: 'json' }

const download = async (url, outFile) => {
  try {
    await mkdir(Path.dirname(outFile), { recursive: true })
    await pipeline(got.stream(url), createWriteStream(outFile))
  } catch (error) {
    try {
      await rm(outFile)
    } catch {}
    // @ts-ignore
    throw new VError(error, `Failed to download "${url}"`)
  }
}

const downloadExtension = async (extension) => {
  try {
    const baseName = Path.baseName(extension.path)
    const cachedPath = Path.absolute(
      Path.join('build', '.tmp', `cachedExtensions`, baseName)
    )
    if (existsSync(cachedPath)) {
      return
    }
    await download(extension.path, cachedPath)
    await extract(
      cachedPath,
      Path.absolute(Path.join(`extensions`, extension.name))
    )
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to download extension ${extension.name}`)
  }
}

export const extract = async (inFile, outDir) => {
  await mkdir(outDir, { recursive: true })
  await pipeline(
    createReadStream(inFile),
    createBrotliDecompress(),
    tar.extract(outDir)
  )
}

const downloadExtensions = async (extensions) => {
  for (const extension of extensions) {
    console.time(`[download] ${extension.name}`)
    await downloadExtension(extension)
    console.timeEnd(`[download] ${extension.name}`)
  }
}

const main = () => {
  downloadExtensions(extensions)
}

main()
