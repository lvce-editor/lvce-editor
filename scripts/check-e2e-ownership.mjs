import { globSync, readFileSync, readdirSync } from 'node:fs'

const root = new URL('../', import.meta.url)
const ownership = JSON.parse(readFileSync(new URL('packages/extension-host-worker-tests/ownership.json', root), 'utf8'))
const misplaced = []
for (const [repository, patterns] of Object.entries(ownership)) {
  for (const pattern of patterns) {
    for (const path of globSync(pattern, { cwd: root })) {
      misplaced.push(`${path}: move coverage to lvce-editor/${repository}`)
    }
  }
}
// Reject new feature scenarios too, even when they are absent from the ownership map.
for (const name of readdirSync(new URL('packages/extension-host-worker-tests/src/', root))) {
  if (name !== '_all.js') misplaced.push(`${name}: feature e2e scenarios belong in their owning repository`)
}
for (const path of globSync('packages/extension-host-worker-tests/scripts/test-*', { cwd: root })) {
  misplaced.push(`${path}: feature e2e scripts belong in their owning repository`)
}
if (misplaced.length) throw new Error(`Feature e2e coverage belongs in its owning repository:\n${misplaced.join('\n')}`)
console.log('Migrated feature e2e ownership verified')
