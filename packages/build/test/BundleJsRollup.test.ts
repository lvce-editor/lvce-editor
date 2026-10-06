import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, test } from '@jest/globals'
import { bundleJs } from '../src/parts/BundleJsRollup/BundleJsRollup.ts'
import * as Path from '../src/parts/Path/Path.ts'

test('bundles npm dependencies into web workers', async () => {
  const cachePath = await mkdtemp(join(tmpdir(), 'lvce-web-worker-bundle-'))
  try {
    await mkdir(join(cachePath, 'src'))
    await writeFile(
      join(cachePath, 'src', 'index.js'),
      `import { diffTree } from '@lvce-editor/virtual-dom-worker'

globalThis.patches = diffTree([], [])
`,
    )
    await bundleJs({
      cwd: cachePath,
      from: './src/index.js',
      modulePaths: [Path.absolute('packages/renderer-worker/node_modules')],
      platform: 'webworker',
      sourceMap: false,
    })

    const bundle = await readFile(join(cachePath, 'dist', 'index.js'), 'utf8')

    expect(bundle).toContain('globalThis.patches')
    expect(bundle).not.toMatch(/from ['"]@lvce-editor\//)
    expect(bundle).not.toMatch(/import ['"]@lvce-editor\//)
  } finally {
    await rm(cachePath, { force: true, recursive: true })
  }
})

test('inlines dynamic imports by default', async () => {
  const cachePath = await mkdtemp(join(tmpdir(), 'lvce-web-worker-inline-imports-'))
  try {
    await mkdir(join(cachePath, 'src'))
    await writeFile(join(cachePath, 'src', 'index.js'), `export const load = () => import('./lazy.js')`)
    await writeFile(join(cachePath, 'src', 'lazy.js'), `export const value = 'loaded from the same bundle'`)
    await bundleJs({
      cwd: cachePath,
      from: './src/index.js',
      platform: 'webworker',
      sourceMap: false,
    })

    const distFiles = await readdir(join(cachePath, 'dist'))
    expect(distFiles).toEqual(['index.js'])
    const bundle = await readFile(join(cachePath, 'dist', 'index.js'), 'utf8')
    expect(bundle).toContain('loaded from the same bundle')
    expect(bundle).not.toContain("import('./lazy.js')")
  } finally {
    await rm(cachePath, { force: true, recursive: true })
  }
})
