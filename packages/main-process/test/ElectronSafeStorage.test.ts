import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('electron', () => {
  return {
    safeStorage: {
      isEncryptionAvailable: jest.fn(),
      encryptString: jest.fn(),
      decryptString: jest.fn(),
    },
  }
})

const electron = await import('electron')
const ElectronSafeStorage = await import('../src/parts/ElectronSafeStorage/ElectronSafeStorage.js')

test('isEncryptionAvailable - error', () => {
  // @ts-ignore
  electron.safeStorage.isEncryptionAvailable.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  expect(() => ElectronSafeStorage.isEncryptionAvailable()).toThrow(new TypeError('x is not a function'))
})

test('isEncryptionAvailable', () => {
  // @ts-ignore
  electron.safeStorage.isEncryptionAvailable.mockImplementation(() => {
    return true
  })
  expect(ElectronSafeStorage.isEncryptionAvailable()).toBe(true)
  expect(electron.safeStorage.isEncryptionAvailable).toHaveBeenCalledTimes(1)
})

test('encryptString - error', () => {
  // @ts-ignore
  electron.safeStorage.encryptString.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  expect(() => ElectronSafeStorage.encrypt('test')).toThrow(new TypeError('x is not a function'))
})

test('encryptString', () => {
  // @ts-ignore
  electron.safeStorage.encryptString.mockImplementation(() => {
    return 'encrypted'
  })
  expect(ElectronSafeStorage.encrypt('test')).toBe('encrypted')
  expect(electron.safeStorage.encryptString).toHaveBeenCalledTimes(1)
  expect(electron.safeStorage.encryptString).toHaveBeenCalledWith('test')
})
