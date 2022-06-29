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

const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)

const ViewletManager = await import(
  '../src/parts/ViewletManager/ViewletManager.js'
)

test('load', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const mockModule = {
    create: jest.fn(() => {
      return {
        x: 0,
      }
    }),
    loadContent: jest.fn(async (state) => {
      return {
        // @ts-ignore
        ...state,
        x: 42,
      }
    }),
    contentLoaded: jest.fn(),
  }
  const getModule = async () => {
    return mockModule
  }
  const state = ViewletManager.create(getModule, '', '', '', 0, 0, 0, 0)
  await ViewletManager.load(state)
  expect(mockModule.create).toHaveBeenCalledTimes(1)
  expect(mockModule.loadContent).toHaveBeenCalledTimes(1)
  expect(mockModule.loadContent).toHaveBeenCalledWith({ x: 0 })
  expect(mockModule.contentLoaded).toHaveBeenCalledTimes(1)
  expect(mockModule.contentLoaded).toHaveBeenCalledWith({ x: 42 })
})

test('load - race condition', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const mockModule = {
    create: jest.fn(() => {
      return {
        x: 0,
        version: 0,
      }
    }),
    loadContent: jest.fn(async (state) => {
      // @ts-ignore
      state.version = 11
      return {
        // @ts-ignore
        ...state,
        x: 42,
      }
    }),
    contentLoaded: jest.fn(),
  }
  const getModule = async () => {
    return mockModule
  }
  const state = ViewletManager.create(getModule, '', '', '', 0, 0, 0, 0)
  // @ts-ignore
  const promise = ViewletManager.load(state)
  state.version++
  await promise
  expect(mockModule.create).toHaveBeenCalledTimes(1)
  expect(mockModule.loadContent).toHaveBeenCalledTimes(1)
  expect(mockModule.loadContent).toHaveBeenCalledWith({ x: 0, version: 11 })
  expect(mockModule.contentLoaded).not.toHaveBeenCalled()
})

test('load - error - no create method', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const getModule = async () => {
    return {}
  }
  const state = ViewletManager.create(getModule, '', '', '', 0, 0, 0, 0)
  await ViewletManager.load(state)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(
    2,
    3031,
    '',
    '',
    'module.create is not a function'
  )
})

test('load - error - create method throws error', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const getModule = async () => {
    return {
      create() {
        throw new TypeError('x is not a function')
      },
    }
  }
  const state = ViewletManager.create(getModule, '', '', '', 0, 0, 0, 0)
  await ViewletManager.load(state)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(
    2,
    3031,
    '',
    '',
    'x is not a function'
  )
})

test('load - error - no loadContent method', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const getModule = async () => {
    return {
      create() {
        return {}
      },
    }
  }
  const state = ViewletManager.create(getModule, '', '', '', 0, 0, 0, 0)
  await ViewletManager.load(state)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(
    2,
    3031,
    '',
    '',
    'module.loadContent is not a function'
  )
})

test('load - error - loadContent method throws error', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const getModule = async () => {
    return {
      create() {
        return {
          x: 0,
        }
      },
      loadContent() {
        throw new TypeError('x is not a function')
      },
    }
  }
  const state = ViewletManager.create(getModule, '', '', '', 0, 0, 0, 0)
  await ViewletManager.load(state)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(
    2,
    3031,
    '',
    '',
    'x is not a function'
  )
})

test('load - error - no contentLoaded method', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const getModule = async () => {
    return {
      create() {
        return {}
      },
      async loadContent() {},
    }
  }
  const state = ViewletManager.create(getModule, '', '', '', 0, 0, 0, 0)
  await ViewletManager.load(state)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(
    2,
    3031,
    '',
    '',
    'module.contentLoaded is not a function' // TODO should include TypeError
  )
})

test('load - error - contentLoaded method throws error', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const getModule = async () => {
    return {
      create() {
        return {}
      },
      async loadContent() {},
      contentLoaded() {
        throw new TypeError('x is not a function')
      },
    }
  }
  const state = ViewletManager.create(getModule, '', '', '', 0, 0, 0, 0)
  await ViewletManager.load(state)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(1, 3030, '')
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    3031,
    '',
    '',
    'x is not a function'
  )
})
