import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const sharedProcessPath = join(__dirname, 'src', 'sharedProcessMain.js')

export const exportStatic = async ({
  extensionPath = process.cwd(),
  testPath = '',
} = {}) => {
  const fn = await import('./src/parts/ExportStatic/ExportStatic.js')
  const root = process.cwd()
  if (extensionPath !== root) {
    extensionPath = join(root, extensionPath)
  }
  const pathPrefix = process.env.PATH_PREFIX || ''
  await fn.exportStatic({ root, pathPrefix, extensionPath, testPath })
}
