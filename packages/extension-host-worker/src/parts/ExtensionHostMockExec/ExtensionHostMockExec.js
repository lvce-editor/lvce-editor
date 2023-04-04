import * as Api from '../Api/Api.js'
import { ExecError } from '../ExecError/ExecError.js'
import * as Rpc from '../Rpc/Rpc.js'
import { VError } from '../VError/VError.js'

export const mockExec = () => {
  try {
    Api.api.exec = async (command, args, options) => {
      const result = await Rpc.invoke('Test.executeMockExecFunction', command, args, options)
      const { stdout, stderr, exitCode } = result
      if (exitCode !== 0) {
        throw new ExecError(command, args, stdout, stderr, exitCode)
      }
      return { stdout, stderr, exitCode }
    }
  } catch (error) {
    throw new VError(error, 'Failed to mock exec function')
  }
}
