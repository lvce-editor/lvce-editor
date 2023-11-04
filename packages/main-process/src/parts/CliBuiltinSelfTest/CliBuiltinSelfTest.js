import { fork } from 'node:child_process'
import Electron from 'electron'
import Platform from '../Platform/Platform.js'

export const handleCliArgs = (parsedArgs) => {
  const builtinSelfTestPath = Platform.getBuiltinSelfTestPath()
  const child = fork(builtinSelfTestPath, {
    stdio: 'inherit',
    env: {
      ...process.env,
    },
  })
  child.on('exit', () => {
    Electron.app.quit()
  })
  return true
}
