import { beforeEach, expect, jest, test } from '@jest/globals'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({
  invoke: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/ViewletManager/ViewletManager.js', () => ({
  render: jest.fn(() => []),
}))

const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const ViewletManager = await import('../src/parts/ViewletManager/ViewletManager.js')
const ComponentState = await import('../src/parts/ComponentState/ComponentState.js')

beforeEach(() => {
  jest.resetAllMocks()
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
    { editable: false, moduleId: 'Editor', uid: 3 },
    { editable: true, moduleId: 'Explorer', uid: 2 },
    { editable: true, moduleId: 'Layout', uid: 1 },
  ])
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
