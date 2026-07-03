import { describe, expect, test } from '@jest/globals'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { addRootPackageJson } from '../src/parts/AddRootPackageJson/AddRootPackageJson.js'

describe('packaged electron wrapper', () => {
  test('root package json points to the runtime wrapper', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'lvce-electron-wrapper-'))
    try {
      await addRootPackageJson({
        cachePath: dir,
        electronVersion: '42.0.0',
        product: {
          applicationName: 'lvce-oss',
          nameLong: 'Lvce Editor',
        },
        version: '1.0.0',
      })
      const packageJson = JSON.parse(await readFile(join(dir, 'package.json'), 'utf8'))
      expect(packageJson.main).toBe('packages/main-process/src/mainProcessMain.js')
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })
})
