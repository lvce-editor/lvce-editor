import * as ClipBoard from '../ClipBoard/ClipBoard.js'
import * as Download from '../Download/Download.js'
import * as DownloadAndExtract from '../DownloadAndExtract/DownloadAndExtract.js'
import * as Extract from '../Extract/Extract.js'
import * as GetUrl from '../GetUrl/GetUrl.js'
import * as SymLink from '../SymLink/SymLink.js'

export const commandMap = {
  'Download.download': Download.download,
  'Download.downloadAndExtractTarGz': DownloadAndExtract.downloadAndExtractTarGz,
  'Download.getUrl': GetUrl.getUrl,
  'Extract.extractTarBr': Extract.extractTarBr,
  'Extract.extractTarGz': Extract.extractTarGz,
  'Symlink.createSymLink': SymLink.createSymLink,
  'ClipBoard.readFiles': ClipBoard.readFiles,
  'ClipBoard.writeFiles': ClipBoard.writeFiles,
}
