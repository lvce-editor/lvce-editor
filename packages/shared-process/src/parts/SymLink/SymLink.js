import * as NetworkProcess from '../NetworkProcess/NetworkProcess.js'

export const createSymLink = (target, path) => {
  return NetworkProcess.invoke('Symlink.createSymLink', target, path)
}
