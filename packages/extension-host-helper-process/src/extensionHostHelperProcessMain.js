import * as IpcChild from './parts/IpcChild/IpcChild.js'
import * as IpcChildType from './parts/IpcChildType/IpcChildType.js'

const main = async () => {
  await IpcChild.listen({ method: IpcChildType.Auto() })
}

main()
