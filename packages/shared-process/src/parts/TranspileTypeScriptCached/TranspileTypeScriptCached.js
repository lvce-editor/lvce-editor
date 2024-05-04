import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import * as Hash from '../Hash/Hash.js'
import * as TypeScriptCompileCachePath from '../TypeScriptCompileCachePath/TypeScriptCompileCachePath.js'
import * as TypeScriptCompileProcess from '../TypeScriptCompileProcess/TypeScriptCompileProcess.js'

export const transpileTypeScript = async (code) => {
  const hash = Hash.fromString(code)
  const cachePath = join(TypeScriptCompileCachePath.typescriptCompileCachePath, `${hash}.ts`)
  if (!existsSync(cachePath)) {
    const content = await TypeScriptCompileProcess.invoke('TranspileTypeScript.transpileTypeScript', code)
    await writeFile(cachePath, content)
  }
  const content = await readFile(cachePath, 'utf8')
  return content
}
