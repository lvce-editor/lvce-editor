import * as ElectronGet from '@electron/get'
import extractZip from 'extract-zip'
import { existsSync } from 'node:fs'
import { mkdir, rm } from 'node:fs/promises'
import * as ElectronVersionPaths from '../ElectronVersionPaths/ElectronVersionPaths.js'

export const ensureElectronVersion = async ({
  arch,
  cachePath,
  downloadArtifactFn = ElectronGet.downloadArtifact,
  electronVersion,
  existsSyncFn = existsSync,
  extractZipFn = extractZip,
  mkdirFn = mkdir,
  platform,
  rmFn = rm,
}) => {
  const executablePath = ElectronVersionPaths.getElectronExecutablePath({
    electronPath: cachePath,
    platform,
  })
  if (existsSyncFn(executablePath)) {
    return executablePath
  }
  if (existsSyncFn(cachePath)) {
    await rmFn(cachePath, { recursive: true, force: true })
  }
  await mkdirFn(cachePath, { recursive: true })
  const zipFilePath = await downloadArtifactFn({
    version: electronVersion,
    platform,
    artifactName: 'electron',
    arch,
  })
  await extractZipFn(zipFilePath, { dir: cachePath })
  if (!existsSyncFn(executablePath)) {
    throw new Error(`Downloaded Electron ${electronVersion} but no executable was found at ${executablePath}`)
  }
  return executablePath
}
