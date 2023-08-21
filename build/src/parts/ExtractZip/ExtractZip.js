import extract from 'extract-zip'
import { mkdir } from 'node:fs/promises'
import { VError } from '@lvce-editor/verror'

export const extractZip = async ({ inFile, outDir }) => {
  try {
    await mkdir(outDir, { recursive: true })
    await extract(inFile, { dir: outDir })
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to extract ${inFile}`)
  }
}
