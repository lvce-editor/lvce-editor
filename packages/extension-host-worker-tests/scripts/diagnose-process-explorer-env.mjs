import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const exec = promisify(execFile)
for (const [name, env] of [['inherited', process.env], ['stripped', { XDG_CONFIG_HOME: process.env.TEMP }]]) {
  const start = Date.now()
  try {
    const { stdout } = await exec('powershell.exe', ['-NoProfile', '-Command', `(Get-CimInstance Win32_Process -Filter "ProcessId = ${process.pid}").ParentProcessId`], { env, timeout: 10000 })
    console.info('[DEBUG-process-explorer-env]', name, Date.now() - start, stdout.trim())
  } catch (error) {
    console.info('[DEBUG-process-explorer-env]', name, Date.now() - start, error.code, error.killed)
  }
}
