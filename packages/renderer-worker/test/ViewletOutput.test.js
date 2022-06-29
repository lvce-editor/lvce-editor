import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/RendererProcess/RendererProcess.js',
  () => {
    return {
      invoke: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)
jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)
const SharedProcess = await import(
  '../src/parts/SharedProcess/SharedProcess.js'
)

const ViewletOutput = await import('../src/parts/Viewlet/ViewletOutput.js')

test('name', () => {
  expect(ViewletOutput.name).toBe('Output')
})

test('create', () => {
  const state = ViewletOutput.create()
  expect(state).toBeDefined()
})

test.skip('loadContent', async () => {
  const state = ViewletOutput.create()
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {
    return null
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  expect(await ViewletOutput.loadContent(state)).toEqual({})
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'OutputChannel.open',
    0,
    '/tmp/log-shared-process.txt'
  )
})

test.skip('contentLoaded', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletOutput.create(),
    options: [
      {
        file: '/tmp/log-shared-process.txt',
        name: 'Shared Process',
      },
      {
        file: '/tmp/log-extension-host.txt',
        name: 'Extension Host',
      },
    ],
    index: 0,
  }
  await ViewletOutput.contentLoaded(state)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    3024,
    'Output',
    'setOptions',
    [
      {
        file: '/tmp/log-shared-process.txt',
        name: 'Shared Process',
      },
      {
        file: '/tmp/log-extension-host.txt',
        name: 'Extension Host',
      },
    ],
    -1
  )
})

test('setOutputChannel', async () => {
  const state = ViewletOutput.create()
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {
    return null
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ViewletOutput.setOutputChannel(state, '/tmp/log-extension-host.txt')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'OutputChannel.open',
    'Output',
    '/tmp/log-extension-host.txt'
  )
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(3024, 'Output', 'clear')
})

test('dispose', async () => {
  const state = ViewletOutput.create()
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {
    return null
  })
  await ViewletOutput.dispose(state)
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'OutputChannel.close',
    'Output'
  )
})

test('handleError', () => {
  const state = ViewletOutput.create()
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  ViewletOutput.handleError(
    state,
    new Error(`ENOENT: no such file or directory, access '/tmp/log-main.txt'`)
  )
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(
    new Error(`ENOENT: no such file or directory, access '/tmp/log-main.txt'`)
  )
})
