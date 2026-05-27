import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as Path from '../Path/Path.js'
import * as Process from '../Process/Process.js'

const getCliLinkArgs = () => {
  const links = []
  const argv = Process.argv.slice(2)
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--link') {
      const value = argv[i + 1]
      links.push({
        path: value || '',
        source: '--link',
      })
      i++
      continue
    }
    if (arg.startsWith('--link=')) {
      links.push({
        path: arg.slice('--link='.length),
        source: '--link',
      })
    }
  }
  return links
}

const resolveLinkPath = (path) => {
  if (Path.isAbsolute(path)) {
    return path
  }
  return Path.join(Process.cwd(), path)
}

export const getLinkedExtensions = () => {
  return getCliLinkArgs().map((link) => {
    return {
      ...link,
      resolvedPath: resolveLinkPath(link.path),
    }
  })
}

const createMissingPathError = (link) => {
  const error = new Error(`Failed to start: ${link.source} requires a folder path`)
  // @ts-ignore
  error.code = ErrorCodes.ENOENT
  return error
}

const createPathNotFoundError = (link) => {
  const message = link.path === link.resolvedPath ? link.path : `${link.path} (resolved to ${link.resolvedPath})`
  const error = new Error(`Failed to start: ${link.source} path does not exist: ${message}`)
  // @ts-ignore
  error.code = ErrorCodes.ENOENT
  return error
}

export const validate = async () => {
  const links = getLinkedExtensions()
  for (const link of links) {
    if (!link.path) {
      throw createMissingPathError(link)
    }
    if (!(await FileSystem.exists(link.resolvedPath))) {
      throw createPathNotFoundError(link)
    }
  }
  return links
}
