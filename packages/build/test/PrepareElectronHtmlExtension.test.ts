import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, test } from '@jest/globals'
import { prepareElectronHtmlExtension } from '../src/parts/PrepareElectronHtmlExtension/PrepareElectronHtmlExtension.ts'

test('deduplicates TypeScript and rewrites both HTML worker entry points', async () => {
  const extensionsPath = await mkdtemp(join(tmpdir(), 'lvce-electron-html-extension-'))
  const htmlExtensionPath = join(extensionsPath, 'builtin.language-features-html')
  const sourcePath = join(htmlExtensionPath, 'html-worker', 'src', 'parts', 'TypeScriptPath', 'TypeScriptPath.js')
  const bundlePath = join(htmlExtensionPath, 'html-worker', 'dist', 'htmlWorkerMain.js')
  const typeScriptPath = join(htmlExtensionPath, 'typescript', 'lib', 'typescript-esm.js')

  try {
    await mkdir(join(sourcePath, '..'), { recursive: true })
    await mkdir(join(bundlePath, '..'), { recursive: true })
    await mkdir(join(typeScriptPath, '..'), { recursive: true })
    await writeFile(
      sourcePath,
      `new URL('../../../../typescript/lib/typescript-esm.js', import.meta.url)\nnew URL(\`../../../../typescript/lib/\${libFileName}\`, import.meta.url)`,
    )
    await writeFile(
      bundlePath,
      `new URL('../../typescript/lib/typescript-esm.js', import.meta.url)\nnew URL(\`../../typescript/lib/\${libFileName}\`, import.meta.url)`,
    )
    await writeFile(typeScriptPath, 'duplicate TypeScript')

    await prepareElectronHtmlExtension({ extensionsPath })

    await expect(access(join(htmlExtensionPath, 'typescript'))).rejects.toThrow()
    expect(await readFile(sourcePath, 'utf8')).toBe(
      `new URL('../../../../../builtin.language-features-typescript/typescript/lib/typescript-esm.js', import.meta.url)\nnew URL(\`../../../../../builtin.language-features-typescript/typescript/lib/\${libFileName}\`, import.meta.url)`,
    )
    expect(await readFile(bundlePath, 'utf8')).toBe(
      `new URL('../../../builtin.language-features-typescript/typescript/lib/typescript-esm.js', import.meta.url)\nnew URL(\`../../../builtin.language-features-typescript/typescript/lib/\${libFileName}\`, import.meta.url)`,
    )
  } finally {
    await rm(extensionsPath, { recursive: true, force: true })
  }
})
