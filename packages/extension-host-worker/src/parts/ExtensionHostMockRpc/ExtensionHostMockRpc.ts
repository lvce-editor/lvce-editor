import * as Api from '../Api/Api.ts'
import * as Rpc from '../Rpc/Rpc.ts'
import { VError } from '../VError/VError.ts'

export const mockRpc = () => {
  // @ts-ignore
  Api.api.createNodeRpc = async (options) => {
    try {
      return {
        async invoke(method, ...params) {
          const result = await Rpc.invoke('Test.executeMockRpcFunction', options.name, method, ...params)
          return result
        },
      }
    } catch (error) {
      throw new VError(error, 'Failed to mock exec function')
    }
  }
}
