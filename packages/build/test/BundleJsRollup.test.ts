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

test('keeps node and electron modules external in web workers', async () => {
  const cachePath = await mkdtemp(join(tmpdir(), 'lvce-web-worker-bundle-'))
  try {
    await mkdir(join(cachePath, 'src'))
    await writeFile(
      join(cachePath, 'src', 'index.js'),
      `import 'node:fs'
import 'electron'
import 'electron/some-module'
globalThis.ready = true
`,
    )
    await bundleJs({
      cwd: cachePath,
      from: './src/index.js',
      external: [/^node:/, /^electron(?:\/|$)/],
      platform: 'webworker',
      sourceMap: false,
    })

    const bundle = await readFile(join(cachePath, 'dist', 'index.js'), 'utf8')

    expect(bundle).toContain("import 'node:fs'")
    expect(bundle).toContain("import 'electron'")
    expect(bundle).toContain("import 'electron/some-module'")
    expect(bundle).toContain('globalThis.ready')
  } finally {
    await rm(cachePath, { force: true, recursive: true })
  }
})

test('preserves dynamic imports in split web worker bundles', async () => {
  const cachePath = await mkdtemp(join(tmpdir(), 'lvce-web-worker-bundle-'))
  try {
    await mkdir(join(cachePath, 'src'))
    await writeFile(join(cachePath, 'src', 'index.js'), `export const load = () => import('./lazy.js')\n`)
    await writeFile(join(cachePath, 'src', 'lazy.js'), `export const loaded = true\n`)
    await bundleJs({
      cwd: cachePath,
      from: './src/index.js',
      codeSplitting: true,
      entryFileName: 'rendererWorkerMain.js',
      platform: 'webworker',
      sourceMap: false,
    })

    const outputPath = join(cachePath, 'dist')
    const outputFiles = await readdir(outputPath)
    const bundle = await readFile(join(outputPath, 'rendererWorkerMain.js'), 'utf8')
    const chunk = await readFile(join(outputPath, 'lazy.js'), 'utf8')

    expect(outputFiles).toContain('rendererWorkerMain.js')
    expect(bundle).toContain("import('./lazy.js')")
    expect(chunk).toContain('loaded')
  } finally {
    await rm(cachePath, { force: true, recursive: true })
  }
})
