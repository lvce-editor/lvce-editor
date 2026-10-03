import { expect, test } from '@jest/globals'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { runInNewContext } from 'node:vm'
import { createWorkerFactory } from '../src/parts/BundleStaticWorkers/BundleStaticWorkers.ts'

test('generated factories preserve declaration order and allow worker helpers named after globals', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'bundle-worker-'))
  try {
    const input = join(directory, 'worker.js')
    await writeFile(
      input,
      `const requestAnimationFrame = (value) => value + 1;
const main = async () => {
  await Promise.resolve();
  globalThis.postMessage(requestAnimationFrame(initialized));
};
main();
const initialized = 41;
`,
    )
    const factory = await createWorkerFactory(input, '/prefix/worker.js')
    const factories = runInNewContext(`({${factory}})`, { location: { origin: 'https://example.test' }, URL })
    const messages: number[] = []
    const scope: any = {
      postMessage: (value: number): void => {
        messages.push(value)
      },
    }
    scope.globalThis = scope
    await factories['https://example.test/prefix/worker.js'](scope)
    expect(messages).toEqual([42])
  } finally {
    await rm(directory, { force: true, recursive: true })
  }
})

test('generated factories reject failed asynchronous startup', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'bundle-worker-'))
  try {
    const input = join(directory, 'worker.js')
    await writeFile(input, `const main = async () => { await Promise.resolve(); throw new Error('initialization failed'); };\nmain();\n`)
    const factory = await createWorkerFactory(input, '/prefix/worker.js')
    const factories = runInNewContext(`({${factory}})`, { location: { origin: 'https://example.test' }, URL })
    await expect(factories['https://example.test/prefix/worker.js']({})).rejects.toThrow('initialization failed')
  } finally {
    await rm(directory, { force: true, recursive: true })
  }
})
