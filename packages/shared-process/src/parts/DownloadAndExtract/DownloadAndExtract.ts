import * as NetworkProcess from '../NetworkProcess/NetworkProcess.ts'

export const downloadAndExtractTarGz = async ({ url, outDir, strip }) => {
  return NetworkProcess.invoke('Download.downloadAndExtractTarGz', { url, outDir, strip })
}
