import * as ClipBoard from './ClipBoard.js'

export const name = 'ClipBoard'

export const Commands = {
  disableMemoryClipBoard: ClipBoard.disableMemoryClipBoard,
  enableMemoryClipBoard: ClipBoard.enableMemoryClipBoard,
  execCopy: ClipBoard.execCopy,
  getSelectionText: ClipBoard.getSelectionText,
  hotReload: ClipBoard.hotReload,
  readMemoryText: ClipBoard.readMemoryText,
  readNativeFiles: ClipBoard.readNativeFiles,
  readText: ClipBoard.readText,
  writeImage: ClipBoard.writeImage,
  writeNativeFiles: ClipBoard.writeNativeFiles,
  writeText: ClipBoard.writeText,
}
