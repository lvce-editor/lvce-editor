import * as ElectronGet from '@electron/get'
import * as ExtractZip from '../ExtractZip/ExtractZip.js'

export const downloadElectron = async ({
  electronVersion,
  outDir,
  platform,
  arch,
}) => {
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
}
