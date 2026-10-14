import { execFileSync } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { expect, test } from '@jest/globals'
import { bundleSharedProcessGraph } from '../src/parts/BundleSharedProcessGraph/BundleSharedProcessGraph.ts'

test('shared-process graph retains dynamic initialization, singleton state, names, package resolution and root URLs', async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'lvce-shared-graph-'))
  try {
    const src = join(cwd, 'src')
    await mkdir(join(src, 'parts', 'Root'), { recursive: true })
    await mkdir(join(cwd, 'node_modules', 'fixture-package'), { recursive: true })
    await writeFile(join(cwd, 'package.json'), '{"type":"module"}')
    await writeFile(join(cwd, 'node_modules', 'fixture-package', 'package.json'), '{"type":"module","main":"index.js"}')
    await writeFile(join(cwd, 'node_modules', 'fixture-package', 'index.js'), 'export const value = 42')
    await writeFile(join(src, 'state.js'), 'export const state = { value: 0 }; export const load = () => state.value')
    await writeFile(
      join(src, 'lazy.js'),
      'import { state } from "./state.js"; export { rootUrl } from "./parts/Root/Root.js"; state.value++; export const load = () => state.value',
    )
    await writeFile(join(src, 'parts', 'Root', 'Root.js'), 'export const rootUrl = import.meta.url')
    await writeFile(
      join(src, 'sharedProcessMain.js'),
      `import { state, load } from './state.js'
import { rootUrl } from './parts/Root/Root.js'
import { value } from 'fixture-package'
const before = state.value
await Promise.resolve()
const lazy = await import('./lazy.js')
if (lazy.rootUrl !== rootUrl) throw new Error('Root singleton mismatch')
console.log(JSON.stringify({ before, after: state.value, value: lazy.load(), names: [load.name, lazy.load.name], rootUrl, packageValue: value, packageUrl: import.meta.resolve('fixture-package') }))
`,
    )
    const run = () => JSON.parse(execFileSync(process.execPath, [join(src, 'sharedProcessMain.js')], { encoding: 'utf8' }))
    const original = run()
    await bundleSharedProcessGraph(cwd)
    expect(run()).toEqual(original)
    expect(original).toEqual({
      before: 0,
      after: 1,
      value: 1,
      names: ['load', 'load'],
      rootUrl: pathToFileURL(join(src, 'parts', 'Root', 'Root.js')).href,
      packageValue: 42,
      packageUrl: pathToFileURL(join(cwd, 'node_modules', 'fixture-package', 'index.js')).href,
    })
  } finally {
    await rm(cwd, { recursive: true, force: true })
  }
})
