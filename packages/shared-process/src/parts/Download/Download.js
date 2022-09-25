import got, { RequestError } from 'got'
import { createWriteStream, existsSync } from 'node:fs'
import { mkdir, rm } from 'node:fs/promises'
import { dirname } from 'node:path'
import { pipeline } from 'node:stream/promises'
import VError from 'verror'
import * as Path from '../Path/Path.js'

export const download = async (url, outFile, hasKey) => {
  try {
    await mkdir(Path.dirname(outFile), { recursive: true })
    const readStream = got.stream(url, {
      http2: true,
      // cache: {
      //   has(key) {
      //     return true
      //   },
      //   get(key) {
      //     console.log('get key', key)
      //     return {}
      //   },
      //   set(key, value) {
      //     console.log('set key', key, value)
      //   },
      //   delete(key) {
      //     return true
      //   },
      //   clear() {},
      // },
    })
    const response = await new Promise((resolve, reject) => {
      readStream.on('response', resolve)
      readStream.on('error', reject)
    })
    const etag = response.headers.etag
    if (hasKey(etag)) {
      return
    }
    console.log({ headers: response.headers })
    await pipeline(readStream, createWriteStream(outFile))
    return etag
  } catch (error) {
    try {
      await rm(outFile)
    } catch {
      // ignore
    }
    if (error instanceof RequestError) {
      throw new VError(`Failed to download "${url}": ${error.message}`)
    }
    throw new VError(error, `Failed to download "${url}"`)
  }
}

export const downloadCached = async ({ url, getCachePath }) => {
  let outFile
  try {
    const readStream = got.stream(url, {
      http2: true,
    })
    const response = await new Promise((resolve, reject) => {
      readStream.on('response', resolve)
      readStream.on('error', reject)
    })
    const etag = response.headers.etag
    const cachePath = getCachePath(etag)
    outFile = cachePath
    if (existsSync(cachePath)) {
      readStream.destroy()
      return {
        fromCache: true,
        cachePath,
        etag,
      }
    }
    await mkdir(dirname(cachePath), { recursive: true })
    await pipeline(readStream, createWriteStream(cachePath))
    return {
      fromCache: false,
      cachePath,
      etag,
    }
  } catch (error) {
    try {
      await rm(outFile)
    } catch {
      // ignore
    }
    if (error instanceof RequestError) {
      throw new VError(`Failed to download "${url}": ${error.message}`)
    }
    throw new VError(error, `Failed to download "${url}"`)
  }
}
