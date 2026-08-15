import { expect, jest, test } from '@jest/globals'
import { join } from 'node:path'
import * as IpcTrace from '../src/parts/IpcTrace/IpcTrace.ts'

test('appends JSONL records to the application trace directory', async () => {
  const mkdir = jest.fn<(path: string, options: { recursive: boolean }) => Promise<void>>(async () => undefined)
  const appendFile = jest.fn<(path: string, content: string) => Promise<void>>(async () => undefined)
  await IpcTrace.appendWithDependencies('builtin.eslint/evaluation-worker', [{ sequence: 1 }, { sequence: 2 }], {
    appendFile: appendFile as never,
    cacheDirectory: '/cache/lvce-oss',
    mkdir: mkdir as never,
    timeOrigin: 0,
  })
  const directory = join('/cache/lvce-oss', 'ipcTraces', '1970-01-01T00-00-00.000Z')
  expect(mkdir).toHaveBeenCalledWith(directory, { recursive: true })
  expect(appendFile).toHaveBeenCalledWith(join(directory, 'builtin.eslint_evaluation-worker.jsonl'), '{"sequence":1}\n{"sequence":2}\n')
})

test('sanitizes unsafe worker ids', () => {
  expect(IpcTrace.sanitizeWorkerId('../../worker name')).toBe('.._.._worker_name')
})
