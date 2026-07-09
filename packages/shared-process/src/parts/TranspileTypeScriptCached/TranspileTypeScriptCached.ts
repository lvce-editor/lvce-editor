import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import * as Hash from '../Hash/Hash.ts'
import * as TypeScriptCompileCachePath from '../TypeScriptCompileCachePath/TypeScriptCompileCachePath.ts'
import * as TypeScriptCompileProcess from '../TypeScriptCompileProcess/TypeScriptCompileProcess.ts'

export const transpileTypeScriptCached = async (code: any): Promise<any> => {
  const hash = Hash.fromString(code)
  const cachePath = join(TypeScriptCompileCachePath.typescriptCompileCachePath, `${hash}.ts`)
  if (!existsSync(cachePath)) {
    const { outputText } = await TypeScriptCompileProcess.invoke('TranspileTypeScript.transpileTypeScript', code)
    await mkdir(dirname(cachePath), { recursive: true })
    await writeFile(cachePath, outputText)
  }
  const content = await readFile(cachePath, 'utf8')
  return {
    outputText: content,
    diagnostics: [],
  }
}
