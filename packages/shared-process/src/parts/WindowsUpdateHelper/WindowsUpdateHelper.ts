import { execFile } from 'node:child_process'
import { join } from 'node:path'
import { promisify } from 'node:util'

const encode = (script: string): string => Buffer.from(script, 'utf16le').toString('base64')

const bootstrap = String.raw`
$ErrorActionPreference = 'Stop'
$child = Start-Process -FilePath (Join-Path $PSHOME 'powershell.exe') -ArgumentList @('-NoProfile', '-NonInteractive', '-EncodedCommand', $env:LVCE_UPDATE_SCRIPT) -WorkingDirectory (Get-Location).Path -WindowStyle Hidden -PassThru
Write-Output $child.Id
`

export const launch = async (script: string, planPath: string, cwd: string): Promise<number> => {
  // Windows PowerShell exits without executing when launched with Node's
  // DETACHED_PROCESS flag. Start-Process gives it its own hidden console so it
  // executes normally and survives even a console parent's termination.
  // Output must be separate from the phase log: .NET AppendAllText cannot open
  // a file also held open as redirected stdout/stderr on Windows.
  const wrapped = `$ErrorActionPreference = 'Stop'\ntry { & {\n${script}\n} *>&1 | Out-File -LiteralPath ($env:LVCE_UPDATE_PLAN + '.output.log') -Encoding utf8 } catch { [IO.File]::AppendAllText($env:LVCE_UPDATE_PLAN + '.output.log', ($_ | Out-String)); exit 1 }`
  const { stdout } = await promisify(execFile)(
    join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe'),
    ['-NoProfile', '-NonInteractive', '-EncodedCommand', encode(bootstrap)],
    {
      cwd,
      env: { ...process.env, LVCE_UPDATE_PLAN: planPath, LVCE_UPDATE_SCRIPT: encode(wrapped) },
      timeout: 15000,
      windowsHide: true,
    },
  )
  const pid = Number(stdout.trim())
  if (!Number.isSafeInteger(pid) || pid <= 0) {
    throw new Error('Windows update helper did not return a valid process id')
  }
  return pid
}

export const isRunning = (pid: number): boolean => {
  try {
    process.kill(pid, 0)
    return true
  } catch {
    return false
  }
}
