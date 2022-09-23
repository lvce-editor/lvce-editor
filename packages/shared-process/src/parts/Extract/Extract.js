import { createReadStream } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { pipeline } from 'node:stream/promises'
import { createBrotliDecompress } from 'node:zlib'
import tar from 'tar-fs'
import VError from 'verror'

export const extract = async (inFile, outDir) => {
  try {
    await mkdir(outDir, { recursive: true })
    await pipeline(
      createReadStream(inFile),
      createBrotliDecompress(),
      tar.extract(outDir)
    )
  } catch (error) {
    throw new VError(error, `Failed to extract ${inFile}`)
  }
}
