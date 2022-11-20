import * as ExtensionHostHelperProcess from '../ExtensionHostHelperProcess/ExtensionHostHelperProcess.js'

class ExecError extends Error {
  constructor(stdout, stderr, exitCode) {
    super(`Failed to execute`)
    this.stdout = stdout
    this.stderr = stderr
    this.exitCode = exitCode
  }
}

export const exec = async (command, args, options) => {
  const { stdout, stderr, exitCode } = await ExtensionHostHelperProcess.invoke(
    'Exec.exec',
    command,
    args
  )
  if (exitCode !== 0) {
    throw new ExecError(stdout, stderr, exitCode)
  }
  return {
    stdout,
    stderr,
    exitCode,
  }
}
