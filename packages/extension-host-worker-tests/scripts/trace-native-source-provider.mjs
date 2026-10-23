import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const path = fileURLToPath(new URL('../fixtures/sample-source-control-provider/src/index.ts', import.meta.url))
let source = await readFile(path, 'utf8')
const stage = 'staged[path] = true'
const groups = 'const staged = dirents.filter(isStaged).map((item) => toStagedItem(item, root))'
if (!source.includes(stage) || !source.includes(groups)) throw new Error('Native source provider diagnostic hooks not found')
source = source.replace(stage, `${stage}; console.info('Native staged keys', JSON.stringify(Object.keys(staged)))`)
source = source.replace(
  groups,
  `${groups}; console.info('Native groups summary', JSON.stringify({ root, changed: changed.length, staged: staged.length }))`,
)
await writeFile(path, source)
