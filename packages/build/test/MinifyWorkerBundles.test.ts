import { execFileSync } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { expect, test } from '@jest/globals'
import { minifyWorkerBundles } from '../src/parts/MinifyWorkerBundles/MinifyWorkerBundles.ts'

test('editor and renderer workers stay readable while other worker entries are minified', async () => {
  const root = await mkdtemp(join(tmpdir(), 'minified-worker-'))
  try {
    const dist = join(root, 'packages', 'fixture-worker', 'dist')
    const editorDist = join(root, 'packages', 'editor-worker', 'dist')
    const rendererDist = join(root, 'packages', 'renderer-worker', 'dist')
    await mkdir(dist, { recursive: true })
    await mkdir(editorDist, { recursive: true })
    await mkdir(rendererDist, { recursive: true })
    await writeFile(join(root, 'package.json'), '{"type":"module"}')
    const entry = join(dist, 'fixtureWorkerMain.js')
    const source = `/*! fixture worker license */
${'// Descriptive worker implementation documentation.\n'.repeat(30)}
export const configuration = {}
export function configure(value) { configuration.value = value }
export async function load() { return (await import('./chunk.js')).read(configuration) }
export class WorkerError extends Error {}
`
    const chunk = 'export const read = configuration => ({ value: configuration.value })'
    const settings = '{"editor.fontSize":15}'
    await writeFile(entry, source)
    await writeFile(join(dist, 'chunk.js'), chunk)
    await writeFile(join(dist, 'settings.json'), settings)
    const editorEntry = join(editorDist, 'editorWorkerMain.js')
    const editorSource = `export function initializeEditorWorker(configuration) {\n  return configuration.editorDocument\n}\n`
    await writeFile(editorEntry, editorSource)
    const rendererEntry = join(rendererDist, 'rendererWorkerMain.js')
    const rendererSource = `export function initializeRendererWorker(rendererConfiguration) {\n  const renderScheduler = rendererConfiguration.scheduler\n  return renderScheduler.initialize(rendererConfiguration.document)\n}\n`
    await writeFile(rendererEntry, rendererSource)
    await minifyWorkerBundles(root)
    const minified = await readFile(entry, 'utf8')
    expect(minified.length).toBeLessThan(source.length)
    expect(minified).toContain('fixture worker license')
    expect(await readFile(join(dist, 'chunk.js'), 'utf8')).toBe(chunk)
    expect(await readFile(join(dist, 'settings.json'), 'utf8')).toBe(settings)
    expect(await readFile(editorEntry, 'utf8')).toBe(editorSource)
    expect(await readFile(rendererEntry, 'utf8')).toBe(rendererSource)
    const output = execFileSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        `
      const worker = await import(${JSON.stringify(pathToFileURL(entry).href)})
      worker.configure('configured after module evaluation')
      console.log(JSON.stringify({ result: await worker.load(), functionName: worker.configure.name, className: worker.WorkerError.name }))
    `,
      ],
      { encoding: 'utf8' },
    )
    expect(JSON.parse(output)).toEqual({
      result: { value: 'configured after module evaluation' },
      functionName: 'configure',
      className: 'WorkerError',
    })
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('an editor-only worker tree does not invoke minification', async () => {
  const root = await mkdtemp(join(tmpdir(), 'editor-only-worker-'))
  try {
    const dist = join(root, 'packages', 'editor-worker', 'dist')
    await mkdir(dist, { recursive: true })
    const entry = join(dist, 'editorWorkerMain.js')
    const source = 'export function initializeEditorWorker(configuration) {\n  return configuration\n}\n'
    await writeFile(entry, source)
    await minifyWorkerBundles(root)
    expect(await readFile(entry, 'utf8')).toBe(source)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('a missing worker tree fails the packaging step', async () => {
  const root = await mkdtemp(join(tmpdir(), 'missing-worker-'))
  try {
    await expect(minifyWorkerBundles(root)).rejects.toThrow('No worker bundles found')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
