import * as Command from './parts/Command/Command.js'
import * as Rpc from './parts/Rpc/Rpc.js'

const main = async () => {
  await Rpc.start({ Command })
}

main()
