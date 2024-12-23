import * as GetProtocol from '../GetProtocol/GetProtocol.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const getRealUri = (pathOrUri) => {
  const protocol = GetProtocol.getProtocol(pathOrUri)
  if (protocol) {
    return pathOrUri
  }
  return SharedProcess.invoke('FileSystem.getRealUri', pathOrUri)
}
