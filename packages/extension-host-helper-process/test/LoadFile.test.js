import { expect, test } from '@jest/globals'
import { resolve } from 'node:path'
import { resolveRemoteExtensionPath } from '../src/parts/LoadFile/LoadFile.js'

test('maps a built-in node extension into the remote server installation', () => {
  expect(resolveRemoteExtensionPath('/usr/lib/lvce/extensions/builtin.git/node/src/gitClient.js', '/opt/lvce/extensions')).toBe(
    resolve('/opt/lvce/extensions', 'builtin.git/node/src/gitClient.js'),
  )
})

test('keeps non-extension paths unchanged', () => {
  expect(resolveRemoteExtensionPath('/tmp/custom-extension/client.js', '/opt/lvce/extensions')).toBe('/tmp/custom-extension/client.js')
})

test('rejects a built-in extension path that escapes the remote extensions directory', () => {
  expect(() => resolveRemoteExtensionPath('/usr/lib/lvce/extensions/../outside/client.js', '/opt/lvce/extensions')).toThrow(/escapes/)
})
