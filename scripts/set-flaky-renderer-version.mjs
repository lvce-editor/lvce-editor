import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'

// Change only the published renderer artifact on the original failing revision.
const manifestPath = 'packages/renderer-worker/package.json'
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
const lock = JSON.parse(await readFile('package-lock.json', 'utf8'))
const dependency = '@lvce-editor/renderer-process'
assert.equal(manifest.dependencies[dependency], '^30.73.0')
assert.equal(lock.packages[`node_modules/${dependency}`].version, '30.73.0')
manifest.dependencies[dependency] = '^30.73.2'
lock.packages['packages/renderer-worker'].dependencies[dependency] = '^30.73.2'
Object.assign(lock.packages[`node_modules/${dependency}`], {
  version: '30.73.2',
  resolved: 'https://registry.npmjs.org/@lvce-editor/renderer-process/-/renderer-process-30.73.2.tgz',
  integrity: 'sha512-4gsG53MPxzHLKy7aJ9+D7yKs/ppaLcJpMQknuEjtkmNeCzWlKQBAtOz6aeussCJk8rVi3CbnVVWjd0HKAhLtFQ==',
})
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
await writeFile('package-lock.json', `${JSON.stringify(lock, null, 2)}\n`)
