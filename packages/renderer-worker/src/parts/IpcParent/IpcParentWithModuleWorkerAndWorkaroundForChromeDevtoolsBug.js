import * as WorkerType from '../WorkerType/WorkerType.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const create = async ({ url, name }) => {
  try {
    RendererProcess.send({
      jsonrpc: '2.0',
      method: 'get-port',
      params: [
        'worker',
        { method: /* ModuleWorkerWithMessagePort */ 4, url, name },
      ],
    })
    await new Promise((resolve) => {})
  } catch (error) {
    throw error
  }
}
