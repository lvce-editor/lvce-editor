import * as NetworkProcess from '../NetworkProcess/NetworkProcess.ts'

export const createSymLink = (target: any, path: any): any => {
  return NetworkProcess.invoke('Symlink.createSymLink', target, path)
}
