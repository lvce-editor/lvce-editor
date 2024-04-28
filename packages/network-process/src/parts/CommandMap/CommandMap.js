import * as Download from '../Download/Download.js'
import * as DownloadAndExtract from '../DownloadAndExtract/DownloadAndExtract.js'
import * as GetJson from '../GetJson/GetJson.js'

export const commandMap = {
  'Download.downloadAndExtractTarGz': DownloadAndExtract.downloadAndExtractTarGz,
  'Download.download': Download.download,
  'Download.getJson': GetJson.getJson,
}
