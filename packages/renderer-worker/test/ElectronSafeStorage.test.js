import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ElectronProcess/ElectronProcess.js',
  () => {
    return {
      invoke: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const ElectronProcess = await import(
  '../src/parts/ElectronProcess/ElectronProcess.js'
)
const ElectronSafeStorage = await import(
  '../src/parts/ElectronSafeStorage/ElectronSafeStorage.js'
)

test('isEncryptionAvailable - error', async () => {
  // @ts-ignore
  ElectronProcess.invoke.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ElectronSafeStorage.isEncryptionAvailable()
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('isEncryptionAvailable', async () => {
  // @ts-ignore
  ElectronProcess.invoke.mockImplementation(() => {
    return true
  })
  expect(await ElectronSafeStorage.isEncryptionAvailable()).toBe(true)
  expect(ElectronProcess.invoke).toHaveBeenCalledTimes(1)
  expect(ElectronProcess.invoke).toHaveBeenCalledWith(
    'ElectronSafeStorage.isEncryptionAvailable'
  )
})

test('encryptString - error', async () => {
  // @ts-ignore
  ElectronProcess.invoke.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(ElectronSafeStorage.encryptString('test')).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('encryptString', async () => {
  // @ts-ignore
  ElectronProcess.invoke.mockImplementation(() => {
    return 'encrypted'
  })
  expect(await ElectronSafeStorage.encryptString('test')).toBe('encrypted')
  expect(ElectronProcess.invoke).toHaveBeenCalledTimes(1)
  expect(ElectronProcess.invoke).toHaveBeenCalledWith(
    'ElectronSafeStorage.encryptString',
    'test'
  )
})

test('decryptString - error', async () => {
  // @ts-ignore
  ElectronProcess.invoke.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ElectronSafeStorage.decryptString('encrypted')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('decryptString', async () => {
  // @ts-ignore
  ElectronProcess.invoke.mockImplementation(() => {
    return 'test'
  })
  expect(await ElectronSafeStorage.decryptString('encrypted')).toBe('test')
  expect(ElectronProcess.invoke).toHaveBeenCalledTimes(1)
  expect(ElectronProcess.invoke).toHaveBeenCalledWith(
    'ElectronSafeStorage.decryptString',
    'encrypted'
  )
})
