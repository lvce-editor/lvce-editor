import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as Path from '../Path/Path.ts'

export const firaCodePath = dirname(fileURLToPath(import.meta.resolve('@fontsource/fira-code/400.css')))
export const firaCodeFilesPath = Path.join(firaCodePath, 'files')
