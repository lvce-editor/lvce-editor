import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { root } from '../Root/Root.js'

const codiconsPathCandidates = [
  join(root, 'packages', 'renderer-worker', 'node_modules', '@vscode', 'codicons'),
  join(root, 'node_modules', '@vscode', 'codicons'),
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

export const codiconsIconsPath = join(codiconsPath, 'src', 'icons')
