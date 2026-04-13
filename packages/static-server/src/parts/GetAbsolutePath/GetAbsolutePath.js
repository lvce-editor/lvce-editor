import { existsSync } from 'node:fs'
import { join } from 'path'
import * as CodiconsPath from '../CodiconsPath/CodiconsPath.js'
import * as Path from '../Path/Path.js'
import { STATIC } from '../Static/Static.js'
import { root } from '../Root/Root.js'

const invalidIconsPath = join(STATIC, '__missing_vscode_icon__.svg')

const getIconAbsolutePath = (pathName) => {
  const relativePath = pathName.startsWith('/static/icons/') ? pathName.slice('/static/icons/'.length) : pathName.slice('/icons/'.length)
  if (!relativePath || relativePath.includes('/') || relativePath.includes('\\') || relativePath.includes('..')) {
    return invalidIconsPath
  }
  const codiconPath = join(CodiconsPath.codiconsIconsPath, relativePath)
  if (existsSync(codiconPath)) {
    return codiconPath
  }
  const staticIconPath = join(STATIC, 'icons', relativePath)
  if (existsSync(staticIconPath)) {
    return staticIconPath
  }
  return invalidIconsPath
}

export const getAbsolutePath = (pathName) => {
  if (pathName === '/') {
    return join(STATIC, 'index.html')
  }
  if (pathName === '/favicon.ico') {
    return join(STATIC, 'favicon.ico')
  }
  if (pathName.startsWith('/icons/') || pathName.startsWith('/static/icons/')) {
    return getIconAbsolutePath(pathName)
  }
  if (pathName.startsWith('/packages')) {
    return Path.join(root, pathName)
  }
  return Path.join(STATIC, pathName)
}
