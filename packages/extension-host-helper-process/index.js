import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const extensionHostHelperProcessPath = join(
  __dirname,
  'src',
  'extensionHostHelperProcessMain.js'
)
