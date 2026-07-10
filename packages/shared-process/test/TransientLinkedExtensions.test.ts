import { afterEach, expect, test } from '@jest/globals'
import { mkdir, mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import * as ErrorCodes from '../src/parts/ErrorCodes/ErrorCodes.js'
import * as TransientLinkedExtensions from '../src/parts/TransientLinkedExtensions/TransientLinkedExtensions.js'

const originalArgv = process.argv

afterEach(() => {
  process.argv = originalArgv
})

test('getLinkedExtensions - reads repeated --link args', () => {
  process.argv = [...originalArgv, '--link', 'packages/one', '--link=/tmp/two']

  expect(TransientLinkedExtensions.getLinkedExtensions()).toEqual([
    {
      path: 'packages/one',
      resolvedPath: join(process.cwd(), 'packages/one'),
      source: '--link',
    },
    {
      path: '/tmp/two',
      resolvedPath: '/tmp/two',
      source: '--link',
    },
  ])
})

test('validate - fails when --link path is missing', async () => {
  process.argv = [...originalArgv, '--link']

  await expect(TransientLinkedExtensions.validate()).rejects.toMatchObject({
    code: ErrorCodes.ENOENT,
    message: 'Failed to start: --link requires a folder path',
  })
})

test('validate - fails when --link path does not exist', async () => {
  process.argv = [...originalArgv, '--link', 'missing-extension']

  await expect(TransientLinkedExtensions.validate()).rejects.toMatchObject({
    code: ErrorCodes.ENOENT,
    message: `Failed to start: --link path does not exist: missing-extension (resolved to ${join(process.cwd(), 'missing-extension')})`,
  })
})

test('validate - accepts existing paths', async () => {
  const tmpDir = await mkdtemp(join(tmpdir(), 'lvce-transient-link-'))
  const extensionPath = join(tmpDir, 'packages', 'extension')
  await mkdir(extensionPath, { recursive: true })
  process.argv = [...originalArgv, '--link', tmpDir]

  await expect(TransientLinkedExtensions.validate()).resolves.toEqual([
    {
      path: tmpDir,
      resolvedPath: tmpDir,
      source: '--link',
    },
  ])
})
