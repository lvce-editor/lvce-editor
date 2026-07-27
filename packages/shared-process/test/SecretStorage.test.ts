import { beforeEach, expect, jest, test } from '@jest/globals'
import { FileNotFoundError } from '../src/parts/FileNotFoundError/FileNotFoundError.js'

jest.unstable_mockModule('../src/parts/ElectronSafeStorage/ElectronSafeStorage.js', () => ({
  decryptString: jest.fn(),
  encryptString: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/JsonFile/JsonFile.js', () => ({
  readJson: jest.fn(),
  writeJson: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/PlatformPaths/PlatformPaths.js', () => ({
  getConfigDir: jest.fn(() => '/test/config'),
}))

const ElectronSafeStorage = await import('../src/parts/ElectronSafeStorage/ElectronSafeStorage.js')
const JsonFile = await import('../src/parts/JsonFile/JsonFile.js')
const SecretStorage = await import('../src/parts/SecretStorage/SecretStorage.js')

beforeEach(() => {
  jest.clearAllMocks()
})

test('get returns undefined when the secret file does not exist', async () => {
  jest.mocked(JsonFile.readJson).mockRejectedValue(new FileNotFoundError('/test/config/secrets.json'))

  await expect(SecretStorage.get('sample.extension', 'token')).resolves.toBeUndefined()
  expect(ElectronSafeStorage.decryptString).not.toHaveBeenCalled()
})

test('get decrypts the extension-scoped value', async () => {
  jest.mocked(JsonFile.readJson).mockResolvedValue({
    'other.extension': {
      token: 'other-encrypted',
    },
    'sample.extension': {
      token: 'encrypted',
    },
  })
  jest.mocked(ElectronSafeStorage.decryptString).mockResolvedValue('plain-text')

  await expect(SecretStorage.get('sample.extension', 'token')).resolves.toBe('plain-text')
  expect(ElectronSafeStorage.decryptString).toHaveBeenCalledWith('encrypted')
})

test('store encrypts values before persisting them outside the browser cache', async () => {
  jest.mocked(JsonFile.readJson).mockResolvedValue({
    'sample.extension': {
      existing: 'existing-encrypted',
    },
  })
  jest.mocked(ElectronSafeStorage.encryptString).mockResolvedValue('new-encrypted')

  await SecretStorage.store('sample.extension', 'token', 'plain-text')

  expect(ElectronSafeStorage.encryptString).toHaveBeenCalledWith('plain-text')
  expect(JsonFile.writeJson).toHaveBeenCalledWith('/test/config/secrets.json', {
    'sample.extension': {
      existing: 'existing-encrypted',
      token: 'new-encrypted',
    },
  })
})

test('delete removes only the selected extension secret', async () => {
  jest.mocked(JsonFile.readJson).mockResolvedValue({
    'other.extension': {
      token: 'other-encrypted',
    },
    'sample.extension': {
      token: 'encrypted',
    },
  })

  await SecretStorage.deleteSecret('sample.extension', 'token')

  expect(JsonFile.writeJson).toHaveBeenCalledWith('/test/config/secrets.json', {
    'other.extension': {
      token: 'other-encrypted',
    },
  })
})
