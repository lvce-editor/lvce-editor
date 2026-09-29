import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, test } from '@jest/globals'
import { prepareElectronCss } from '../src/parts/PrepareElectronCss/PrepareElectronCss.ts'

test('rewrites Electron CSS to use commit-scoped icons', async () => {
  const resourcesPath = await mkdtemp(join(tmpdir(), 'lvce-electron-css-'))
  const extensionCssPath = join(resourcesPath, 'app', 'static', 'abc1234', 'extensions', 'builtin.test', 'view.css')
  const processExplorerCssPath = join(resourcesPath, 'app', 'packages', 'main-process', 'pages', 'process-explorer', 'process-explorer.css')

  try {
    await mkdir(join(extensionCssPath, '..'), { recursive: true })
    await mkdir(join(processExplorerCssPath, '..'), { recursive: true })
    await writeFile(extensionCssPath, `mask-image: url('/icons/archive.svg');`)
    await writeFile(processExplorerCssPath, `mask-image: url(../../../../static/icons/chevron-down.svg);`)

    await prepareElectronCss({
      resourcesPath,
      commitHash: 'abc1234',
    })

    expect(await readFile(extensionCssPath, 'utf8')).toBe(`mask-image: url('/abc1234/icons/archive.svg');`)
    expect(await readFile(processExplorerCssPath, 'utf8')).toBe(`mask-image: url(../../../../static/abc1234/icons/chevron-down.svg);`)
  } finally {
    await rm(resourcesPath, { recursive: true, force: true })
  }
})
