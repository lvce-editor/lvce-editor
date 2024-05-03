import * as ClipBoard from '../ClipBoard/ClipBoard.js'
import * as Download from '../Download/Download.js'
import * as DownloadAndExtract from '../DownloadAndExtract/DownloadAndExtract.js'
import * as Extract from '../Extract/Extract.js'
import * as GetUrl from '../GetUrl/GetUrl.js'
import * as HandleElectronMessagePort from '../HandleElectronMessagePort/HandleElectronMessagePort.js'
import * as OpenNativeFolder from '../OpenNativeFolder/OpenNativeFolder.js'
import * as RebuildNodePty from '../RebuildNodePty/RebuildNodePty.js'
import * as SymLink from '../SymLink/SymLink.js'
import * as TmpFile from '../TmpFile/TmpFile.js'
import * as TrashNode from '../TrashNode/TrashNode.js'

export const commandMap = {
  'ClipBoard.readFiles': ClipBoard.readFiles,
  'ClipBoard.writeFiles': ClipBoard.writeFiles,
  'Download.download': Download.download,
  'Download.downloadAndExtractTarGz': DownloadAndExtract.downloadAndExtractTarGz,
  'Download.getUrl': GetUrl.getUrl,
  'Extract.extractTarBr': Extract.extractTarBr,
  'Extract.extractTarGz': Extract.extractTarGz,
  'OpenNativeFolder.openNativeFolder': OpenNativeFolder.openFolder,
  'RebuildNodePty.rebuildNodePty': RebuildNodePty.rebuildNodePty,
  'Symlink.createSymLink': SymLink.createSymLink,
  'TmpFile.getTmpDir': TmpFile.getTmpDir,
  'TmpFile.getTmpFile': TmpFile.getTmpFile,
  'TrashNode.trash': TrashNode.trash,
  'HandleElectronMessagePort.handleElectronMessagePort': HandleElectronMessagePort.handleElectronMessagePort,
}
