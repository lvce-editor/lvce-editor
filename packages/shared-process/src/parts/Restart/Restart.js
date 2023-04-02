import { spawn } from 'node:child_process'

export const restart = (downloadPath) => {
  // TODO handle errors
  spawn(downloadPath, { stdio: 'inherit' })
}
