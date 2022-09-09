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
const ElectronShell = await import(
  '../src/parts/ElectronShell/ElectronShell.js'
)

test('beep - error', async () => {
  // @ts-ignore
  ElectronProcess.invoke.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(ElectronShell.beep()).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('beep', async () => {
  // @ts-ignore
  ElectronProcess.invoke.mockImplementation(() => {})
  await ElectronShell.beep()
  expect(ElectronProcess.invoke).toHaveBeenCalledTimes(1)
  expect(ElectronProcess.invoke).toHaveBeenCalledWith('ElectronShell.beep')
})

test('showItemInFolder - error', async () => {
  // @ts-ignore
  ElectronProcess.invoke.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ElectronShell.showItemInFolder('/test/file.txt')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('showItemInFolder', async () => {
  // @ts-ignore
  ElectronProcess.invoke.mockImplementation(() => {})
  await ElectronShell.showItemInFolder('/test/file.txt')
  expect(ElectronProcess.invoke).toHaveBeenCalledTimes(1)
  expect(ElectronProcess.invoke).toHaveBeenCalledWith(
    'ElectronShell.showItemInFolder',
    '/test/file.txt'
  )
})
