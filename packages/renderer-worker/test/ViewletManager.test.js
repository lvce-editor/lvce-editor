import { beforeEach, expect, jest, test } from '@jest/globals'
import { CancelationError } from '../src/parts/Errors/CancelationError.js'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'

beforeEach(() => {
  jest.resetAllMocks()
  ViewletStates.reset()
  ViewletManager.state.pendingModules = Object.create(null)
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/Id/Id.js', () => {
  return {
    create() {
      return 1
    },
  }
})

jest.unstable_mockModule('../src/parts/ErrorHandling/ErrorHandling.js', () => {
  return {
    handleError() {},
  }
})

const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')

const ViewletManager = await import('../src/parts/ViewletManager/ViewletManager.js')

test.skip('load', async () => {
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
  const state = ViewletManager.create(getModule, 'test', 0, '', 0, 0, 0, 0)
  // @ts-ignore
  await ViewletManager.load(state)
  expect(mockModule.create).toHaveBeenCalledTimes(1)
  expect(mockModule.loadContent).toHaveBeenCalledTimes(1)
  expect(mockModule.loadContent).toHaveBeenCalledWith({ x: 0 })
  expect(mockModule.contentLoaded).toHaveBeenCalledTimes(1)
  expect(mockModule.contentLoaded).toHaveBeenCalledWith({ x: 42 })
  expect(ViewletStates.getInstance('test')).toBeDefined()
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
  const state = ViewletManager.create(getModule, 'test', 0, 'test', 0, 0, 0, 0)
  // @ts-ignore
  const promise = ViewletManager.load(state)
  state.version++
  await promise
  expect(mockModule.create).toHaveBeenCalledTimes(1)
  expect(mockModule.loadContent).toHaveBeenCalledTimes(1)
  // @ts-ignore
  expect(mockModule.loadContent).toHaveBeenCalledWith({ uid: 1, x: 0, version: 11 }, undefined)
  expect(mockModule.contentLoaded).not.toHaveBeenCalled()
})

test.skip('load - error - no create method', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const getModule = async () => {
    return {}
  }
  const state = ViewletManager.create(getModule, 'test', 0, 'test', 0, 0, 0, 0)
  // @ts-ignore
  expect(await ViewletManager.load(state)).toEqual([
    ['Viewlet.create', 'Error', 1],
    ['Viewlet.setBounds', 1, 0, 0, 0, 0],
    ['Viewlet.send', 1, 'setMessage', 'TypeError: module.create is not a function'],
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(3)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(2, 'Viewlet.loadModule', '')
})

test.skip('load - error - create method throws error', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const getModule = async () => {
    return {
      create() {
        throw new TypeError('x is not a function')
      },
    }
  }
  const state = ViewletManager.create(getModule, '', 0, '', 0, 0, 0, 0)
  // @ts-ignore
  expect(await ViewletManager.load(state)).toEqual([
    ['Viewlet.create', 'Error', 1],
    ['Viewlet.setBounds', 1, 0, 0, 0, 0],
    ['Viewlet.send', 1, 'setMessage', 'TypeError: x is not a function'],
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(3)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(2, 'Viewlet.loadModule', '')
})

test.skip('load - error - no loadContent method', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const getModule = async () => {
    return {
      create() {
        return {}
      },
    }
  }
  const state = ViewletManager.create(getModule, '', 0, '', 0, 0, 0, 0)
  // @ts-ignore
  expect(await ViewletManager.load(state)).toEqual([
    ['Viewlet.create', 'Error', 1],
    ['Viewlet.setBounds', 1, 0, 0, 0, 0],
    ['Viewlet.send', 1, 'setMessage', 'TypeError: module.loadContent is not a function'],
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(3)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(2, 'Viewlet.loadModule', '')
})

test.skip('load - error - loadContent method throws error', async () => {
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
  const state = ViewletManager.create(getModule, '', 0, '', 0, 0, 0, 0)
  // @ts-ignore
  expect(await ViewletManager.load(state)).toEqual([
    ['Viewlet.create', 'Error', 1],
    ['Viewlet.setBounds', 1, 0, 0, 0, 0],
    ['Viewlet.send', 1, 'setMessage', 'TypeError: x is not a function'],
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(3)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(2, 'Viewlet.loadModule', '')
})

test.skip('load - error - contentLoaded is not of type function', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const getModule = async () => {
    return {
      create() {
        return {}
      },
      async loadContent(state) {
        return {
          ...state,
        }
      },
      contentLoaded: 1,
    }
  }
  const state = ViewletManager.create(getModule, '', 0, '', 0, 0, 0, 0)
  // @ts-ignore
  expect(await ViewletManager.load(state)).toEqual([
    ['Viewlet.create', 'Error', 1],
    ['Viewlet.setBounds', 1, 0, 0, 0, 0],
    ['Viewlet.send', 1, 'setMessage', 'TypeError: module.contentLoaded is not a function'],
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(3)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(2, 'Viewlet.loadModule', '')
})

test.skip('load - error - contentLoaded method throws error', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const getModule = async () => {
    return {
      create() {
        return {}
      },
      async loadContent(state) {
        return {
          ...state,
        }
      },
      contentLoaded() {
        throw new TypeError('x is not a function')
      },
    }
  }
  const state = ViewletManager.create(getModule, '', 0, '', 0, 0, 0, 0)
  // @ts-ignore
  expect(await ViewletManager.load(state)).toEqual([
    ['Viewlet.create', 'Error', 1],
    ['Viewlet.setBounds', 1, 0, 0, 0, 0],
    ['Viewlet.send', 1, 'setMessage', 'TypeError: x is not a function'],
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(3)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(2, 'Viewlet.loadModule', '')
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(3, 'Viewlet.loadModule', 'Error')
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.loadModule', '')
})

test('load - canceled', async () => {
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
      throw new CancelationError()
    }),
    contentLoaded: jest.fn(),
  }
  const getModule = async () => {
    return mockModule
  }
  const state = ViewletManager.create(getModule, 'test', 0, '', 0, 0, 0, 0)
  // @ts-ignore
  await ViewletManager.load(state)
  expect(mockModule.create).toHaveBeenCalledTimes(1)
  expect(mockModule.loadContent).toHaveBeenCalledTimes(1)
  // @ts-ignore
  expect(mockModule.loadContent).toHaveBeenCalledWith({ uid: 1, x: 0, version: 1 }, undefined)
  expect(mockModule.contentLoaded).not.toHaveBeenCalled()
  expect(ViewletStates.getInstance('test')).toBeUndefined()
})

test('load - does not call Viewlet.loadModule for Editor', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const mockModule = {
    hasFunctionalEvents: true,
    hasFunctionalRootRender: true,
    create: jest.fn(() => {
      return {
        x: 0,
      }
    }),
    loadContent: jest.fn(async () => {
      return {
        uid: 1,
        x: 1,
      }
    }),
  }
  const getModule = async () => {
    return mockModule
  }
  const state = ViewletManager.create(getModule, 'Editor', 0, '', 0, 0, 0, 0)
  // @ts-ignore
  const commands = await ViewletManager.load(state)
  expect(commands).toEqual(expect.arrayContaining([['Viewlet.createFunctionalRoot', 'Editor', 1, true]]))
  expect(RendererProcess.invoke).not.toHaveBeenCalledWith('Viewlet.loadModule', 'Editor')
})

test.skip('load - shouldApplyNewState returns false', async () => {
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
      return {
        // @ts-ignore
        ...state,
        x: 1,
      }
    }),
    contentLoaded: jest.fn(),
    shouldApplyNewState() {
      return false
    },
  }
  const getModule = async () => {
    return mockModule
  }
  const state = ViewletManager.create(getModule, 'test', 0, '', 0, 0, 0, 0)
  // @ts-ignore
  await ViewletManager.load(state)
  expect(mockModule.create).toHaveBeenCalledTimes(1)
  expect(mockModule.loadContent).toHaveBeenCalledTimes(1)
  expect(mockModule.loadContent).toHaveBeenCalledWith({ x: 0, version: 1 })
  expect(mockModule.contentLoaded).not.toHaveBeenCalled()
  expect(ViewletStates.getInstance('test')).toBeUndefined()
})

test('backgroundLoad', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const mockModule = {
    create: jest.fn(() => {
      return {
        value: 0,
      }
    }),
    backgroundLoadContent: jest.fn(async (state, savedState) => {
      return {
        title: 'Test Title',
        uri: 'test://1',
      }
    }),
  }
  const getModule = jest.fn(async () => {
    return mockModule
  })
  const { title, uri } = await ViewletManager.backgroundLoad({
    getModule,
    id: 'test',
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    props: {
      value: 42,
    },
  })
  expect(title).toBe('Test Title')
  expect(uri).toBe('test://1')
  expect(getModule).toHaveBeenCalledTimes(1)
  // @ts-ignore
  expect(getModule).toHaveBeenCalledWith('test')
  expect(mockModule.backgroundLoadContent).toHaveBeenCalledTimes(1)
  expect(mockModule.backgroundLoadContent).toHaveBeenCalledWith(
    {
      value: 0,
    },
    { value: 42 },
  )
})
