import * as NetworkProcess from '../NetworkProcess/NetworkProcess.js'

export const readFiles = () => {
  return NetworkProcess.invoke('ClipBoard.readFiles')
}

export const writeFiles = (type, files) => {
  return NetworkProcess.invoke('ClipBoard.writeFiles', type, files)
}
