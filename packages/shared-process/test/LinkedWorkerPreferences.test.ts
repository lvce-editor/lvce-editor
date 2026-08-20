import { afterEach, expect, test } from '@jest/globals'
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import * as LinkedWorkerPreferences from '../src/parts/LinkedWorkerPreferences/LinkedWorkerPreferences.ts'

const originalArgv = process.argv

afterEach(() => {
  process.argv = originalArgv
})

const createPackage = async (packageJson: unknown): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), 'linked-worker-'))
  await mkdir(join(root, 'dist'), { recursive: true })
  await writeFile(join(root, 'package.json'), JSON.stringify(packageJson))
  return root
}

test('getLinkedWorkerPreferences - resolves a linked worker package', async () => {
  const root = await createPackage({
    name: '@lvce-editor/main-area-worker',
    main: 'dist/mainAreaWorkerMain.js',
  })
  process.argv = [...originalArgv, '--link', root]

  await expect(LinkedWorkerPreferences.getLinkedWorkerPreferences()).resolves.toEqual({
    'develop.mainAreaWorkerPath': join(root, 'dist', 'mainAreaWorkerMain.js'),
  })
})

test('getLinkedWorkerPreferences - ignores extension and unknown packages', async () => {
  const extensionRoot = await mkdtemp(join(tmpdir(), 'linked-extension-'))
  const unknownRoot = await createPackage({
    name: '@lvce-editor/unknown-worker',
    main: 'dist/unknownWorkerMain.js',
  })
  process.argv = [...originalArgv, '--link', extensionRoot, '--link', unknownRoot]

  await expect(LinkedWorkerPreferences.getLinkedWorkerPreferences()).resolves.toEqual({})
})
