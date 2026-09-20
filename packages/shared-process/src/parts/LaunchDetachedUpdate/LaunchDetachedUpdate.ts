import { spawn } from 'node:child_process'
import { closeSync } from 'node:fs'
import * as UpdateLog from '../UpdateLog/UpdateLog.ts'

export const launch = async (path: string, args: readonly string[]): Promise<void> => {
  UpdateLog.write(`Launching installer ${JSON.stringify({ args, path })}`)
  const output = UpdateLog.openOutput()
  try {
    await new Promise<void>((resolve, reject) => {
      const child = spawn(path, args, {
        detached: true,
        stdio: ['ignore', output, output],
        windowsHide: true,
      })
      child.once('error', (error) => {
        UpdateLog.writeSafe(`Installer launch failed: ${error.stack || error.message}`)
        reject(error)
      })
      child.once('spawn', () => {
        UpdateLog.writeSafe(`Installer started pid=${child.pid}; installation outcome is not yet known`)
        child.unref()
        resolve()
      })
      // Available while this process is alive. Absence of this entry is not success.
      child.once('exit', (code, signal) => {
        UpdateLog.writeSafe(`Installer exited pid=${child.pid} code=${code} signal=${signal}`)
      })
    })
  } finally {
    closeSync(output)
  }
}
