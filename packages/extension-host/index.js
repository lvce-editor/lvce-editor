import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const extensionHostPath = join(__dirname, 'src', 'extensionHostMain.js')
