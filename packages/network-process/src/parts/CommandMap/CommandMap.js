import * as Download from '../Download/Download.js'
import * as DownloadAndExtract from '../DownloadAndExtract/DownloadAndExtract.js'
import * as Extract from '../Extract/Extract.js'
import * as GetUrl from '../GetUrl/GetUrl.js'
import * as HandleElectronMessagePort from '../HandleElectronMessagePort/HandleElectronMessagePort.js'

export const commandMap = {
  'Download.download': Download.download,
  'Download.downloadAndExtractTarGz': DownloadAndExtract.downloadAndExtractTarGz,
  'Download.getUrl': GetUrl.getUrl,
  'Extract.extractTarBr': Extract.extractTarBr,
  'Extract.extractTarGz': Extract.extractTarGz,
  'HandleElectronMessagePort.handleElectronMessagePort': HandleElectronMessagePort.handleElectronMessagePort,
}
