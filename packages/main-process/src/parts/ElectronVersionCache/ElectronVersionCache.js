import * as ElectronGet from '@electron/get'
import extractZip from 'extract-zip'
import { existsSync } from 'node:fs'
import { mkdir, rm } from 'node:fs/promises'
import * as ElectronVersionPaths from '../ElectronVersionPaths/ElectronVersionPaths.js'

const formatBytes = (bytes) => {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return 'unknown size'
  }
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  const digits = unitIndex === 0 ? 0 : 1
  return `${size.toFixed(digits)} ${units[unitIndex]}`
}

const createDownloadProgressLogger = ({ electronVersion, log }) => {
  let lastPercent = -1
  return (progress) => {
    const percent = Math.floor(progress.percent * 100)
    if (percent === lastPercent || percent % 5 !== 0) {
      return
    }
    lastPercent = percent
    const transferred = formatBytes(progress.transferred)
    const total = formatBytes(progress.total)
    log.info(`[electron-version] downloading Electron ${electronVersion}: ${percent}% (${transferred} / ${total})`)
  }
}

export const ensureElectronVersion = async ({
  arch,
  cachePath,
  downloadArtifactFn = ElectronGet.downloadArtifact,
  electronVersion,
  existsSyncFn = existsSync,
  extractZipFn = extractZip,
  log = console,
  mkdirFn = mkdir,
  platform,
  rmFn = rm,
}) => {
  const executablePath = ElectronVersionPaths.getElectronExecutablePath({
    electronPath: cachePath,
    platform,
  })
  if (existsSyncFn(executablePath)) {
    log.info(`[electron-version] using cached Electron ${electronVersion} at ${cachePath}`)
    return executablePath
  }
  if (existsSyncFn(cachePath)) {
    log.info(`[electron-version] removing incomplete Electron ${electronVersion} cache at ${cachePath}`)
    await rmFn(cachePath, { recursive: true, force: true })
  }
  log.info(`[electron-version] downloading Electron ${electronVersion} for ${platform} ${arch}`)
  await mkdirFn(cachePath, { recursive: true })
  const zipFilePath = await downloadArtifactFn({
    version: electronVersion,
    platform,
    artifactName: 'electron',
    arch,
    downloadOptions: {
      getProgressCallback: createDownloadProgressLogger({ electronVersion, log }),
    },
  })
  log.info(`[electron-version] extracting Electron ${electronVersion} to ${cachePath}`)
  await extractZipFn(zipFilePath, { dir: cachePath })
  if (!existsSyncFn(executablePath)) {
    throw new Error(`Downloaded Electron ${electronVersion} but no executable was found at ${executablePath}`)
  }
  log.info(`[electron-version] Electron ${electronVersion} is ready at ${executablePath}`)
  return executablePath
}
