export class ExecError extends Error {
  constructor(command, args, stdout, stderr, exitCode) {
    super(`Failed to execute ${command}: process exited with code ${exitCode}`)
    this.name = 'ExecError'
    // @ts-ignore
    this.stdout = stdout
    // @ts-ignore
    this.stderr = stderr
    // @ts-ignore
    this.exitCode = exitCode
  }
}
