import * as Ipc from './parts/Ipc/Ipc.js'
import * as Api from './parts/Api/Api.js'

const main = () => {
  console.log('ext host worker started')
  globalThis.vscode = Api.vscode
  Ipc.listen()
}

main()
