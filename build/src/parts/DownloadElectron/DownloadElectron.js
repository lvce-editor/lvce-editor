import * as ElectronGet from '@electron/get'
import { VError } from 'verror'
import * as ExtractZip from '../ExtractZip/ExtractZip.js'

export const downloadElectron = async ({
  electronVersion,
  outDir,
  platform,
  arch,
}) => {
  try {
    const zipFilePath = await ElectronGet.downloadArtifact({
      version: electronVersion,
      platform,
      artifactName: 'electron',
      arch,
    })
    await ExtractZip.extractZip({
      inFile: zipFilePath,
      outDir,
    })
  } catch (error) {
    // @ts-ignore
    throw new VError(
      error,
      `Failed to download electron version ${electronVersion}`
    )
  }
}
