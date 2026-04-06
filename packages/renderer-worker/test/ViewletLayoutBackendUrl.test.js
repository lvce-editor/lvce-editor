import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => {
  return {
    get: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/Product/Product.js', () => {
  return {
    getBackendUrl: jest.fn(),
  }
})

const Preferences = await import('../src/parts/Preferences/Preferences.js')
const Product = await import('../src/parts/Product/Product.js')
const ViewletLayout = await import('../src/parts/ViewletLayout/ViewletLayout.ts')

beforeEach(() => {
  jest.resetAllMocks()
  // @ts-ignore
  Preferences.get.mockImplementation(() => undefined)
  // @ts-ignore
  Product.getBackendUrl.mockImplementation(() => 'https://backend-2-975h.onrender.com/')
})

test('create uses configured backend url', () => {
  // @ts-ignore
  Preferences.get.mockImplementation((key) => {
    if (key === 'layout.backendUrl') {
      return 'https://example.com/'
    }
    return undefined
  })

  const state = ViewletLayout.create(1)

  expect(state.backendUrl).toBe('https://example.com/')
})

test('create falls back to product backend url', () => {
  const state = ViewletLayout.create(1)

  expect(state.backendUrl).toBe('https://backend-2-975h.onrender.com/')
})

test('getBackendUrl returns backend url from layout state', () => {
  expect(
    // @ts-ignore
    ViewletLayout.getBackendUrl({
      backendUrl: 'https://example.com/',
    }),
  ).toBe('https://example.com/')
})
