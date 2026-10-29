import { existsSync } from 'node:fs'
import * as Path from '../Path/Path.ts'

const candidates = [Path.absolute('packages/build/node_modules/@fontsource/fira-code'), Path.absolute('node_modules/@fontsource/fira-code')]

export const firaCodePath = candidates.find(existsSync) || candidates[0]
export const firaCodeFilesPath = Path.join(firaCodePath, 'files')
