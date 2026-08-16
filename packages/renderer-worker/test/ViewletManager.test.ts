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

jest.unstable_mockModule('../src/parts/PrettyError/PrettyError.js', () => {
  return {
    prepare: async (error: any) => ({
      codeFrame: error.codeFrame || '',
      message: error.message,
      stack: '    at treeToArray (editorWorkerMain.js:10:8)',
      type: error.name,
    }),
    getMessage: (error: any) => `${error.type}: ${error.message}`,
    print: async () => {},
  }
})

const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')

const Command = await import('../src/parts/Command/Command.js')
const ViewletManager = await import('../src/parts/ViewletManager/ViewletManager.js')
const ViewletExtensionViewRender = await import('../src/parts/ViewletExtensionView/ViewletExtensionViewRender.ts')
const ViewletLayout = await import('../src/parts/ViewletLayout/ViewletLayout.ipc.js')

test('runLoadContentLater starts deferred loading once', async () => {
  const loadContentLater = jest.fn(async (_state: unknown) => {})
  const viewletState = { uid: 42 }
  ViewletStates.set(42, {
    factory: {
      Commands: {
        loadContentLater,
      },
    },
    renderedState: viewletState,
    state: viewletState,
  })

  ViewletManager.runLoadContentLater(42)
  ViewletManager.runLoadContentLater(42)
  await Promise.resolve()

  expect(loadContentLater).toHaveBeenCalledTimes(1)
  expect(loadContentLater).toHaveBeenCalledWith(viewletState)
})

test('waitForLoadContentLater waits for deferred loading to finish', async () => {
  let finishLoading: () => void = () => {}
  const loading = new Promise<void>((resolve) => {
    finishLoading = resolve
  })
  const loadContentLater = jest.fn(() => loading)
  const viewletState = { uid: 42 }
  ViewletStates.set(42, {
    factory: {
      Commands: {
        loadContentLater,
      },
    },
    renderedState: viewletState,
    state: viewletState,
  })

  ViewletManager.runLoadContentLater(42)
  let finished = false
  const waiting = ViewletManager.waitForLoadContentLater(42).then(() => {
    finished = true
  })
  await Promise.resolve()
  expect(finished).toBe(false)

  finishLoading()
  await waiting

  expect(finished).toBe(true)
})

test('runLoadContentLaterForCreatedViewlets starts deferred loading for newly rendered viewlets', async () => {
  const loadContentLater = jest.fn(async (_state: unknown) => {})
  const viewletState = { uid: 42 }
  ViewletStates.set(42, {
    factory: {
      Commands: {
        loadContentLater,
      },
    },
    renderedState: viewletState,
    state: viewletState,
  })

  ViewletManager.runLoadContentLaterForCreatedViewlets([['Viewlet.createFunctionalRoot', 'EditorText', 42, true]])
  await Promise.resolve()

  expect(loadContentLater).toHaveBeenCalledTimes(1)
  expect(loadContentLater).toHaveBeenCalledWith(viewletState)
})

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

test('render sends action updates to a linked actions root', () => {
  const oldState = {
    uid: 42,
    viewMode: 1,
  }
  const newState = {
    ...oldState,
    viewMode: 2,
  }
  const mockModule = {
    render: [],
    renderActions: {
      apply() {
        return ['updated-actions']
      },
      isEqual() {
        return false
      },
    },
  }
  ViewletStates.set(42, {
    actionsUid: 99,
    factory: mockModule,
    renderedState: oldState,
    state: newState,
  })

  const commands = ViewletManager.render(mockModule, oldState, newState, 42, -1)

  expect(commands).toEqual([['Viewlet.setDom2', 99, ['updated-actions']]])
})

test('load omits empty event listener registration for a new root', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockResolvedValue(undefined)
  const mockModule = {
    create: jest.fn(() => ({ uid: 9 })),
    hasFunctionalEvents: true,
    hasFunctionalRender: true,
    hasFunctionalRootRender: true,
    loadContent: jest.fn((state) => state),
    render: [],
    renderEventListeners: jest.fn(() => []),
  }

  const viewlet = {
    disposed: false,
    getModule: async () => mockModule,
    id: 'EmptyListenerTest',
    shouldRenderEvents: false,
    show: false,
    type: 0,
    uid: 9,
    uri: '',
  }
  const commands = await ViewletManager.load(viewlet)

  expect(commands).toEqual([['Viewlet.createFunctionalRoot', 'EmptyListenerTest', 9, true]])
})

test('load associates a direct-render root with its worker rpc', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockResolvedValue(undefined)
  const Commands = {}
  Object.defineProperty(Commands, '__directEventRpcId', {
    value: 'TestWorker',
  })
  const mockModule = {
    Commands,
    create: jest.fn(() => ({ uid: 9 })),
    hasDirectRender: true,
    hasFunctionalEvents: true,
    hasFunctionalRender: true,
    hasFunctionalRootRender: true,
    loadContent: jest.fn((state) => state),
    render: [],
    renderEventListeners: jest.fn(() => []),
  }
  const viewlet = {
    disposed: false,
    getModule: async () => mockModule,
    id: 'DirectEventTest',
    shouldRenderEvents: false,
    show: false,
    type: 0,
    uid: 9,
    uri: '',
  }

  const commands = await ViewletManager.load(viewlet)

  expect(commands).toEqual([['Viewlet.createFunctionalRoot', 'DirectEventTest', 9, true, 'TestWorker']])
})

test('load does not invoke the renderer for empty event listeners on a new root', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockResolvedValue(undefined)
  const mockModule = {
    create: jest.fn(() => ({ uid: 10 })),
    hasFunctionalEvents: true,
    hasFunctionalRender: true,
    hasFunctionalRootRender: true,
    loadContent: jest.fn((state) => state),
    render: [],
    renderEventListeners: jest.fn(() => []),
  }

  const viewlet = {
    disposed: false,
    getModule: async () => mockModule,
    id: 'DirectEmptyListenerTest',
    show: false,
    type: 0,
    uid: 10,
    uri: '',
  }
  await ViewletManager.load(viewlet)

  expect(RendererProcess.invoke).not.toHaveBeenCalledWith('Viewlet.registerEventListeners', 10, [])
})

test('load retains non-empty event listener registration for a new root', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockResolvedValue(undefined)
  const eventListeners = [{ name: 'click', params: ['handleClick'] }]
  const mockModule = {
    create: jest.fn(() => ({ uid: 11 })),
    hasFunctionalEvents: true,
    hasFunctionalRender: true,
    hasFunctionalRootRender: true,
    loadContent: jest.fn((state) => state),
    render: [],
    renderEventListeners: jest.fn(() => eventListeners),
  }

  const viewlet = {
    disposed: false,
    getModule: async () => mockModule,
    id: 'NonEmptyListenerTest',
    shouldRenderEvents: false,
    show: false,
    type: 0,
    uid: 11,
    uri: '',
  }
  const commands = await ViewletManager.load(viewlet)

  expect(commands).toEqual([
    ['Viewlet.registerEventListeners', 11, eventListeners],
    ['Viewlet.createFunctionalRoot', 'NonEmptyListenerTest', 11, true],
  ])
})

test('load restores state from a viewlet instance storage key', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation((command, _storageType, key) => {
    if (command === 'WebStorage.getItem') {
      expect(key).toBe('viewlet::search-editor://1/Search')
      return JSON.stringify({ value: 'needle' })
    }
    return undefined
  })
  const mockModule = {
    create: jest.fn(() => ({ uid: 12, uri: 'search-editor://1/Search' })),
    getStorageKey: (state) => state.uri,
    hasFunctionalEvents: true,
    hasFunctionalRender: true,
    hasFunctionalRootRender: true,
    loadContent: jest.fn((state, _savedState) => state),
    render: [],
    renderEventListeners: jest.fn(() => []),
  }
  const viewlet = {
    disposed: false,
    getModule: async () => mockModule,
    id: 'Search',
    shouldRenderEvents: false,
    show: false,
    type: 0,
    uid: 12,
    uri: 'search-editor://1/Search',
  }

  await ViewletManager.load(viewlet, false, true)

  expect(mockModule.loadContent).toHaveBeenCalledWith(expect.objectContaining({ uri: 'search-editor://1/Search' }), { value: 'needle' })
})

test('load reconciles widget declarations before returning initial render commands', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockResolvedValue(undefined)
  const layoutState = ViewletLayout.create(1)
  ViewletStates.set(1, {
    factory: {},
    moduleId: 'Layout',
    renderedState: layoutState,
    state: layoutState,
  })
  ViewletStates.set('Layout', ViewletStates.getInstance(1))
  const mockModule = {
    create: jest.fn(() => ({ uid: 9 })),
    hasFunctionalEvents: true,
    hasFunctionalRender: true,
    hasFunctionalRootRender: true,
    loadContent: jest.fn((state) => state),
    render: [
      {
        apply: jest.fn(() => [['Viewlet.setWidgets', 9, 1, [20]]]),
        isEqual: jest.fn(() => false),
        multiple: true,
      },
    ],
    renderEventListeners: jest.fn(() => []),
  }
  const viewlet = {
    disposed: false,
    getModule: async () => mockModule,
    id: 'WidgetOwnerTest',
    shouldRenderEvents: false,
    show: false,
    type: 0,
    uid: 9,
    uri: '',
  }

  const commands = await ViewletManager.load(viewlet)

  expect(commands.some((command) => command[0] === 'Viewlet.setWidgets')).toBe(false)
  expect(ViewletStates.getState('Layout').widgetReferences).toEqual([{ parentUid: 9, uid: 20 }])
})

test('extension view render supports functional events', () => {
  expect(ViewletExtensionViewRender.hasFunctionalEvents).toBe(true)
})

test('extension view applies scroll position after patches', () => {
  const actionsDom: readonly unknown[] = []
  const dom: readonly unknown[] = []
  const oldState = {
    actionsDom,
    commands: [],
    css: '',
    cssId: '',
    dom,
    focusSelector: '',
    kind: 'virtualDom',
    patches: [],
    title: 'Testing',
    uid: 1,
  }
  const patches = [{ type: 1 }]
  const newState = {
    ...oldState,
    commands: [['Viewlet.setProperty', 1, '.Messages', 'scrollTop', 9_999_999]],
    patches,
  }

  const commands = ViewletManager.render(ViewletExtensionViewRender, oldState, newState, 1)

  expect(commands).toEqual([
    ['Viewlet.setPatches', 1, patches],
    ['Viewlet.setProperty', 1, '.Messages', 'scrollTop', 9_999_999],
  ])
})

test('concurrent side effect commands preserve completed state changes', async () => {
  const createDeferred = () => {
    let resolve: () => void = () => {}
    const promise = new Promise<void>((resolvePromise) => {
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

test('functional getStatusBarVisible command returns its boolean value', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockResolvedValue(undefined)
  const mockModule = {
    Commands: {
      getStatusBarVisible: (state) => state.statusBarVisible,
    },
    create: jest.fn(() => ({
      statusBarVisible: false,
      uid: 8,
    })),
    hasFunctionalRender: true,
    hasFunctionalRootRender: true,
    loadContent: jest.fn((state) => state),
    render: [],
  }
  const getModule = async () => mockModule
  const viewlet = {
    disposed: false,
    focus: false,
    getModule,
    id: 'StatusBarQueryTest',
    show: false,
    type: 0,
    uid: 8,
    uri: '',
  }

  await ViewletManager.load(viewlet)

  await expect(Command.execute('StatusBarQueryTest.getStatusBarVisible')).resolves.toBe(false)
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

test('extension view render does not send a dynamic title to the root parent sentinel', () => {
  const oldState = {
    commands: [],
    dom: [],
    kind: 'virtualDom',
    patches: [],
    title: 'Testing',
  }
  const newState = {
    ...oldState,
    title: 'Testing: Updated',
  }

  const commands = ViewletManager.render(ViewletExtensionViewRender, oldState, newState, 1, -1)

  expect(commands).toEqual([])
})

test('extension view render keeps the parent actions state in sync', () => {
  const parentState = {
    actionsUid: 3,
    childUid: 1,
    pending: true,
    uid: 2,
  }
  const parentRenderedState = {
    ...parentState,
    pending: false,
  }
  ViewletStates.set(2, {
    factory: {
      setActionsDom(state, actionsDom) {
        return {
          commands: [['Viewlet.setDom2', state.actionsUid, actionsDom]],
          handled: true,
          renderParent: false,
          statePatch: {},
        }
      },
    },
    renderedState: parentRenderedState,
    state: parentState,
  })
  const dom = []
  const oldState = {
    actionsDom: ['old-actions'],
    commands: [],
    dom,
    kind: 'virtualDom',
    patches: [],
    title: 'Testing',
  }
  const newState = {
    ...oldState,
    actionsDom: ['new-actions'],
  }

  const commands = ViewletManager.render(ViewletExtensionViewRender, oldState, newState, 1, 2)

  expect(commands).toEqual([['Viewlet.setDom2', 3, ['new-actions']]])
  expect(ViewletStates.getState(2)).toEqual(parentState)
  expect(ViewletStates.getInstance(2).renderedState).toEqual(parentRenderedState)
})

test('repeated stale extension action renders do not send unsupported commands to the renderer process', () => {
  const parentState = {
    ...ViewletLayout.create(3),
    previewId: 8,
  }
  ViewletStates.set(3, {
    factory: ViewletLayout,
    renderedState: parentState,
    state: parentState,
  })

  const commands = Array.from({ length: 100 }, (_, index) => {
    const oldState = {
      actionsDom: [`old-actions-${index}`],
      commands: [],
      dom: [],
      kind: 'virtualDom',
      patches: [],
      title: 'Testing',
    }
    const newState = {
      ...oldState,
      actionsDom: [`new-actions-${index}`],
    }
    return ViewletManager.render(ViewletExtensionViewRender, oldState, newState, 7, 3)
  }).flat()

  expect(commands).toEqual([])
})

test('extension view render creates preview actions and adds them to the layout', () => {
  const parentState = {
    ...ViewletLayout.create(2),
    previewActionsEventListeners: ['click'],
    previewId: 7,
    previewViewletId: 'ExtensionView',
    previewVisible: true,
  }
  ViewletStates.set(2, {
    factory: ViewletLayout,
    renderedState: parentState,
    state: parentState,
  })
  const dom = []
  const oldState = {
    actionsDom: [],
    commands: [],
    dom,
    kind: 'virtualDom',
    parentUid: 2,
    patches: [],
    title: 'Testing',
  }
  const newState = {
    ...oldState,
    actionsDom: ['new-actions'],
  }

  const commands = ViewletManager.render(ViewletExtensionViewRender, oldState, newState, 7, 2)

  expect(commands.slice(0, 4)).toEqual([
    ['Viewlet.createFunctionalRoot', 'ExtensionView', 1, true],
    ['Viewlet.registerEventListeners', 1, ['click']],
    ['Viewlet.setDom2', 1, ['new-actions']],
    ['Viewlet.setUid', 1, 7],
  ])
  expect(commands[4][0]).toBe('Viewlet.setDom2')
  expect(ViewletStates.getState(2).previewActionsUid).toBe(1)
})

test('extension view render keeps the parent title state in sync', () => {
  const parentRenderedState = {
    childUid: 1,
    pending: false,
    title: 'Testing',
    uid: 2,
  }
  const parentState = {
    ...parentRenderedState,
    pending: true,
  }
  ViewletStates.set(2, {
    factory: {
      render: [
        {
          apply(_oldState, newState) {
            return ['Viewlet.setDom2', [newState.title]]
          },
          isEqual(oldState, newState) {
            return oldState.title === newState.title
          },
        },
      ],
      setTitle(state, title) {
        return {
          ...state,
          title,
        }
      },
    },
    renderedState: parentRenderedState,
    state: parentState,
  })
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

  expect(commands).toEqual([['Viewlet.setDom2', 2, ['Testing: Updated']]])
  expect(ViewletStates.getState(2)).toEqual({
    childUid: 1,
    pending: true,
    title: 'Testing: Updated',
    uid: 2,
  })
  expect(ViewletStates.getInstance(2).renderedState).toEqual({
    childUid: 1,
    pending: false,
    title: 'Testing: Updated',
    uid: 2,
  })
})

test('extension view render sends a title command while loading a new child', () => {
  const parentState = {
    childUid: 3,
    title: 'Search',
    uid: 2,
  }
  ViewletStates.set(2, {
    factory: {
      setTitle(state, title) {
        return {
          ...state,
          title,
        }
      },
    },
    renderedState: parentState,
    state: parentState,
  })
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
  expect(ViewletStates.getState(2)).toBe(parentState)
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

test('load - custom error renderer preserves the original error and does not append a detached viewlet', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockResolvedValue(undefined)
  const error = new RangeError('Maximum call stack size exceeded')
  // @ts-ignore
  error.codeFrame = `  10 | result.push(...treeToArray(child))
     |        ^`
  const errorDom = [{ childCount: 0, type: 1 }]
  const renderError = jest.fn((_error: unknown, _message: string) => errorDom)
  const getModule = async (id?: string) => {
    if (id === 'EditorTextError') {
      return {
        render: renderError,
      }
    }
    return {
      create() {
        return {
          uid: 42,
        }
      },
      customErrorRenderer: 'EditorTextError',
      loadContent() {
        throw error
      },
    }
  }
  const viewlet = {
    append: false,
    disposed: false,
    getModule,
    id: 'EditorText',
    parentUid: -1,
    setBounds: false,
    show: false,
    type: 0,
    uid: 42,
    uri: '/tmp/large.heapsnapshot',
  }

  const commands = await ViewletManager.load(viewlet)

  expect(renderError).toHaveBeenCalledWith(
    error,
    `RangeError: Maximum call stack size exceeded

  10 | result.push(...treeToArray(child))
     |        ^

    at treeToArray (editorWorkerMain.js:10:8)`,
  )
  expect(commands).toEqual([
    ['Viewlet.create', 'Error', 42],
    ['Viewlet.create', 'EditorTextError', 42],
    ['Viewlet.setDom2', 42, errorDom],
  ])
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
