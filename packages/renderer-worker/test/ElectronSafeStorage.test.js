import { jest } from '@jest/globals'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')
const ElectronSafeStorage = await import('../src/parts/ElectronSafeStorage/ElectronSafeStorage.js')

test('isEncryptionAvailable - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(ElectronSafeStorage.isEncryptionAvailable()).rejects.toThrow(new TypeError('x is not a function'))
})

test('isEncryptionAvailable', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {
    return true
  })
  expect(await ElectronSafeStorage.isEncryptionAvailable()).toBe(true)
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('ElectronSafeStorage.isEncryptionAvailable')
})

test('encryptString - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(ElectronSafeStorage.encryptString('test')).rejects.toThrow(new TypeError('x is not a function'))
})

test('encryptString', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {
    return 'encrypted'
  })
  expect(await ElectronSafeStorage.encryptString('test')).toBe('encrypted')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('ElectronSafeStorage.encryptString', 'test')
})

test('decryptString - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(ElectronSafeStorage.decryptString('encrypted')).rejects.toThrow(new TypeError('x is not a function'))
})

test('decryptString', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {
    return 'test'
  })
  expect(await ElectronSafeStorage.decryptString('encrypted')).toBe('test')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('ElectronSafeStorage.decryptString', 'encrypted')
})
