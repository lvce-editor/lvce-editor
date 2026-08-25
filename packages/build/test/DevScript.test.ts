import { expect, test } from '@jest/globals'
import { readFile } from 'node:fs/promises'

test('dev startup refreshes built-in extensions', async () => {
  const packageJsonUrl = new URL('../../../package.json', import.meta.url)
  const packageJson = JSON.parse(await readFile(packageJsonUrl, 'utf8'))

  expect(packageJson.scripts.predev).toBe('node scripts/download-builtin-extensions.js')
})
