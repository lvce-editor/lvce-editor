import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ExtensionHost/ExtensionHostShared.js',
  () => {
    return {
      execute: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const ExtensionHostOutput = await import(
  '../src/parts/ExtensionHost/ExtensionHostOutput.js'
)
const ExtensionHostShared = await import(
  '../src/parts/ExtensionHost/ExtensionHostShared.js'
)

test('getOutputChannels - error', async () => {
  // @ts-ignore
  ExtensionHostShared.execute.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(ExtensionHostOutput.getOutputChannels()).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('getOutputChannels', async () => {
  // @ts-ignore
  ExtensionHostShared.execute.mockImplementation(() => {
    return [
      {
        file: '/test/log-shared-process.txt',
        name: 'Shared Process',
      },
      {
        file: '/test/log-extension-host.txt',
        name: 'Extension Host',
      },
    ]
  })
  expect(await ExtensionHostOutput.getOutputChannels()).toEqual([
    {
      file: '/test/log-shared-process.txt',
      name: 'Shared Process',
    },
    {
      file: '/test/log-extension-host.txt',
      name: 'Extension Host',
    },
  ])
})
