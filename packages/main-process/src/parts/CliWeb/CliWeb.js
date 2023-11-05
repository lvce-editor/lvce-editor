import { spawn } from 'node:child_process'
import * as Electron from 'electron'
import * as Platform from '../Platform/Platform.js'
import * as Process from '../Process/Process.js'

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
