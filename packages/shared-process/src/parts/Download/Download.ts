import * as NetworkProcess from '../NetworkProcess/NetworkProcess.ts'

export const download = async (url, outFile) => {
  return NetworkProcess.invoke('Download.download', url, outFile)
}
