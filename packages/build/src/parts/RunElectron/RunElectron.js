import { join } from 'path'
import { root } from '../Root/Root.js'
import { spawn } from 'child_process'

let electronPath = ''
if (process.platform === 'darwin') {
  electronPath = join(root, 'packages/main-process/node_modules/electron/dist/Electron.app/Contents/MacOS/Electron')
} else {
  electronPath = join(root, 'packages/main-process/node_modules/electron/dist/electron')
}

const mainProcessPath = join(root, 'packages', 'main-process', 'node_modules', '@lvce-editor', 'main-process')
const sharedProcessPath = join(root, 'packages', 'shared-process', 'src', 'sharedProcessMain.js')

const env = {
  ...process.env,
  LVCE_ROOT: root,
  LVCE_SHARED_PROCESS_PATH: sharedProcessPath,
}

const main = () => {
  const child = spawn(electronPath, ['.'], {
    cwd: mainProcessPath,
    env,
  })
  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)
}

main()
