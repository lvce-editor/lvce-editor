import { spawn } from 'node:child_process'

export const restart = (downloadPath) => {
  const { ELECTRON_RUN_AS_NODE, ...env } = process.env
  // TODO handle errors
  const childProcess = spawn(downloadPath, {
    stdio: 'inherit',
    env,
  })
  childProcess.unref()
}
