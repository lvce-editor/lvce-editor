import { pipeline } from 'node:stream/promises'
import { createGunzip } from 'node:zlib'
import got, { RequestError } from 'got'
import tar from 'tar-fs'
import { VError } from '../VError/VError.js'

export const downloadAndExtractTarGz = async ({ url, outDir, strip }) => {
  try {
    await pipeline(
      got.stream(url),
      createGunzip(),
      tar.extract(outDir, {
        strip,
      }),
    )
  } catch (error) {
    if (error && error instanceof RequestError) {
      throw new VError(`Failed to download ${url}: ${error.message}`)
    }
    throw error
  }
}
