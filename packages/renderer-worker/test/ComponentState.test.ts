import { beforeEach, expect, jest, test } from '@jest/globals'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'

jest.unstable_mockModule('../src/parts/EditorWorker/EditorWorker.ts', () => ({
  invoke: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({
  invoke: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/ViewletManager/ViewletManager.js', () => ({
  render: jest.fn(() => []),
}))

jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => ({
  executeViewletCommand: jest.fn(),
  reload: jest.fn(),
}))

const EditorWorker = await import('../src/parts/EditorWorker/EditorWorker.ts')
const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const Viewlet = await import('../src/parts/Viewlet/Viewlet.js')
const ViewletManager = await import('../src/parts/ViewletManager/ViewletManager.js')
const ComponentState = await import('../src/parts/ComponentState/ComponentState.js')

beforeEach(() => {
  jest.resetAllMocks()
  jest.mocked(EditorWorker.invoke).mockResolvedValue('')
  ViewletStates.reset()
})

test('lists native and supported worker-backed components once', () => {
  const nativeState = { uid: 1, value: 'native' }
  const workerState = { commands: [], uid: 2 }
  ViewletStates.set(1, {
    factory: { name: 'Layout' },
    moduleId: 'Layout',
    renderedState: nativeState,
    state: nativeState,
  })
  ViewletStates.set('Layout', ViewletStates.getInstance(1))
  ViewletStates.set(2, {
    factory: {
      getComponentState: jest.fn(),
      hasFunctionalRender: true,
      name: 'Explorer',
      setComponentState: jest.fn(),
    },
    moduleId: 'Explorer',
    renderedState: workerState,
    state: workerState,
  })
  ViewletStates.set(3, {
    factory: { hasFunctionalRender: true, name: 'Editor' },
    moduleId: 'Editor',
    renderedState: { commands: [], uid: 3 },
    state: { commands: [], uid: 3 },
  })

  expect(ComponentState.getComponents()).toEqual([
    { domAvailable: false, editable: false, moduleId: 'Editor', uid: 3 },
    { domAvailable: false, editable: true, moduleId: 'Explorer', uid: 2 },
    { domAvailable: false, editable: true, moduleId: 'Layout', uid: 1 },
  ])
})

test('uses a worker-backed component state availability check', () => {
  const rendererState = { stateful: true, uid: 4 }
  const isComponentStateAvailable = jest.fn((_state: typeof rendererState) => true)
  ViewletStates.set(4, {
    factory: {
      getComponentState: jest.fn(),
      hasFunctionalRender: true,
      isComponentStateAvailable,
      name: 'ExtensionView',
      setComponentState: jest.fn(),
    },
    moduleId: 'ExtensionView',
    renderedState: rendererState,
    state: rendererState,
  })

  expect(ComponentState.getComponents()).toEqual([{ domAvailable: false, editable: true, moduleId: 'ExtensionView', uid: 4 }])
  expect(isComponentStateAvailable).toHaveBeenCalledWith(rendererState)
})

test('gets renderer-native state', async () => {
  const state = { uid: 1, value: 'native' }
  ViewletStates.set(1, { factory: {}, moduleId: 'Layout', renderedState: state, state })

  await expect(ComponentState.getState(1)).resolves.toBe(state)
})

test('gets authoritative worker state', async () => {
  const rendererState = { commands: [], uid: 2 }
  const componentState = { focusedIndex: 4, uid: 2 }
  const getComponentState = jest.fn(async (_state: typeof rendererState) => componentState)
  ViewletStates.set(2, {
    factory: { getComponentState, hasFunctionalRender: true, setComponentState: jest.fn() },
    moduleId: 'Explorer',
    renderedState: rendererState,
    state: rendererState,
  })

  await expect(ComponentState.getState(2)).resolves.toBe(componentState)
  expect(getComponentState).toHaveBeenCalledWith(rendererState)
})

test('sets renderer-native state and renders it', async () => {
  const oldState = { uid: 1, value: 'old' }
  const newState = { uid: 1, value: 'new' }
  const factory = {}
  ViewletStates.set(1, { factory, moduleId: 'Layout', renderedState: oldState, state: oldState })
  jest.mocked(ViewletManager.render).mockReturnValue([['Viewlet.setText', 1, 'new']])

  await ComponentState.setState(1, newState)

  expect(ViewletManager.render).toHaveBeenCalledWith(factory, oldState, newState, 1, undefined)
  expect(ViewletStates.getState(1)).toBe(newState)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.sendMultiple', [['Viewlet.setText', 1, 'new']])
})

test('sets worker state and schedules its render pipeline', async () => {
  const rendererState = { commands: [], parentUid: 5, uid: 2 }
  const newRendererState = { commands: [['Viewlet.setDom2', 2, []]], parentUid: 5, uid: 2 }
  const oldComponentState = { focusedIndex: 0, uid: 2 }
  const newComponentState = { focusedIndex: 3, uid: 2 }
  const factory = {
    getComponentState: jest.fn(async (_state: typeof rendererState) => oldComponentState),
    hasFunctionalRender: true,
    setComponentState: jest.fn(async (_state: typeof rendererState, _componentState: typeof newComponentState) => newRendererState),
  }
  ViewletStates.set(2, { factory, moduleId: 'Explorer', renderedState: rendererState, state: rendererState })
  jest.mocked(ViewletManager.render).mockReturnValue([['Viewlet.setDom2', 2, []]])

  await ComponentState.setState(2, newComponentState)

  expect(factory.setComponentState).toHaveBeenCalledWith(rendererState, newComponentState)
  expect(ViewletManager.render).toHaveBeenCalledWith(factory, rendererState, newRendererState, 2, 5)
  expect(ViewletStates.getState(2)).toBe(newRendererState)
})

test('rejects missing, unsupported, invalid, and retargeted component state', async () => {
  await expect(ComponentState.getState(99)).rejects.toThrow('Component not found: 99')

  const workerState = { uid: 2 }
  ViewletStates.set(2, { factory: { hasFunctionalRender: true }, moduleId: 'Editor', renderedState: workerState, state: workerState })
  await expect(ComponentState.getState(2)).rejects.toThrow('Component state API not available: Editor')

  const nativeState = { uid: 3 }
  ViewletStates.set(3, { factory: {}, moduleId: 'Layout', renderedState: nativeState, state: nativeState })
  await expect(ComponentState.setState(3, [])).rejects.toThrow('Component state must be an object')
  await expect(ComponentState.setState(3, { uid: 4 })).rejects.toThrow('Component state uid must remain 3')
})

test('refreshes an open live component state editor when the component rerenders', async () => {
  const componentState = { focusedIndex: 0, uid: 2 }
  const editorState = { uid: 9, uri: 'live-component-state:///2.json' }
  ViewletStates.set(2, { factory: {}, moduleId: 'Explorer', renderedState: componentState, state: componentState })
  ViewletStates.set(9, { factory: {}, moduleId: 'EditorText', renderedState: editorState, state: editorState })

  ViewletStates.setRenderedState(2, { focusedIndex: 1, uid: 2 })
  await ComponentState.waitForRefreshes()

  expect(Viewlet.executeViewletCommand).toHaveBeenCalledWith(9, 'loadContent')
  expect(Viewlet.reload).not.toHaveBeenCalled()
})

test('does not refresh an open live component state editor when its content is unchanged', async () => {
  const componentState = { focusedIndex: 0, uid: 2 }
  const editorState = { uid: 9, uri: 'live-component-state:///2.json' }
  ViewletStates.set(2, { factory: {}, moduleId: 'Explorer', renderedState: componentState, state: componentState })
  ViewletStates.set(9, { factory: {}, moduleId: 'EditorText', renderedState: editorState, state: editorState })
  jest.mocked(EditorWorker.invoke).mockResolvedValue(`${JSON.stringify(componentState, null, 2)}\n`)

  ViewletStates.setRenderedState(2, { ...componentState })
  await ComponentState.waitForRefreshes()

  expect(EditorWorker.invoke).toHaveBeenCalledWith('Editor.getText', 9)
  expect(Viewlet.executeViewletCommand).not.toHaveBeenCalled()
  expect(Viewlet.reload).not.toHaveBeenCalled()
})

test('refreshes an open live component state editor with a decimal component uid', async () => {
  const componentUid = 0.5
  const componentState = { focusedIndex: 0, uid: componentUid }
  const editorState = { uid: 9, uri: `live-component-state:///${componentUid}.json` }
  ViewletStates.set(componentUid, { factory: {}, moduleId: 'ExtensionDetail', renderedState: componentState, state: componentState })
  ViewletStates.set(9, { factory: {}, moduleId: 'EditorText', renderedState: editorState, state: editorState })

  ViewletStates.setRenderedState(componentUid, { focusedIndex: 1, uid: componentUid })
  await ComponentState.waitForRefreshes()

  expect(Viewlet.executeViewletCommand).toHaveBeenCalledWith(9, 'loadContent')
})

test('does not overwrite a dirty live component state editor when the component rerenders', async () => {
  const componentState = { focusedIndex: 0, uid: 2 }
  const editorState = { uid: 9, uri: 'live-component-state:///2.json' }
  const mainRendererState = { commands: [], uid: 3 }
  const mainComponentState = {
    layout: {
      groups: [{ tabs: [{ editorUid: 9, isDirty: true }] }],
    },
    uid: 3,
  }
  ViewletStates.set(2, { factory: {}, moduleId: 'Explorer', renderedState: componentState, state: componentState })
  ViewletStates.set(3, {
    factory: { getComponentState: jest.fn(async () => mainComponentState), hasFunctionalRender: true },
    moduleId: 'Main',
    renderedState: mainRendererState,
    state: mainRendererState,
  })
  ViewletStates.set(9, { factory: {}, moduleId: 'EditorText', renderedState: editorState, state: editorState })

  ViewletStates.setRenderedState(2, { focusedIndex: 1, uid: 2 })
  await ComponentState.waitForRefreshes()

  expect(Viewlet.executeViewletCommand).not.toHaveBeenCalled()
  expect(Viewlet.reload).not.toHaveBeenCalled()
})

test('refreshes Main state once after opening, then preserves its active self-referential editor', async () => {
  const mainRendererState = { commands: [], uid: 3 }
  const editorState = { uid: 9, uri: 'live-component-state:///3.json' }
  const mainComponentState = {
    layout: {
      groups: [{ activeTabId: 4, focused: true, tabs: [{ editorUid: 9, id: 4, isDirty: false }] }],
    },
    uid: 3,
  }
  const factory = { getComponentState: jest.fn(async () => mainComponentState), hasFunctionalRender: true }
  ViewletStates.set(3, { factory, moduleId: 'Main', renderedState: mainRendererState, state: mainRendererState })
  ViewletStates.set(9, { factory: {}, moduleId: 'EditorText', renderedState: editorState, state: editorState })

  ViewletStates.setRenderedState(3, { commands: [], uid: 3 })
  await ComponentState.waitForRefreshes()
  ViewletStates.setRenderedState(3, { commands: [], uid: 3 })
  await ComponentState.waitForRefreshes()

  expect(Viewlet.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(Viewlet.executeViewletCommand).toHaveBeenCalledWith(9, 'loadContent')
})

test('coalesces rerenders while a live component state editor is refreshing', async () => {
  let finishReload
  jest.mocked(Viewlet.executeViewletCommand).mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finishReload = resolve
      }),
  )
  const componentState = { focusedIndex: 0, uid: 2 }
  const editorState = { uid: 9, uri: 'live-component-state:///2.json' }
  ViewletStates.set(2, { factory: {}, moduleId: 'Explorer', renderedState: componentState, state: componentState })
  ViewletStates.set(9, { factory: {}, moduleId: 'EditorText', renderedState: editorState, state: editorState })

  ViewletStates.setRenderedState(2, { focusedIndex: 1, uid: 2 })
  ViewletStates.setRenderedState(2, { focusedIndex: 2, uid: 2 })
  ViewletStates.setRenderedState(2, { focusedIndex: 3, uid: 2 })
  await new Promise((resolve) => setTimeout(resolve, 0))
  finishReload()
  await ComponentState.waitForRefreshes()

  expect(Viewlet.executeViewletCommand).toHaveBeenCalledTimes(2)
})

test('stops refreshing after the live component state editor is disposed', async () => {
  const componentState = { focusedIndex: 0, uid: 2 }
  const editorState = { uid: 9, uri: 'live-component-state:///2.json' }
  ViewletStates.set(2, { factory: {}, moduleId: 'Explorer', renderedState: componentState, state: componentState })
  ViewletStates.set(9, { factory: {}, moduleId: 'EditorText', renderedState: editorState, state: editorState })
  ViewletStates.remove(9)

  ViewletStates.setRenderedState(2, { focusedIndex: 1, uid: 2 })
  await ComponentState.waitForRefreshes()

  expect(Viewlet.executeViewletCommand).not.toHaveBeenCalled()
  expect(Viewlet.reload).not.toHaveBeenCalled()
})

test('gets virtual DOM through the component API without rendering or changing state', async () => {
  const state = { commands: [], uid: 0.25 }
  const dom = [{ childCount: 0, className: 'TitleBar', type: 4 }]
  const getComponentDom = jest.fn(async () => dom)
  ViewletStates.set(0.25, {
    factory: { getComponentDom, getComponentState: jest.fn(), hasFunctionalRender: true, setComponentState: jest.fn() },
    moduleId: 'TitleBar',
    renderedState: state,
    state,
  })
  await expect(ComponentState.getDom(0.25)).resolves.toBe(dom)
  expect(getComponentDom).toHaveBeenCalledWith(state)
  expect(ViewletStates.getByUid(0.25).state).toBe(state)
  expect(ViewletManager.render).not.toHaveBeenCalled()
  expect(RendererProcess.invoke).not.toHaveBeenCalled()
  expect(ComponentState.getComponents()).toEqual([{ domAvailable: true, editable: true, moduleId: 'TitleBar', uid: 0.25 }])
})

test('rejects missing components and components without a DOM API', async () => {
  await expect(ComponentState.getDom(99)).rejects.toThrow('Component not found: 99')
  const state = { uid: 1 }
  ViewletStates.set(1, { factory: {}, moduleId: 'Layout', renderedState: state, state })
  await expect(ComponentState.getDom(1)).rejects.toThrow('Component DOM API not available: Layout')
})
