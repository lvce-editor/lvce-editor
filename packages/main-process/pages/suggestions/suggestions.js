import * as Ipc from './Ipc.js'

const main = async () => {
  const port = await Ipc.initialize()
  console.log({ port })
}

main()
