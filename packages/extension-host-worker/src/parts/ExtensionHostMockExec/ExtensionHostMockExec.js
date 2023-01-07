import * as Api from '../Api/Api.js'
import * as FunctionFromString from '../FunctionFromString/FunctionFromString.js'
import * as NameAnonymousFunction from '../NameAnonymousFunction/NameAnonymousFunction.js'
import { VError } from '../VError/VError.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as Rpc from '../Rpc/Rpc.js'

class ExecError extends Error {
  constructor(stdout, stderr, exitCode) {
    super(``)
    this.stdout = stdout
    this.stderr = stderr
    this.exitCode = exitCode
  }
}

export const mockExec = () => {
  try {
    Api.api.exec = async (command, args, options) => {
      const result = await JsonRpc.invoke(Rpc.state.ipc, 'Test.executeMockExecFunction', command, args, options)
      const { stdout, stderr, exitCode } = result
      if (exitCode !== 0) {
        throw new ExecError(stdout, stderr, exitCode)
      }
      return { stdout, stderr, exitCode }
    }
  } catch (error) {
    throw new VError(error, `Failed to mock exec function`)
  }
}
