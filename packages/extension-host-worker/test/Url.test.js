import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Location/Location.js', () => {
  return {
    getOrigin: jest.fn(),
  }
})

const Url = await import('../src/parts/Url/Url.js')
const Location = await import('../src/parts/Location/Location.js')

test('getAbsoluteUrl - source url starts with slash', () => {
  // @ts-ignore
  Location.getOrigin.mockImplementation(() => {
    return 'test://example.com'
  })
  expect(Url.getAbsoluteUrl('./file.txt', '/test/folder/other-file.txt')).toBe('test://example.com/test/folder/file.txt')
})

test('getAbsoluteUrl - source url starts with https', () => {
  // @ts-ignore
  Location.getOrigin.mockImplementation(() => {
    return 'https://example.com'
  })
  expect(Url.getAbsoluteUrl('./file.txt', '/test/folder/other-file.txt')).toBe('https://example.com/test/folder/file.txt')
})
