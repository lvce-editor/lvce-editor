import { existsSync } from 'node:fs'
import { isAbsolute, join, relative, resolve, sep } from 'node:path'
import * as CodiconsPath from '../CodiconsPath/CodiconsPath.ts'
import { STATIC } from '../Static/Static.ts'
import { root } from '../Root/Root.ts'

const invalidIconsPath = join(STATIC, '__missing_vscode_icon__.svg')
const invalidStaticPath = join(STATIC, '__invalid_path__')

const getContainedPath = (basePath: string, pathName: string): string => {
  let decodedPathName
  try {
    decodedPathName = decodeURIComponent(pathName)
  } catch {
    return invalidStaticPath
  }
  const absolutePath = resolve(basePath, decodedPathName.replace(/^[/\\]+/, ''))
  const relativePath = relative(basePath, absolutePath)
  if (relativePath === '..' || relativePath.startsWith(`..${sep}`) || isAbsolute(relativePath)) {
    return invalidStaticPath
  }
  return absolutePath
}

const getIconAbsolutePath = (pathName: string): string => {
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

export const getAbsolutePath = (pathName: string): string => {
  if (pathName === '/') {
    return join(STATIC, 'index.html')
  }
  if (pathName === '/auth/callback') {
    return join(STATIC, 'auth', 'callback.html')
  }
  if (pathName === '/favicon.ico') {
    return join(STATIC, 'favicon.ico')
  }
  if (pathName.startsWith('/icons/') || pathName.startsWith('/static/icons/')) {
    return getIconAbsolutePath(pathName)
  }
  if (pathName.startsWith('/packages')) {
    return getContainedPath(root, pathName)
  }
  return getContainedPath(STATIC, pathName)
}
