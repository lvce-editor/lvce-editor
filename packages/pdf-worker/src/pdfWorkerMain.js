import * as IpcChild from './parts/IpcChild/IpcChild.js'
import * as IpcChildType from './parts/IpcChildType/IpcChildType.js'
import * as Command from './parts/Command/Command.js'

const main = async () => {
  const ipc = await IpcChild.listen({ method: IpcChildType.Auto() })
  const handleMessage = async (event) => {
    const { data } = event
    const { method, params } = data
    await Command.execute(method, ...params)
  }
  ipc.onmessage = handleMessage
}

main()
