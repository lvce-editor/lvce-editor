import { join } from 'path'
import * as CodiconsPath from '../CodiconsPath/CodiconsPath.js'
import * as Path from '../Path/Path.js'
import { STATIC } from '../Static/Static.js'
import { root } from '../Root/Root.js'

const invalidIconsPath = join(STATIC, '__missing_vscode_icon__.svg')

const getVsCodeIconAbsolutePath = (pathName) => {
  const relativePath = pathName.startsWith('/static/icons/') ? pathName.slice('/static/icons/'.length) : pathName.slice('/icons/'.length)
  if (!relativePath || relativePath.includes('/') || relativePath.includes('\\') || relativePath.includes('..')) {
    return invalidIconsPath
  }
  return join(CodiconsPath.codiconsIconsPath, relativePath)
}

export const getAbsolutePath = (pathName) => {
  if (pathName === '/') {
    return join(STATIC, 'index.html')
  }
  if (pathName === '/favicon.ico') {
    return join(STATIC, 'favicon.ico')
  }
  if (pathName.startsWith('/icons/') || pathName.startsWith('/static/icons/')) {
    return getVsCodeIconAbsolutePath(pathName)
  }
  if (pathName.startsWith('/packages')) {
    return Path.join(root, pathName)
  }
  return Path.join(STATIC, pathName)
}
