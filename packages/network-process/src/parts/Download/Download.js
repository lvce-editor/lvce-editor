import got, { RequestError } from 'got'
import { createWriteStream } from 'node:fs'
import { mkdir, rm } from 'node:fs/promises'
import { pipeline } from 'node:stream/promises'
import * as Path from '../Path/Path.js'
import { VError } from '../VError/VError.js'

export const download = async (url, outFile) => {
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
