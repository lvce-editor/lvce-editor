import * as NetworkProcess from '../NetworkProcess/NetworkProcess.js'

export const downloadAndExtractTarGz = async ({ url, outDir, strip }) => {
  return NetworkProcess.invoke('Download.downloadAndExtractTarGz', { url, outDir, strip })
}
