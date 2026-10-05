import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, test } from '@jest/globals'
import { copyIcons } from '../src/parts/CopyIcons/CopyIcons.ts'
import * as CodiconsPath from '../src/parts/CodiconsPath/CodiconsPath.ts'

test('copyIcons includes archive.svg in the generated asset directory', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'lvce-copy-icons-'))

  try {
    await copyIcons(dir)

    const copiedIcon = await readFile(join(dir, 'archive.svg'), 'utf8')
    const sourceIcon = await readFile(join(CodiconsPath.codiconsIconsPath, 'archive.svg'), 'utf8')

    expect(copiedIcon).toBe(sourceIcon)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})
