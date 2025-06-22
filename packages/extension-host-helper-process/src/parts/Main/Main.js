import * as ProcessListeners from '../ProcessListeners/ProcessListeners.js'
import * as Listen from '../Listen/Listen.js'

export const main = async () => {
  process.on('disconnect', ProcessListeners.handleDisconnect)
  await Listen.listen(process.argv)
}
