import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, test } from '@jest/globals'
import * as Hash from '../src/parts/Hash/Hash.ts'

test('computes a stable folder hash', async () => {
  const folder = await mkdtemp(join(tmpdir(), 'lvce-folder-hash-'))
  try {
    await mkdir(join(folder, 'nested'))
    await writeFile(join(folder, 'first.txt'), 'first')
    await writeFile(join(folder, 'nested', 'second.txt'), 'second')
    await writeFile(join(folder, 'nested', 'third.txt'), 'third')

    const firstHash = await Hash.computeFolderHash(folder)
    const secondHash = await Hash.computeFolderHash(folder)

    expect(firstHash).toBe(secondHash)
  } finally {
    await rm(folder, { force: true, recursive: true })
  }
})
