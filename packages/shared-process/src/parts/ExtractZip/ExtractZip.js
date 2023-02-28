import { mkdir } from 'node:fs/promises'
import extract from 'extract-zip'
import { VError } from '../VError/VError.js'

export const extractZip = async ({ inFile, outDir }) => {
  try {
    await mkdir(outDir, { recursive: true })
    await extract(inFile, { dir: outDir })
  } catch (error) {
    throw new VError(error, `Failed to extract ${inFile}`)
  }
}
