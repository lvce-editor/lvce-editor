import { globSync, readFileSync } from 'node:fs'

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
if (misplaced.length) throw new Error(`Feature e2e coverage belongs in its owning repository:\n${misplaced.join('\n')}`)
console.log('Migrated feature e2e ownership verified')
