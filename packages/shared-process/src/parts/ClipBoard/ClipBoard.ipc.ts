import * as ClipBoard from './ClipBoard.ts'

export const name = 'ClipBoard'

export const Commands = {
  readFiles: ClipBoard.readFiles,
  writeFiles: ClipBoard.writeFiles,
}
