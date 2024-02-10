import * as InternalCommand from './parts/InternalCommand/InternalCommand.js'
import * as SharedProcess from './parts/SharedProcess/SharedProcess.js'

const main = async () => {
  await SharedProcess.listen(InternalCommand)
}

main()
