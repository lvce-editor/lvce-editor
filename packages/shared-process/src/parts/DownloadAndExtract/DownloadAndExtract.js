import got, { RequestError } from 'got'
import { pipeline } from 'stream/promises'
import tar from 'tar-fs'
import { createGunzip } from 'zlib'
import { VError } from '../VError/VError.js'

export const downloadAndExtractTarGz = async ({ url, outDir, strip }) => {
  try {
    await pipeline(
      got.stream(url),
      createGunzip(),
      tar.extract(outDir, {
        strip,
      })
    )
  } catch (error) {
    // console.log({ error })
    if (error && error instanceof RequestError) {
      console.log('is req error')
      throw new VError(`Failed to download ${url}: ${error.message}`)
    }
    throw error
  }
}
