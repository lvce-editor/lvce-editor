import { createReadStream, createWriteStream } from 'node:fs'
import { mkdir, rm } from 'node:fs/promises'
import { pipeline } from 'node:stream/promises'
import { createBrotliDecompress } from 'node:zlib'
import got from 'got'
import tar from 'tar-fs'
import * as Error from '../Error/Error.js'
import * as Path from '../Path/Path.js'

export const download = async (url, outFile) => {
  try {
    await mkdir(Path.dirname(outFile), { recursive: true })
    await pipeline(got.stream(url), createWriteStream(outFile))
  } catch (error) {
    try {
      await rm(outFile)
    } catch {}
    throw new Error.OperationalError({
      cause: error,
      code: 'E_DOWNLOAD_FAILED',
      message: `Failed to download "${url}"`,
    })
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
