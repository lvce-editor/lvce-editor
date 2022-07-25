import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const ptyHostPath = join(__dirname, 'src', 'ptyHostMain.js')
