import * as ElectronGet from '@electron/get'
import VError from 'verror'
import * as ExtractZip from '../ExtractZip/ExtractZip.js'

export const downloadElectron = async ({
  electronVersion,
  outDir,
  platform,
  arch,
}) => {
  try {
    console.info(`downloading electron ${electronVersion}`)
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
    throw new VError(
      // @ts-ignore
      error,
      `Failed to download electron version ${electronVersion}`
    )
  }
}
