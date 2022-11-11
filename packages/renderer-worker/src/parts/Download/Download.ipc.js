import * as Download from './Download.js'

export const name = 'Download'

export const Commands = {
  downloadFile: Download.downloadFile,
  downloadJson: Download.downloadJson,
  downloadToDownloadsFolder: Download.downloadToDownloadsFolder,
}
