import { jest } from '@jest/globals'

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

const SharedProcess = await import(
  '../src/parts/SharedProcess/SharedProcess.js'
)

const FindInWorkspace = await import(
  '../src/parts/FindInWorkspace/FindInWorkspace.js'
)

test('findInWorkspace', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'Search.search':
        return []
      default:
        throw new Error('unexpected message')
    }
  })
  expect(await FindInWorkspace.findInWorkspace('test search')).toEqual([])
})

test('findInWorkspace - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async (method, ...params) => {
    throw new TypeError('x is not a function')
  })
  await expect(
    FindInWorkspace.findInWorkspace('test search')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
