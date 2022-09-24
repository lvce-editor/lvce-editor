import got from 'got'
import { pipeline } from 'stream/promises'
import tar from 'tar-fs'
import { createGunzip } from 'zlib'

export const downloadAndExtractTarGz = async ({ url, outDir, strip }) => {
  await pipeline(
    got.stream(url),
    createGunzip(),
    tar.extract(outDir, {
      strip,
    })
  )
}
