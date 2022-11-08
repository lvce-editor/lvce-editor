import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/OutputChannel/OutputChannel.js', () => {
  return {
    open: jest.fn(() => {
      throw new Error('not implemented')
    }),
    close: jest.fn(() => {
      throw new Error('not implemented')
    }),
    getOutputChannels: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const OutputChannel = await import(
  '../src/parts/OutputChannel/OutputChannel.js'
)

const ViewletOutput = await import(
  '../src/parts/ViewletOutput/ViewletOutput.js'
)

test('name', () => {
  expect(ViewletOutput.name).toBe('Output')
})

test('create', () => {
  const state = ViewletOutput.create()
  expect(state).toBeDefined()
})

test('loadContent', async () => {
  // @ts-ignore
  OutputChannel.getOutputChannels.mockImplementation(() => {
    return [
      {
        name: 'Test Channel 1',
        path: '/test/channel-1.txt',
      },
    ]
  })
  // @ts-ignore
  OutputChannel.open.mockImplementation(() => {})
  const state = ViewletOutput.create()
  expect(await ViewletOutput.loadContent(state)).toMatchObject({
    options: [
      {
        name: 'Test Channel 1',
        path: '/test/channel-1.txt',
      },
    ],
  })
  expect(OutputChannel.getOutputChannels).toHaveBeenCalledTimes(1)
  expect(OutputChannel.open).toHaveBeenCalledTimes(1)
  expect(OutputChannel.open).toHaveBeenCalledWith(0, '/test/channel-1.txt')
})

test.skip('setOutputChannel', async () => {
  const state = ViewletOutput.create()
  // @ts-ignore
  OutputChannel.invoke.mockImplementation(() => {
    return null
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ViewletOutput.setOutputChannel(state, '/tmp/log-extension-host.txt')
  expect(OutputChannel.invoke).toHaveBeenCalledTimes(1)
  expect(OutputChannel.invoke).toHaveBeenCalledWith(
    'OutputChannel.open',
    'Output',
    '/tmp/log-extension-host.txt'
  )
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Output',
    'clear'
  )
})

test('dispose', async () => {
  // @ts-ignore
  OutputChannel.close.mockImplementation(() => {})
  const state = ViewletOutput.create()
  await ViewletOutput.dispose(state)
  expect(OutputChannel.close).toHaveBeenCalledTimes(1)
  expect(OutputChannel.close).toHaveBeenCalledWith('Output')
})
