export class ExecError extends Error {
  constructor(command, args, stdout, stderr, exitCode) {
    super(`Failed to execute ${command}: process exited with code ${exitCode}`)
    this.name = 'ExecError'
    this.stdout = stdout
    this.stderr = stderr
    this.exitCode = exitCode
  }
}
