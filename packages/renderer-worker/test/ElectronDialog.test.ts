import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/GetWindowId/GetWindowId.js', () => ({
  getWindowId: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Product/Product.js', () => ({
  getProductNameLong: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => ({
  invoke: jest.fn(),
}))

const ElectronDialog = await import('../src/parts/ElectronDialog/ElectronDialog.js')
const GetWindowId = await import('../src/parts/GetWindowId/GetWindowId.js')
const Product = await import('../src/parts/Product/Product.js')
const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')

beforeEach(() => {
  jest.resetAllMocks()
  jest.mocked(GetWindowId.getWindowId).mockResolvedValue(42)
  jest.mocked(Product.getProductNameLong).mockReturnValue('Lvce Editor - OSS')
})

test('showMessageBox - preserves configured product name', async () => {
  await ElectronDialog.showMessageBox({
    buttons: ['Ok'],
    message: 'Lvce Editor',
    productName: 'Lvce Editor',
  })

  expect(Product.getProductNameLong).not.toHaveBeenCalled()
  expect(SharedProcess.invoke).toHaveBeenCalledWith('ElectronDialog.showMessageBox', {
    buttons: ['Ok'],
    message: 'Lvce Editor',
    productName: 'Lvce Editor',
    windowId: 42,
  })
})

test('showMessageBox - uses default product name', async () => {
  await ElectronDialog.showMessageBox({
    buttons: ['Ok'],
    message: 'Message',
  })

  expect(Product.getProductNameLong).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('ElectronDialog.showMessageBox', {
    buttons: ['Ok'],
    message: 'Message',
    productName: 'Lvce Editor - OSS',
    windowId: 42,
  })
})

test('showOpenDialog - returns a mocked file URI', async () => {
  const uri = 'file:///tmp/a%20file.txt'
  ElectronDialog.mockOpenDialog(uri)
  expect(ElectronDialog.showOpenDialog('Open File', ['openFile'])).toBe(uri)
  expect(SharedProcess.invoke).not.toHaveBeenCalled()
  ElectronDialog.resetMockOpenDialog()
})

test('mockOpenDialog requires a file URI string', () => {
  // @ts-ignore
  expect(() => ElectronDialog.mockOpenDialog(['/tmp/file.txt'])).toThrow('expected uri to be a string')
})
