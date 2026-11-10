import { join } from 'node:path'
import * as Root from '../Root/Root.ts'

export const typeScriptLanguageServerPath = join(
  Root.root,
  'packages',
  'shared-process',
  'language-servers',
  'typescript',
  'lib',
  process.platform === 'win32' ? 'tsc.exe' : 'tsc',
)
