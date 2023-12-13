import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const handleWindowAllClosed = async () => {
  SharedProcess.send('HandleWindowAllClosed.handleWindowAllClosed')
}
