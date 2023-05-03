import * as GetSuccessResponse from './parts/GetSuccessResponse/GetSuccessResponse.js'
import * as ImportScript from './parts/ImportScript/ImportScript.js'
import * as IpcChild from './parts/IpcChild/IpcChild.js'
import * as IpcChildType from './parts/IpcChildType/IpcChildType.js'
import * as Rpc from './parts/Rpc/Rpc.js'

const waitForFirstMessage = async (ipc) => {
  const { message } = await new Promise((resolve) => {
    const cleanup = (value) => {
      ipc.off('message', handleMessage)
      resolve(value)
    }
    const handleMessage = (message) => {
      cleanup({ message })
    }
    ipc.on('message', handleMessage)
  })
  return message
}

const main = async () => {
  const ipcChildType = await IpcChildType.Auto()
  const ipc = await IpcChild.listen({ method: ipcChildType })
  const firstMessage = await waitForFirstMessage(ipc)
  let module
  try {
    console.log({ firstMessage })
    module = await ImportScript.importScript(firstMessage.params[0])
    if (!module || !module.execute) {
      throw new Error(`missing export const execute function`)
    }
    const response = GetSuccessResponse.getSuccessResponse(firstMessage, null)
    ipc.send(response)
  } catch (error) {
    console.log({ error })
    const GetErrorResponse = await import('./parts/GetErrorResponse/GetErrorResponse.js')
    const response = await GetErrorResponse.getErrorResponse(firstMessage, error)
    ipc.send(response)
    return
  }
  Rpc.listen(ipc, module.execute)
}

main()
