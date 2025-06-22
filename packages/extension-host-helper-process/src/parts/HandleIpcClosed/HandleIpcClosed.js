import * as Exit from '../Exit/Exit.js'

export const handleIpcClosed = () => {
  Exit.exit()
}
