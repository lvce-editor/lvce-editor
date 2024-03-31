import * as Api from '../Api/Api.ts'
import { ExecError } from '../ExecError/ExecError.ts'
import * as Rpc from '../Rpc/Rpc.ts'
import { VError } from '../VError/VError.ts'

export const mockExec = () => {
  try {
    // @ts-ignore
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
