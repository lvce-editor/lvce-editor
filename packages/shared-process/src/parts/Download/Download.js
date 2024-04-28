import * as NetworkProcess from '../NetworkProcess/NetworkProcess.js'

export const download = async (url, outFile) => {
  return NetworkProcess.invoke('Download.download', url, outFile)
}
