import { build } from 'esbuild'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
await mkdir(join(root, '.tmp'), { recursive: true })
const directory = await mkdtemp(join(root, '.tmp', 'update-dialog-routing-'))
try {
  await writeFile(join(directory, 'package.json'), '{"type":"module"}')
  await build({
    stdin: {
      contents: `
        import { load } from './packages/shared-process/src/parts/Module/Module.ts'
        import { ElectronDialog } from './packages/shared-process/src/parts/ModuleId/ModuleId.ts'
        import assert from 'node:assert/strict'
        import { readdir, rm } from 'node:fs/promises'
        import { dirname, join } from 'node:path'
        import { fileURLToPath } from 'node:url'
        const directory = dirname(fileURLToPath(import.meta.url))
        // Reproduce an installer removing every old lazily loaded chunk.
        for (const name of await readdir(directory)) {
          if (name.endsWith('.js') && name !== 'main.js') await rm(join(directory, name))
        }
        const dialog = await load(ElectronDialog)
        for (const command of ['showMessageBox', 'showSaveDialog', 'showOpenDialog']) {
          assert.equal(typeof dialog.Commands[command], 'function', command)
        }
        console.log('Native dialog routing survives removal of old package chunks')
      `,
      resolveDir: root,
    },
    outdir: directory,
    entryNames: 'main',
    chunkNames: '[name]-[hash]',
    bundle: true,
    splitting: true,
    platform: 'node',
    format: 'esm',
    packages: 'external',
  })
  const output = execFileSync(process.execPath, [join(directory, 'main.js')], { encoding: 'utf8', timeout: 15_000 })
  assert.match(output, /survives removal/)
  process.stdout.write(output)
} finally {
  await rm(directory, { recursive: true, force: true })
}
