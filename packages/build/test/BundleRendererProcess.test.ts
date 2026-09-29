import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, test } from '@jest/globals'
import { bundleRendererProcess } from '../src/parts/BundleRendererProcess/BundleRendererProcess.ts'

test('inlines the electron platform without introducing a temporal-dead-zone reference', async () => {
  const cachePath = await mkdtemp(join(tmpdir(), 'lvce-renderer-process-bundle-'))
  try {
    await bundleRendererProcess({
      assetDir: '/test-asset-dir',
      cachePath,
      commitHash: 'test-commit',
      platform: 'electron',
    })

    const bundle = await readFile(join(cachePath, 'dist', 'rendererProcessMain.js'), 'utf8')

    const platformDeclaration = bundle.match(/const platform = [^;]+;/)?.[0]
    expect(platformDeclaration).toBe('const platform = 2;')
  } finally {
    await rm(cachePath, { force: true, recursive: true })
  }
})
