import * as ClipBoard from './ClipBoard.ts'

export const name = 'ClipBoard'

export const Commands = {
  execCopy: ClipBoard.execCopy,
  readText: ClipBoard.readText,
  writeImage: ClipBoard.writeImage,
  writeText: ClipBoard.writeText,
}
