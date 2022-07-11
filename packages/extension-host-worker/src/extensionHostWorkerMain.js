import * as Ipc from './parts/Ipc/Ipc.js'

const main = () => {
  console.log('ext host worker started')
  Ipc.listen()
}

main()
