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

const OutputChannel = await import(
  '../src/parts/OutputChannel/OutputChannel.js'
)

test('open', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {})
  await OutputChannel.open(0, '/test/channel-1')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'OutputChannel.open',
    0,
    '/test/channel-1'
  )
})

test('open - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(OutputChannel.open(0, '/test/channel-1')).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})
