import { expect, test } from '@jest/globals'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import * as PatchDialogWorkerProductName from '../src/parts/PatchDialogWorkerProductName/PatchDialogWorkerProductName.ts'

test.each([
  [{ nameLong: 'Lvce Editor', nameShort: 'Lvce' }, `productNameLong = 'Lvce'`],
  [{ nameLong: 'Lvce Editor - OSS', nameShort: 'Lvce - OSS' }, `productNameLong = 'Lvce Editor - OSS'`],
])('uses the configured product name: %s', async (product, expected) => {
  const toRoot = await mkdtemp(join(tmpdir(), 'lvce-dialog-worker-product-'))
  const dialogWorkerPath = join(toRoot, 'packages/dialog-worker/dist/dialogWorkerMain.js')
  await mkdir(join(toRoot, 'packages/dialog-worker/dist'), { recursive: true })
  await writeFile(dialogWorkerPath, `const productNameLong = 'Lvce Editor - OSS';`)

  try {
    await PatchDialogWorkerProductName.patchDialogWorkerProductName({ product, toRoot })
    await expect(readFile(dialogWorkerPath, 'utf8')).resolves.toContain(expected)
  } finally {
    await rm(toRoot, { force: true, recursive: true })
  }
})
