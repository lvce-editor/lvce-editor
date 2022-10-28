import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const ViewletSimpleBrowser = await import(
  '../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowser.js'
)

const Command = await import('../src/parts/Command/Command.js')
const ViewletSimpleBrowserOpenExternal = await import(
  '../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowserOpenExternal.js'
)

test('openExternal', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  const state = {
    ...ViewletSimpleBrowser.create(),
    iframeSrc: 'test://example.com',
  }
  await ViewletSimpleBrowserOpenExternal.openExternal(state)
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith(
    'Open.openExternal',
    'test://example.com'
  )
})

test('openExternal - error', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  const state = {
    ...ViewletSimpleBrowser.create(),
    iframeSrc: 'test://example.com',
  }
  await expect(
    ViewletSimpleBrowserOpenExternal.openExternal(state)
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
