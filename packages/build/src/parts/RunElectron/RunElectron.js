import { createRequire } from 'module'
import { join } from 'path'
import { root } from '../Root/Root.js'
import { spawn } from 'child_process'
import { resolveElectronPath } from '../ResolveElectronPath/ResolveElectronPath.js'

const require = createRequire(import.meta.url)
const electronPath = resolveElectronPath({
  root,
  platform: process.platform,
  requireFromMainProcess: request => require(join(root, 'packages', 'main-process', 'node_modules', request)),
})

const mainProcessPath = process.env.LVCE_MAIN_PROCESS_PATH || join(root, 'packages', 'main-process', 'node_modules', '@lvce-editor', 'main-process')
const sharedProcessPath = join(root, 'packages', 'shared-process', 'src', 'sharedProcessMain.js')

const env = {
  ...process.env,
  LVCE_ROOT: root,
  LVCE_SHARED_PROCESS_PATH: sharedProcessPath,
}

const main = () => {
  const cliArgs = process.argv.slice(2)
  const child = spawn(electronPath, ['.', ...cliArgs], {
    cwd: mainProcessPath,
    env,
  })
  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)
}

main()
