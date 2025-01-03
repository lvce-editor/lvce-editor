import { join } from 'path'
import * as Path from '../Path/Path.js'
import { STATIC } from '../Static/Static.js'

export const getAbsolutePath = (pathName) => {
  if (pathName === '/') {
    return join(STATIC, 'index.html')
  }
  if (pathName === '/favicon.ico') {
    return join(STATIC, 'favicon.ico')
  }
  return Path.join(STATIC, pathName)
}
