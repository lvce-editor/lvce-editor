import { app } from 'electron'
import { join } from 'node:path'
import * as ArgvConfig from '../../server/src/argvConfig.js'
import { handleMacOsSaveShortcut } from './handleMacOsSaveShortcut.js'

const root = process.env.LVCE_ROOT || process.cwd()
if (process.env.LVCE_ARGV_CONFIG_LOADED !== '1') {
  const configArguments = await ArgvConfig.load(ArgvConfig.getArgvConfigPath())
  ArgvConfig.prepend(process.argv, configArguments)
  process.env.LVCE_ARGV_CONFIG_LOADED = '1'
}
const iconPath = join(root, 'packages', 'build', 'files', 'icon.png')
const isPromptMode = process.argv.some((argument) => argument === '--prompt' || argument.startsWith('--prompt='))

if (isPromptMode) {
  console.info = () => {}
  process.env.NODE_NO_WARNINGS = '1'
}

app.setName('Lvce Editor')
app.on('browser-window-created', (_event, window) => {
  window.setIcon(iconPath)
  window.webContents.on('before-input-event', (event, input) => {
    handleMacOsSaveShortcut(event, input, window.webContents)
  })
})

await import('@lvce-editor/main-process')
