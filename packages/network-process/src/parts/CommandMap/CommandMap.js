import * as ClipBoard from '../ClipBoard/ClipBoard.js'
import * as Download from '../Download/Download.js'
import * as DownloadAndExtract from '../DownloadAndExtract/DownloadAndExtract.js'
import * as Extract from '../Extract/Extract.js'
import * as GetUrl from '../GetUrl/GetUrl.js'
import * as SymLink from '../SymLink/SymLink.js'
import * as TrashNode from '../TrashNode/TrashNode.js'

export const commandMap = {
  'ClipBoard.readFiles': ClipBoard.readFiles,
  'ClipBoard.writeFiles': ClipBoard.writeFiles,
  'Download.download': Download.download,
  'Download.downloadAndExtractTarGz': DownloadAndExtract.downloadAndExtractTarGz,
  'Download.getUrl': GetUrl.getUrl,
  'Extract.extractTarBr': Extract.extractTarBr,
  'Extract.extractTarGz': Extract.extractTarGz,
  'Symlink.createSymLink': SymLink.createSymLink,
  'TrashNode.trash': TrashNode.trash,
}
