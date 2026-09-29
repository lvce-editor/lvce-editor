import { spawn } from 'node:child_process'

export const restart = (downloadPath: any): any => {
  const { ELECTRON_RUN_AS_NODE, ...env } = process.env
  // TODO handle errors
  const childProcess = spawn(downloadPath, {
    env,
    stdio: 'inherit',
  })
  childProcess.unref()
}
