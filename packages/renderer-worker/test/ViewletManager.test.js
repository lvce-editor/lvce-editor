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

const Command = await import('../src/parts/Command/Command.js')
const ViewletManager = await import('../src/parts/ViewletManager/ViewletManager.js')
const ViewletExtensionViewRender = await import('../src/parts/ViewletExtensionView/ViewletExtensionViewRender.ts')

test('render adds uid to setPatches command', () => {
  const patches = [{ type: 1 }]
  const mockModule = {
    render: [
      {
        apply() {
          return ['Viewlet.setPatches', patches]
        },
        isEqual() {
          return false
        },
      },
    ],
  }

  const commands = ViewletManager.render(mockModule, {}, {}, 42)

  expect(commands).toEqual([['Viewlet.setPatches', 42, patches]])
})

test('extension view render supports functional events', () => {
  expect(ViewletExtensionViewRender.hasFunctionalEvents).toBe(true)
})

test('concurrent side effect commands preserve completed state changes', async () => {
  const createDeferred = () => {
    let resolve = () => {}
    /** @type {Promise<void>} */
    const promise = new Promise((resolvePromise) => {
      resolve = resolvePromise
    })
    return { promise, resolve }
  }
  const mainDeferred = createDeferred()
  const titleBarDeferred = createDeferred()
  const activityBarDeferred = createDeferred()
  // @ts-ignore
  RendererProcess.invoke.mockResolvedValue(undefined)
  const mockModule = {
    CommandsWithSideEffects: {
      loadActivityBar: async (state) => {
        await activityBarDeferred.promise
        return {
          commands: [],
          newState: {
            ...state,
            activityBarId: 3,
          },
        }
      },
      loadMain: async (state) => {
        await mainDeferred.promise
        return {
          commands: [],
          newState: {
            ...state,
            mainId: 1,
          },
        }
      },
      loadTitleBar: async (state) => {
        await titleBarDeferred.promise
        return {
          commands: [],
          newState: {
            ...state,
            titleBarId: 2,
          },
        }
      },
    },
    create: jest.fn(() => ({
      activityBarId: -1,
      mainId: -1,
      titleBarId: -1,
      uid: 7,
    })),
    hasFunctionalEvents: true,
    hasFunctionalRender: true,
    hasFunctionalRootRender: true,
    loadContent: jest.fn((state) => state),
    render: [
      {
        apply: jest.fn(() => []),
        isEqual: jest.fn(() => false),
      },
    ],
  }
  const getModule = async () => mockModule

  const viewlet = {
    disposed: false,
    focus: false,
    getModule,
    id: 'ConcurrentLayout',
    show: false,
    type: 0,
    uid: 7,
    uri: '',
  }
  await ViewletManager.load(viewlet)

  const mainPromise = Command.execute('ConcurrentLayout.loadMain')
  const titleBarPromise = Command.execute('ConcurrentLayout.loadTitleBar')
  const activityBarPromise = Command.execute('ConcurrentLayout.loadActivityBar')
  await Promise.resolve()
  mainDeferred.resolve()
  await mainPromise
  titleBarDeferred.resolve()
  await titleBarPromise
  activityBarDeferred.resolve()
  await activityBarPromise

  expect(ViewletStates.getState('ConcurrentLayout')).toMatchObject({
    activityBarId: 3,
    mainId: 1,
    titleBarId: 2,
  })
})

test('extension view render sends a dynamic title to its parent', () => {
  const dom = []
  const oldState = {
    commands: [],
    dom,
    kind: 'virtualDom',
    patches: [],
    title: 'Testing',
  }
  const newState = {
    ...oldState,
    title: 'Testing: Updated',
  }

  const commands = ViewletManager.render(ViewletExtensionViewRender, oldState, newState, 1, 2)

  expect(commands).toEqual([['Viewlet.send', 2, 'setTitle', 'Testing: Updated']])
})

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

test('load should mark the loaded instance as focused for its module type', async () => {
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
  }
  const getModule = async () => {
    return mockModule
  }
  const state = {
    ...ViewletManager.create(getModule, 'chat-debug-instance', 0, 'test', 0, 0, 0, 0),
    disposed: false,
    moduleId: 'ChatDebug',
  }

  await ViewletManager.load(state)

  expect(ViewletStates.getFocusedInstanceByType('ChatDebug')).toBe(1)
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
