import { isAbsolute, join } from 'node:path'

const __dirname = import.meta.dirname

export const sharedProcessPath = join(__dirname, 'src', 'sharedProcessMain.js')

export const exportStatic = async ({ extensionPath = process.cwd(), testPath = '', root = '' } = {}) => {
  if (!root) {
    throw new Error(`root argument is required`)
  }
  const fn = await import('./src/parts/ExportStatic/ExportStatic.js')
  if (extensionPath && extensionPath !== root && !isAbsolute(extensionPath)) {
    extensionPath = join(root, extensionPath)
  }
  const pathPrefix = process.env.PATH_PREFIX || ''
  return fn.exportStatic({ root, pathPrefix, extensionPath, testPath })
}
