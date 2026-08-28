import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, test } from '@jest/globals'
import { bundleRendererWorker } from '../src/parts/BundleRendererWorker/BundleRendererWorker.ts'

test('bundles npm dependencies into the renderer worker', async () => {
  const cachePath = await mkdtemp(join(tmpdir(), 'lvce-renderer-worker-bundle-'))
  try {
    await bundleRendererWorker({
      assetDir: '/test-asset-dir',
      cachePath,
      commitHash: 'test-commit',
      date: '2026-08-28T00:00:00.000Z',
      iconThemeEtag: '',
      platform: 'electron',
      product: {
        applicationName: 'lvce-test',
        nameLong: 'LVCE Test',
      },
      version: '0.0.0-test',
    })

    const bundle = await readFile(join(cachePath, 'dist', 'rendererWorkerMain.js'), 'utf8')

    expect(bundle).not.toMatch(/from ['"]@lvce-editor\//)
    expect(bundle).not.toMatch(/import ['"]@lvce-editor\//)
  } finally {
    await rm(cachePath, { force: true, recursive: true })
  }
}, 60_000)
