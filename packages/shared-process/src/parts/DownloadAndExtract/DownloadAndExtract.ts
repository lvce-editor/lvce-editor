import * as NetworkProcess from '../NetworkProcess/NetworkProcess.ts'

export const downloadAndExtractTarGz = async ({ outDir, strip, url }: any): Promise<any> => {
  return NetworkProcess.invoke('Download.downloadAndExtractTarGz', { outDir, strip, url })
}
