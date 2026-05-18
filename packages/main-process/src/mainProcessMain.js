import { app } from 'electron'
import { join } from 'node:path'

const root = process.env.LVCE_ROOT || process.cwd()
const iconPath = join(root, 'packages', 'build', 'files', 'icon.png')

app.setName('Lvce Editor')
app.on('browser-window-created', (_event, window) => {
  window.setIcon(iconPath)
})

await import('@lvce-editor/main-process')
