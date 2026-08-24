import { afterEach, expect, test } from '@jest/globals'
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import * as ErrorCodes from '../src/parts/ErrorCodes/ErrorCodes.js'
import * as TransientLinkedExtensions from '../src/parts/TransientLinkedExtensions/TransientLinkedExtensions.js'

const originalArgv = process.argv
const fileUriRegex = /^file:\/\//

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

test('getDevelopmentConfig - enables hot reload for linked extension roots', () => {
  process.argv = [...originalArgv, '--link', 'packages/one', '--hot-reload']

  expect(TransientLinkedExtensions.getDevelopmentConfig()).toEqual({
    extensions: [
      {
        path: join(process.cwd(), 'packages/one'),
        uri: expect.stringMatching(fileUriRegex),
      },
    ],
    hotReload: true,
  })
})

test('getDevelopmentConfig - ignores hot reload without linked extensions', () => {
  process.argv = [...originalArgv, '--hot-reload']

  expect(TransientLinkedExtensions.getDevelopmentConfig()).toEqual({
    extensions: [],
    hotReload: false,
  })
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

test('validate - fails when path exists but does not contain an extension', async () => {
  const tmpDir = await mkdtemp(join(tmpdir(), 'lvce-transient-link-'))
  process.argv = [...originalArgv, '--link', tmpDir]

  await expect(TransientLinkedExtensions.validate()).rejects.toMatchObject({
    code: ErrorCodes.E_MANIFEST_NOT_FOUND,
    message: `Failed to start: --link path does not contain an extension: ${tmpDir}`,
  })
})

test('validate - accepts extension repository paths', async () => {
  const tmpDir = await mkdtemp(join(tmpdir(), 'lvce-transient-link-'))
  const extensionPath = join(tmpDir, 'packages', 'extension')
  await mkdir(extensionPath, { recursive: true })
  await writeFile(join(extensionPath, 'extension.json'), JSON.stringify({ id: 'test-extension' }))
  process.argv = [...originalArgv, '--link', tmpDir]

  await expect(TransientLinkedExtensions.validate()).resolves.toEqual([
    {
      path: tmpDir,
      resolvedPath: tmpDir,
      source: '--link',
    },
  ])
})

test('validate - accepts recognized linked worker paths', async () => {
  const tmpDir = await mkdtemp(join(tmpdir(), 'lvce-transient-link-'))
  await writeFile(join(tmpDir, 'package.json'), JSON.stringify({ main: 'dist/mainAreaWorkerMain.js', name: '@lvce-editor/main-area-worker' }))
  process.argv = [...originalArgv, '--link', tmpDir]

  await expect(TransientLinkedExtensions.validate()).resolves.toEqual([
    {
      path: tmpDir,
      resolvedPath: tmpDir,
      source: '--link',
    },
  ])
})
