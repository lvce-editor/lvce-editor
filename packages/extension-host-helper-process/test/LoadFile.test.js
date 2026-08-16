import { beforeEach, expect, jest, test } from '@jest/globals'
import { resolve } from 'node:path'

jest.unstable_mockModule('../src/parts/ImportScript/ImportScript.js', () => ({
  importScript: jest.fn(),
}))

const CommandMapRef = await import('../src/parts/CommandMapRef/CommandMapRef.js')
const ImportScript = await import('../src/parts/ImportScript/ImportScript.js')
const { loadFile, resolveRemoteExtensionPath } = await import('../src/parts/LoadFile/LoadFile.js')

beforeEach(() => {
  for (const key of Object.keys(CommandMapRef.commandMapRef)) {
    delete CommandMapRef.commandMapRef[key]
  }
  jest.clearAllMocks()
})

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

test('adds loaded commands to the active helper process command map', async () => {
  const execute = jest.fn()
  jest.mocked(ImportScript.importScript).mockResolvedValue({
    commandMap: {
      'Exec.exec': execute,
    },
  })

  await loadFile('/test/gitClient.js')

  expect(CommandMapRef.commandMapRef['Exec.exec']).toBe(execute)
})
