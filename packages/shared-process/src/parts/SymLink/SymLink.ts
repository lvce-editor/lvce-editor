import * as NetworkProcess from '../NetworkProcess/NetworkProcess.ts'

export const createSymLink = (target, path) => {
  return NetworkProcess.invoke('Symlink.createSymLink', target, path)
}
