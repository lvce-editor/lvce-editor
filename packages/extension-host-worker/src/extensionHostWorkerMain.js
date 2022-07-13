import * as Ipc from './parts/Ipc/Ipc.js'
import * as Api from './parts/Api/Api.js'

const main = () => {
  globalThis.vscode = Api.create()
  Ipc.listen()
}

main()
