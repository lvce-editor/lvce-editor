import { expect, test } from '@jest/globals'
import { access, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { copyWorkerArtifacts } from '../src/parts/CopyWorkerArtifacts/CopyWorkerArtifacts.ts'

test('packaged workers can load split chunks and nested artifacts after source removal', async () => {
  const root = await mkdtemp(join(tmpdir(), 'worker-artifacts-'))
  try {
    const source = join(root, 'source', 'dist')
    const target = join(root, 'target')
    await mkdir(join(source, 'nested'), { recursive: true })
    await writeFile(join(source, 'worker.mjs'), 'export const load = () => import("./chunk.mjs")')
    await writeFile(join(source, 'chunk.mjs'), 'export const value = 42')
    await writeFile(join(source, 'nested', 'worker.wasm'), 'wasm fixture')
    await copyWorkerArtifacts({ from: join(source, 'worker.mjs'), to: join(target, 'renamed-worker.mjs') })
    await rm(source, { recursive: true })
    const worker = await import(pathToFileURL(join(target, 'renamed-worker.mjs')).href)
    expect((await worker.load()).value).toBe(42)
    expect(await readFile(join(target, 'nested', 'worker.wasm'), 'utf8')).toBe('wasm fixture')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('non-dist worker entries do not copy their package directory', async () => {
  const root = await mkdtemp(join(tmpdir(), 'worker-entry-'))
  try {
    const source = join(root, 'source')
    const target = join(root, 'target')
    await mkdir(source)
    await writeFile(join(source, 'index.js'), 'worker fixture')
    await writeFile(join(source, 'package.json'), '{}')
    await copyWorkerArtifacts({ from: join(source, 'index.js'), to: join(target, 'worker.js') })
    expect(await readFile(join(target, 'worker.js'), 'utf8')).toBe('worker fixture')
    await expect(access(join(target, 'package.json'))).rejects.toThrow()
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
