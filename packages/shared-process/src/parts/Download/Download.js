import got from 'got'
import { createWriteStream } from 'node:fs'
import { mkdir, rm } from 'node:fs/promises'
import { pipeline } from 'node:stream/promises'
import VError from 'verror'
import * as Path from '../Path/Path.js'

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
    throw new VError(error, `Failed to download "${url}"`)
  }
}
