import * as Api from '../Api/Api.js'
import * as Rpc from '../Rpc/Rpc.js'
import { VError } from '../VError/VError.js'

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
