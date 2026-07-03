import Electron from 'electron'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import * as ElectronVersionRelaunch from './parts/ElectronVersionRelaunch/ElectronVersionRelaunch.js'

const { app } = Electron
const root = process.env.LVCE_ROOT || process.cwd()
const iconPath = join(root, 'packages', 'build', 'files', 'icon.png')
const __dirname = dirname(fileURLToPath(import.meta.url))
const bundledMainProcessPath = join(__dirname, '..', 'dist', 'mainProcessMain.js')

const setupDevWindowIcon = () => {
  if (!process.env.LVCE_ROOT) {
    return
  }
  app.setName('Lvce Editor')
  app.on('browser-window-created', (_event, window) => {
    window.setIcon(iconPath)
  })
}

const importMainProcess = async () => {
  if (existsSync(bundledMainProcessPath)) {
    await import(pathToFileURL(bundledMainProcessPath).href)
    return
  }
  await import('@lvce-editor/main-process')
}

try {
  const didRelaunch = await ElectronVersionRelaunch.maybeRelaunchWithElectronVersion()
  if (!didRelaunch) {
    setupDevWindowIcon()
    await importMainProcess()
  }
} catch (error) {
  console.error(error)
  app.exit(1)
}
