import * as Download from '../Download/Download.js'
import * as DownloadAndExtract from '../DownloadAndExtract/DownloadAndExtract.js'
import * as GetUrl from '../GetUrl/GetUrl.js'
import * as HandleElectronMessagePort from '../HandleElectronMessagePort/HandleElectronMessagePort.js'

export const commandMap = {
  'Download.downloadAndExtractTarGz': DownloadAndExtract.downloadAndExtractTarGz,
  'Download.download': Download.download,
  'Download.getUrl': GetUrl.getUrl,
  'HandleElectronMessagePort.handleElectronMessagePort': HandleElectronMessagePort.handleElectronMessagePort,
}
