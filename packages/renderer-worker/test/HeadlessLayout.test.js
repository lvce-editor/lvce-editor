import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({
  register: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => ({
  get: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Product/Product.js', () => ({
  getBackendUrl: jest.fn(),
}))

const Command = await import('../src/parts/Command/Command.js')
const HeadlessLayout = await import('../src/parts/HeadlessLayout/HeadlessLayout.js')
const Preferences = await import('../src/parts/Preferences/Preferences.js')
const Product = await import('../src/parts/Product/Product.js')

test('initialize - registers the backend URL command without loading Layout', () => {
  // @ts-ignore
  Preferences.get.mockReturnValue('https://configured.example')

  HeadlessLayout.initialize()

  expect(Command.register).toHaveBeenCalledWith('Layout.getBackendUrl', expect.any(Function))
  // @ts-ignore
  const getBackendUrl = Command.register.mock.calls[0][1]
  expect(getBackendUrl()).toBe('https://configured.example')
  expect(Product.getBackendUrl).not.toHaveBeenCalled()
})
