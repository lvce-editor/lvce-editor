import * as Api from '../Api/Api.js'
import * as FunctionFromString from '../FunctionFromString/FunctionFromString.js'
import * as NameAnonymousFunction from '../NameAnonymousFunction/NameAnonymousFunction.js'
import { VError } from '../VError/VError.js'

class ExecError extends Error {
  constructor(stdout, stderr, exitCode) {
    super(``)
    this.stdout = stdout
    this.stderr = stderr
    this.exitCode = exitCode
  }
}

export const mockExec = (fnString) => {
  try {
    const fn = FunctionFromString.create(fnString)
    NameAnonymousFunction.nameAnonymousFunction(fn, 'mockExec')
    // @ts-ignore
    Api.api.exec = async (command, args, options) => {
      const { stdout, stderr, exitCode } = await fn(command, args, options)
      if (exitCode !== 0) {
        throw new ExecError(stdout, stderr, exitCode)
      }
      return { stdout, stderr, exitCode }
    }
  } catch (error) {
    throw new VError(error, `Failed to mock exec function`)
  }
}
