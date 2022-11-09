import * as ClipBoard from './ClipBoard.js'

export const name = 'ClipBoard'

export const Commands = {
  execCopy: ClipBoard.execCopy,
  readNativeFiles: ClipBoard.readNativeFiles,
  readText: ClipBoard.readText,
  writeImage: ClipBoard.writeImage,
  writeNativeFiles: ClipBoard.writeNativeFiles,
  writeText: ClipBoard.writeText,
}
