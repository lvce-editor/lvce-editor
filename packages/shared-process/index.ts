import { isAbsolute, join } from 'node:path'

const __dirname = import.meta.dirname

export const sharedProcessPath = join(__dirname, 'src', 'sharedProcessMain.ts')

const toArray = (value: any): any => {
  if (!value) {
    return []
  }
  if (Array.isArray(value)) {
    return value
  }
  return [value]
}

const toAbsoluteExtensionPath = (root: any, extensionPath: any): any => {
  if (extensionPath && extensionPath !== root && !isAbsolute(extensionPath)) {
    return join(root, extensionPath)
  }
  return extensionPath
}

/**
 * @param {{extensionPath?: string, extensionPaths?: string[] | string, testPath?: string, root?: string}} [options]
 */
export const exportStatic = async (options: any = {}): Promise<any> => {
  const { extensionPath, extensionPaths = [], root = '', testPath = '' } = options
  if (!root) {
    throw new Error(`root argument is required`)
  }
  const fn = await import('./src/parts/ExportStatic/ExportStatic.ts')
  const extensionPathList = toArray(extensionPaths)
  const defaultExtensionPath = extensionPath === undefined && extensionPathList.length === 0 ? process.cwd() : extensionPath
  const absoluteExtensionPath = toAbsoluteExtensionPath(root, defaultExtensionPath)
  const absoluteExtensionPaths = extensionPathList.map((extensionPath: any) => toAbsoluteExtensionPath(root, extensionPath))
  const pathPrefix = process.env.PATH_PREFIX || ''
  return fn.exportStatic({ extensionPath: absoluteExtensionPath, extensionPaths: absoluteExtensionPaths, pathPrefix, root, testPath })
}
