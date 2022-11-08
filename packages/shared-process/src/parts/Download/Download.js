import got, { RequestError } from 'got'
import { createWriteStream } from 'node:fs'
import { mkdir, rm } from 'node:fs/promises'
import { pipeline } from 'node:stream/promises'
import VError from 'verror'
import * as Path from '../Path/Path.js'

export const download = async (url, outFile) => {
  console.log('downlaod', url, outFile)
  try {
    await mkdir(Path.dirname(outFile), { recursive: true })
    await pipeline(got.stream(url), createWriteStream(outFile))
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
