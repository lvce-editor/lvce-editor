import { expect, test } from '@jest/globals'
import { getTypeScriptTarget, version } from '../src/parts/BundleTypeScriptLanguageServer/BundleTypeScriptLanguageServer.ts'

test.each([
  ['linux', 'x64', 'linux-x64', 'tsc'],
  ['linux', 'arm64', 'linux-arm64', 'tsc'],
  ['linux', 'armv7l', 'linux-arm', 'tsc'],
  ['darwin', 'x64', 'darwin-x64', 'tsc'],
  ['darwin', 'arm64', 'darwin-arm64', 'tsc'],
  ['win32', 'x64', 'win32-x64', 'tsc.exe'],
  ['win32', 'arm64', 'win32-arm64', 'tsc.exe'],
])('selects the requested %s/%s target independently of the build host', (platform, arch, target, executable) => {
  expect(getTypeScriptTarget(platform, arch)).toEqual({
    digest: expect.stringMatching(/^[a-f0-9]{64}$/),
    executable,
    target,
    url: `https://github.com/microsoft/typescript-go/releases/download/typescript/v${version}/typescript-${target}.tgz`,
  })
})

test('unsupported targets fail instead of shipping a host executable', () => {
  expect(() => getTypeScriptTarget('win32', 'ia32')).toThrow('Unsupported TypeScript language server target: win32-ia32')
})
