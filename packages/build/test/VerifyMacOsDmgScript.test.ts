import { readFile } from 'node:fs/promises'
import { expect, test } from '@jest/globals'

test('macOS DMG verification rejects detached resource signatures', async () => {
  const scriptUrl = new URL('../scripts/github-actions/verify-macos-dmg.sh', import.meta.url)
  const script = await readFile(scriptUrl, 'utf8')

  expect(script).toContain('com.apple.cs.CodeSignature')
  expect(script).toContain('The app contains detached signatures on ordinary resource files')
})
