import * as NetworkProcess from '../NetworkProcess/NetworkProcess.ts'

export const download = async (url: any, outFile: any): Promise<any> => {
  return NetworkProcess.invoke('Download.download', url, outFile)
}
