import * as Command from './parts/Command/Command.js'
import * as IpcChild from './parts/IpcChild/IpcChild.js'
import * as IpcChildType from './parts/IpcChildType/IpcChildType.js'
import * as Rpc from './parts/Rpc/Rpc.js'
import * as LoadFile from './parts/LoadFile/LoadFile.js'
import * as GetErrorResponse from './parts/GetErrorResponse/GetErrorResponse.js'
import * as GetSuccessResponse from './parts/GetSuccessResponse/GetSuccessResponse.js'

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
  const ipc = await IpcChild.listen({ method: IpcChildType.Auto() })
  const firstMessage = await waitForFirstMessage(ipc)
  let module
  try {
    module = await LoadFile.loadFile(firstMessage.params[0])
    if (!module || !module.execute) {
      throw new Error(`missing export const execute function`)
    }
    const response = GetSuccessResponse.getSuccessResponse(firstMessage, null)
    ipc.send(response)
  } catch (error) {
    const response = await GetErrorResponse.getErrorResponse(firstMessage, error)
    ipc.send(response)
    return
  }
  Rpc.listen(ipc, module.execute)
}

main()
