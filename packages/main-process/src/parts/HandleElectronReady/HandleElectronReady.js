import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const handleReady = async (parsedArgs, workingDirectory) => {
  await SharedProcess.send('HandleElectronReady.handleElectronReady', parsedArgs, workingDirectory)
}
