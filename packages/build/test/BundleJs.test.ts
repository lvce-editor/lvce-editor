import { execFileSync } from 'node:child_process'
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { expect, test } from '@jest/globals'
import { bundleJs } from '../src/parts/BundleJs/BundleJs.ts'

test('bundles dynamic modules into one file while preserving initialization after IPC configuration', async () => {
  const cachePath = await mkdtemp(join(tmpdir(), 'lvce-worker-lazy-initialization-'))
  try {
    await mkdir(join(cachePath, 'src'))
    await writeFile(join(cachePath, 'src', 'config.js'), 'export const config = {}')
    await writeFile(
      join(cachePath, 'src', 'lazy.js'),
      `import { config } from './config.js'
export const assetDir = config.assetDir
export const workerUrl = config.workerUrls.editor
`,
    )
    await writeFile(
      join(cachePath, 'src', 'index.js'),
      `import { config } from './config.js'
// Runtime configuration arrives asynchronously from the renderer process.
Object.assign(config, await Promise.resolve({ assetDir: '/configured', workerUrls: { editor: '/configured/editor.js' } }))
export const loaded = await import('./lazy.js')
`,
    )
    await bundleJs({ cwd: cachePath, from: './src/index.js', platform: 'webworker', sourceMap: false })
    expect(await readdir(join(cachePath, 'dist'))).toEqual(['index.js'])
    const source = await readFile(join(cachePath, 'dist', 'index.js'), 'utf8')
    expect(source).not.toMatch(/import\(['"]\.\//)
    const bundleUrl = pathToFileURL(join(cachePath, 'dist', 'index.js')).href
    const loaded = JSON.parse(
      execFileSync(
        process.execPath,
        ['--input-type=module', '-e', `const { loaded } = await import(${JSON.stringify(bundleUrl)}); console.log(JSON.stringify(loaded))`],
        { encoding: 'utf8' },
      ),
    )
    expect(loaded.assetDir).toBe('/configured')
    expect(loaded.workerUrl).toBe('/configured/editor.js')
  } finally {
    await rm(cachePath, { recursive: true, force: true })
  }
})
