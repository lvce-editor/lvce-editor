import { expect, test } from '@jest/globals'
import { getBuiltinExtensionAssetName } from '../src/parts/GetBuiltinExtensionAssetName/GetBuiltinExtensionAssetName.ts'

const extension = {
  name: 'builtin.remote-server',
  repository: 'github.com/lvce-editor/remote-ssh',
  version: '0.19.0',
  assetName: 'remote-server-v0.19.0.tar.br',
}

test('downloads the browser connector from a shared repository', () => {
  expect(getBuiltinExtensionAssetName(extension)).toBe('remote-server-v0.19.0.tar.br')
})

test('retains the browser archive when updating the shared repository', () => {
  expect(getBuiltinExtensionAssetName(extension, '0.20.0')).toBe('remote-server-v0.20.0.tar.br')
})

test('uses the repository archive when no custom archive is declared', () => {
  expect(getBuiltinExtensionAssetName({ ...extension, assetName: undefined }, '0.20.0')).toBe('remote-ssh-v0.20.0.tar.br')
})

test('rejects unrecognized custom archive versions instead of replacing the extension', () => {
  expect(() => getBuiltinExtensionAssetName({ ...extension, assetName: 'custom.tar.br' }, '0.20.0')).toThrow('cannot update versioned archive')
})
