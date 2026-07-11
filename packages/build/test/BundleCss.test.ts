import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, test } from '@jest/globals'
import { bundleCss } from '../src/parts/BundleCss/BundleCss.ts'

test('bundleCss adds filename comment to generated part css files', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'lvce-bundle-css-'))

  try {
    await bundleCss({
      outDir: dir,
      assetDir: '',
    })

    const css = await readFile(join(dir, 'parts', 'Markdown.css'), 'utf8')

    expect(css.startsWith('/* Markdown.css */\n')).toBe(true)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}, 30_000)

test('bundleCss does not add filename comment to App.css', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'lvce-bundle-css-'))

  try {
    await bundleCss({
      outDir: dir,
      assetDir: '',
    })

    const css = await readFile(join(dir, 'App.css'), 'utf8')

    expect(css.startsWith('/* App.css */\n')).toBe(false)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}, 30_000)
