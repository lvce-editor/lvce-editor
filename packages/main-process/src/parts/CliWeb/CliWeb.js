import { spawn } from 'node:child_process'
import * as Platform from '../Platform/Platform.cjs'
import * as Electron from 'electron'
import * as Process from '../Process/Process.cjs'

export const handleCliArgs = (parsedArgs) => {
  const webPath = Platform.getWebPath()
  const child = spawn(Process.argv[0], [webPath], {
    stdio: 'inherit',
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: '1',
    },
  })
  child.on('exit', () => {
    Electron.app.quit()
  })
  return true
}
