import { join } from 'path'
import { root } from '../Root/Root.js'
import { spawn } from 'child_process'
import { resolveElectronLaunch } from '../ResolveElectronPath/ResolveElectronPath.js'

const electronLaunch = resolveElectronLaunch({
  root,
  platform: process.platform,
})

const mainProcessPath = process.env.LVCE_MAIN_PROCESS_PATH || join(root, 'packages', 'main-process')
const sharedProcessPath = join(root, 'packages', 'shared-process', 'src', 'sharedProcessMain.js')

const env = {
  ...process.env,
  LVCE_ROOT: root,
  LVCE_SHARED_PROCESS_PATH: sharedProcessPath,
}

const main = () => {
  const cliArgs = process.argv.slice(2)
  const child = spawn(electronLaunch.command, [...electronLaunch.argsPrefix, '--no-sandbox', '.', ...cliArgs], {
    cwd: mainProcessPath,
    env,
  })
  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)
}

main()
