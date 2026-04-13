import { existsSync } from 'node:fs'
import * as Path from '../Path/Path.js'

const codiconsPathCandidates = [
  Path.absolute('packages/renderer-worker/node_modules/@vscode/codicons'),
  Path.absolute('node_modules/@vscode/codicons'),
]

const getCodiconsPath = () => {
  for (const candidate of codiconsPathCandidates) {
    if (existsSync(candidate)) {
      return candidate
    }
  }
  return codiconsPathCandidates[0]
}

export const codiconsPath = getCodiconsPath()

export const codiconsIconsPath = Path.join(codiconsPath, 'src', 'icons')
