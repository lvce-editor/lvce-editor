import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as Path from '../Path/Path.ts'

export const firaCodePath = dirname(fileURLToPath(import.meta.resolve('@fontsource-variable/fira-code/package.json')))
export const firaCodeFilesPath = Path.join(firaCodePath, 'files')
