import * as ElectronGet from '@electron/get'
import { VError } from '@lvce-editor/verror'
import * as ExtractZip from '../ExtractZip/ExtractZip.js'
import * as Logger from '../Logger/Logger.js'
import { existsSync } from 'node:fs'

export const downloadElectron = async ({ electronVersion, outDir, platform, arch }) => {
  try {
    Logger.info(`downloading electron ${electronVersion} ${platform} ${arch}`)
    if (existsSync(outDir)) {
      return
    }
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
    throw new VError(error, `Failed to download electron version ${electronVersion}`)
  }
}
