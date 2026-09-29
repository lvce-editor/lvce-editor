import * as NetworkProcess from '../NetworkProcess/NetworkProcess.ts'

export const readFiles = (): any => {
  return NetworkProcess.invoke('ClipBoard.readFiles')
}

export const writeFiles = (type: any, files: any): any => {
  return NetworkProcess.invoke('ClipBoard.writeFiles', type, files)
}
