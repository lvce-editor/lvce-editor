import { beforeEach, expect, jest, test } from '@jest/globals'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'

beforeEach(() => {
  jest.resetAllMocks()
  jest.mocked(Id.create).mockReturnValue(2)
  ViewletStates.reset()
  ViewletStates.set(1, {
    state: { uid: 1 },
    renderedState: {
      uid: 1,
    },
    moduleId: 'Layout',
    factory: {},
  })
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/ViewletManager/ViewletManager.js', () => {
  return {
    load: jest.fn(() => {
      throw new Error('not implemented')
    }),
    render: jest.fn(() => []),
    runLoadContentLater: jest.fn(),
  }
})
jest.unstable_mockModule('../src/parts/Id/Id.js', () => {
  return {
    create: jest.fn(),
  }
})
jest.unstable_mockModule('../src/parts/SimpleBrowserOverlay/SimpleBrowserOverlay.js', () => {
  return {
    hide: jest.fn(),
    show: jest.fn(),
  }
})
jest.unstable_mockModule('../src/parts/SaveState/SaveState.js', () => ({
  saveViewletState: jest.fn(),
}))

const ViewletManager = await import('../src/parts/ViewletManager/ViewletManager.js')
const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const Id = await import('../src/parts/Id/Id.js')
const SaveState = await import('../src/parts/SaveState/SaveState.js')
const SimpleBrowserOverlay = await import('../src/parts/SimpleBrowserOverlay/SimpleBrowserOverlay.js')
const Viewlet = await import('../src/parts/Viewlet/Viewlet.js')

test.skip('focus', () => {
  // RendererProcess.state.send = jest.fn()
  // Viewlet.focus('Noop')
  // expect(RendererProcess.state.send).toHaveBeenCalledWith([3027, 'Noop'])
})

test.skip('setState - shouldApplyNewState returns false', () => {
  // Viewlet.state.instances['test'] = {
  //   factory: {
  //     hasFunctionalRender: true,
  //     render() {
  //       return []
  //     },
  //   },
  //   state: {},
  // }
})

test('getTitle - no instance', () => {
  expect(Viewlet.getTitle(2)).toBeUndefined()
})

test('getTitle - provider has no getTitle function', () => {
  expect(Viewlet.getTitle(1)).toBeUndefined()
})

test('executeViewletCommand ignores a late blur after the viewlet was disposed', async () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})

  await Viewlet.executeViewletCommand(2, 'handleBlur')

  expect(warn).not.toHaveBeenCalled()
})

test('executeViewletCommand warns when another command targets a missing viewlet', async () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})

  await Viewlet.executeViewletCommand(2, 'handleInput')

  expect(warn).toHaveBeenCalledWith('cannot execute handleInput instance not found 2')
})

test('getTitle', async () => {
  const getTitle = jest.fn(async (_uid = 0) => 'Test Title')
  const state = { uid: 1 }
  ViewletStates.set(1, {
    state,
    renderedState: state,
    moduleId: 'Layout',
    factory: {
      getTitle,
    },
  })
  await expect(Viewlet.getTitle(1)).resolves.toBe('Test Title')
  expect(getTitle).toHaveBeenCalledTimes(1)
  expect(getTitle).toHaveBeenCalledWith(1)
})

test('getDragData', async () => {
  const dragData = {
    items: [
      {
        data: 'file:///workspace/file.txt',
        type: 'text/uri-list',
      },
    ],
    label: '1',
  }
  jest.mocked(RendererProcess.invoke).mockResolvedValue(dragData)

  await expect(Viewlet.getDragData()).resolves.toBe(dragData)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.getDragData')
})

test('focusSelector forwards focus to the renderer process', async () => {
  jest.mocked(RendererProcess.invoke).mockResolvedValue(undefined)

  await Viewlet.focusSelector(7, '[name="editor"]')

  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.focusSelector', 7, '[name="editor"]')
})

test('reload restores a viewlet from its current saved state and rerenders it', async () => {
  const oldState = { content: 'old', uid: 2 } as const
  const newState = { content: 'new', uid: 2 } as const
  const savedState = { selection: 3 } as const
  const saveState = jest.fn(async (_state: typeof oldState) => savedState)
  const dispose = jest.fn(async (_state: typeof oldState) => {})
  const loadContent = jest.fn(async (_state: typeof oldState, _savedState: typeof savedState) => newState)
  const contentLoaded = jest.fn(async (_state: typeof newState) => [['Viewlet.afterLoad', 2]])
  const contentLoadedEffects = jest.fn(async (_state: typeof newState) => {})
  ViewletStates.set(2, {
    factory: { contentLoaded, contentLoadedEffects, dispose, loadContent, saveState },
    moduleId: 'Editor',
    renderedState: oldState,
    state: oldState,
  })
  jest.mocked(ViewletManager.render).mockReturnValue([['Viewlet.setDom2', 2, []]])
  jest.mocked(RendererProcess.invoke).mockResolvedValue(undefined)

  await Viewlet.reload(2)

  expect(saveState).toHaveBeenCalledWith(oldState)
  expect(dispose).toHaveBeenCalledWith(oldState)
  expect(loadContent).toHaveBeenCalledWith(oldState, savedState)
  expect(ViewletManager.render).toHaveBeenCalledWith(expect.anything(), oldState, newState)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.sendMultiple', [
    ['Viewlet.setDom2', 2, []],
    ['Viewlet.afterLoad', 2],
  ])
  expect(ViewletManager.runLoadContentLater).toHaveBeenCalledWith(2)
  expect(contentLoadedEffects).toHaveBeenCalledWith(newState)
  expect(ViewletStates.getState(2)).toBe(newState)
  expect(ViewletStates.getInstance(2).status).toBe('loaded')
})

test('reload ignores a viewlet that is already reloading', async () => {
  const loadContent = jest.fn()
  ViewletStates.set(2, {
    factory: { loadContent },
    moduleId: 'Editor',
    renderedState: { uid: 2 },
    state: { uid: 2 },
    status: 'reloading',
  })

  await Viewlet.reload(2)

  expect(loadContent).not.toHaveBeenCalled()
})

test('reload records a failed load and propagates the error', async () => {
  const error = new Error('Failed to reload')
  ViewletStates.set(2, {
    factory: {
      loadContent: jest.fn(async () => {
        throw error
      }),
    },
    moduleId: 'Editor',
    renderedState: { uid: 2 },
    state: { uid: 2 },
  })

  await expect(Viewlet.reload(2)).rejects.toThrow(error)
  expect(ViewletStates.getInstance(2).status).toBe('error')
})

test('disposeFunctional disposes owned runtime viewlets', () => {
  const childFactory = {}
  ViewletStates.set(11, {
    state: { uid: 11 },
    renderedState: { uid: 11 },
    moduleId: 'Terminal2',
    factory: childFactory,
  })
  ViewletStates.set(12, {
    state: { uid: 12 },
    renderedState: { uid: 12 },
    moduleId: 'Terminal2',
    factory: childFactory,
  })
  ViewletStates.set(10, {
    state: { uid: 10 },
    renderedState: { uid: 10 },
    moduleId: 'Terminals',
    factory: {
      getOwnedViewletIds() {
        return [11, 12]
      },
    },
  })

  expect(Viewlet.disposeFunctional(10)).toEqual([
    ['Viewlet.dispose', 10],
    ['Viewlet.dispose', 11],
    ['Viewlet.dispose', 12],
  ])
  expect(ViewletStates.getInstance(10)).toBeUndefined()
  expect(ViewletStates.getInstance(11)).toBeUndefined()
  expect(ViewletStates.getInstance(12)).toBeUndefined()
})

test('getFocusCommands returns focus render commands without sending them', async () => {
  const oldState = { uid: 2 }
  const newState = { focus: 1, uid: 2 }
  const focus = jest.fn(async (_state: typeof oldState) => newState)
  ViewletStates.set('Search', {
    state: oldState,
    renderedState: oldState,
    moduleId: 'Search',
    factory: {
      Commands: { focus },
    },
  })
  // @ts-ignore
  ViewletManager.render.mockReturnValue([['Viewlet.focusElementByName', 2, 'SearchValue']])

  const commands = await Viewlet.getFocusCommands('Search')

  expect(focus).toHaveBeenCalledWith(oldState)
  expect(ViewletManager.render).toHaveBeenCalledWith(expect.anything(), oldState, newState)
  expect(commands).toEqual([['Viewlet.focusElementByName', 2, 'SearchValue']])
  expect(ViewletStates.getState('Search')).toBe(newState)
  expect(RendererProcess.invoke).not.toHaveBeenCalled()
})

test('getFocusCommands returns no commands when the view has no focus command', async () => {
  ViewletStates.set('CustomView', {
    state: { uid: 2 },
    renderedState: { uid: 2 },
    moduleId: 'CustomView',
    factory: {
      Commands: {},
    },
  })

  await expect(Viewlet.getFocusCommands('CustomView')).resolves.toEqual([])
  expect(ViewletManager.render).not.toHaveBeenCalled()
})

test('dispose - waits for factory disposal before disposing the rendered viewlet', async () => {
  let resolveDispose = () => {}
  const disposePromise = new Promise<void>((resolve) => {
    resolveDispose = resolve
  })
  const factoryDispose = jest.fn((_state: unknown) => disposePromise)
  ViewletStates.set(2, {
    state: { uid: 2 },
    renderedState: { uid: 2 },
    moduleId: 'SimpleBrowser',
    factory: { dispose: factoryDispose },
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(async () => {})

  let didDispose = false
  const viewletDisposePromise = Viewlet.dispose(2).then(() => {
    didDispose = true
  })

  await Promise.resolve()
  expect(factoryDispose).toHaveBeenCalledWith({ uid: 2 })
  expect(RendererProcess.invoke).not.toHaveBeenCalled()
  expect(didDispose).toBe(false)

  resolveDispose()
  await viewletDisposePromise

  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.dispose', 2)
  expect(didDispose).toBe(true)
})

test('dispose - disposes the rendered viewlet when the factory has no dispose function', async () => {
  ViewletStates.set(2, {
    state: { uid: 2 },
    renderedState: { uid: 2 },
    moduleId: 'ActivityBar',
    factory: {},
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(async () => {})

  await Viewlet.dispose(2)

  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.dispose', 2)
  expect(ViewletStates.getInstance(2)).toBeUndefined()
})

test('dispose - saves persistent state before disposing the viewlet', async () => {
  const factoryDispose = jest.fn()
  const factorySaveState = jest.fn()
  ViewletStates.set(2, {
    state: { uid: 2 },
    renderedState: { uid: 2 },
    moduleId: 'EditorText',
    factory: {
      dispose: factoryDispose,
      saveState: factorySaveState,
    },
  })
  // @ts-ignore
  RendererProcess.invoke.mockResolvedValue(undefined)

  await Viewlet.dispose(2)

  expect(SaveState.saveViewletState).toHaveBeenCalledWith(2)
  expect(jest.mocked(SaveState.saveViewletState).mock.invocationCallOrder[0]).toBeLessThan(factoryDispose.mock.invocationCallOrder[0])
})

test('dispose - removes Layout references before recursively disposing owned widgets', async () => {
  const layoutState = {
    ...ViewletStates.getState('Layout'),
    mountedViewletsBySource: {},
    widgetReferences: [
      { parentUid: 2, uid: 3 },
      { parentUid: 3, uid: 4 },
    ],
    widgetRevisions: { 2: 1, 3: 1 },
  }
  ViewletStates.setState('Layout', layoutState)
  ViewletStates.setRenderedState('Layout', layoutState)
  ViewletStates.set(2, {
    state: { uid: 2 },
    renderedState: { uid: 2 },
    moduleId: 'EditorText',
    factory: {},
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(async () => {})

  await Viewlet.dispose(2)

  const commands = jest.mocked(RendererProcess.invoke).mock.calls[0][1]
  expect(commands.map((command: any[]) => command[0])).toEqual(['Viewlet.setDom2', 'Viewlet.dispose', 'Viewlet.dispose', 'Viewlet.dispose'])
  expect(commands.slice(1)).toEqual([
    ['Viewlet.dispose', 3],
    ['Viewlet.dispose', 4],
    ['Viewlet.dispose', 2],
  ])
  expect(ViewletStates.getState('Layout').widgetReferences).toEqual([])
})

test('disposeWidgetWithValue - dispatches the captured value to the parent keybindings view', async () => {
  const widgetState = { parentUid: 7, uid: 42 }
  const keyBindingsState = { uid: 7, value: '' }
  const updatedKeyBindingsState = { uid: 7, value: 'Ctrl+Alt+9' }
  const handleDefineKeyBindingDisposed = jest.fn((_state: typeof keyBindingsState, _value: string) => updatedKeyBindingsState)
  const keyBindingsFactory = {
    Commands: {
      handleDefineKeyBindingDisposed,
    },
  }
  ViewletStates.set(42, {
    state: widgetState,
    renderedState: widgetState,
    moduleId: 'DefineKeyBinding',
    factory: {},
  })
  ViewletStates.set('external-keybindings-view', {
    state: keyBindingsState,
    renderedState: keyBindingsState,
    moduleId: 'KeyBindings',
    factory: keyBindingsFactory,
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(async () => {})
  // @ts-ignore
  ViewletManager.render.mockReturnValue([['Viewlet.setValueByName', 7, 'KeyBindingsFilter', 'Ctrl+Alt+9']])

  await Viewlet.disposeWidgetWithValue(42, 'Ctrl+Alt+9')

  expect(handleDefineKeyBindingDisposed).toHaveBeenCalledWith(keyBindingsState, 'Ctrl+Alt+9')
  expect(ViewletManager.render).toHaveBeenCalledWith(keyBindingsFactory, keyBindingsState, updatedKeyBindingsState)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(1, 'Viewlet.sendMultiple', [['Viewlet.dispose', 42]])
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(2, 'Viewlet.sendMultiple', [
    ['Viewlet.setValueByName', 7, 'KeyBindingsFilter', 'Ctrl+Alt+9'],
  ])
})

test('openWidget - once', async () => {
  // @ts-ignore
  ViewletManager.load.mockImplementation(() => {
    return []
  })
  await Viewlet.openWidget('QuickPick', ['everything'])
  expect(SimpleBrowserOverlay.show).toHaveBeenCalledWith('quick-pick')
  expect(ViewletManager.load).toHaveBeenCalledTimes(1)
  expect(ViewletManager.load).toHaveBeenCalledWith({
    // @ts-ignore
    focus: true,
    getModule: expect.anything(),
    id: 'QuickPick',
    show: false,
    type: 0,
    uid: 2,
    uri: 'quickPick://everything',
    args: [['everything']],
  })
})

test('openWidget - appends a directly rendered widget before committing its renderer commands', async () => {
  // @ts-ignore
  ViewletManager.load.mockResolvedValue([
    ['Viewlet.createFunctionalRoot', 'QuickPick', 2, true],
    ['Viewlet.commitPending', 2, 17],
  ])
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(async () => {})

  await Viewlet.openWidget('QuickPick', ['everything'])

  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.executeCommands', [
    ['Viewlet.createFunctionalRoot', 'QuickPick', 2, true],
    ['Viewlet.append', 1, 2],
    ['Viewlet.commitPending', 2, 17],
    ['Viewlet.focus', 2],
  ])
})

test('openWidget - declares DefineKeyBinding as an owned widget', async () => {
  const layoutState = {
    ...ViewletStates.getState('Layout'),
    mountedViewletsBySource: {},
    widgetReferences: [],
    widgetRevisions: {},
  }
  ViewletStates.setState('Layout', layoutState)
  ViewletStates.setRenderedState('Layout', layoutState)
  // @ts-ignore
  ViewletManager.load.mockResolvedValue([
    ['Viewlet.createFunctionalRoot', 'DefineKeyBinding', 2, true],
    ['Viewlet.focusElementByName', 2, 'KeyBinding'],
  ])
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(async () => {})

  await Viewlet.openWidget('DefineKeyBinding', 7)

  const commands = jest.mocked(RendererProcess.invoke).mock.calls[0][1]
  expect(commands.some((command: any[]) => command[0] === 'Viewlet.append')).toBe(false)
  expect(commands.map((command: any[]) => command[0])).toEqual([
    'Viewlet.createFunctionalRoot',
    'Viewlet.setDom2',
    'Viewlet.focusElementByName',
    'Viewlet.focus',
  ])
  expect(ViewletStates.getState('Layout').widgetReferences).toEqual([{ parentUid: 7, uid: 2 }])
})

test('closeWidget restores Simple Browser after closing Quick Pick', async () => {
  const focus = jest.fn((state: Readonly<{ readonly uid: number }>): Readonly<{ readonly uid: number }> => state)
  ViewletStates.set(2, {
    factory: {},
    moduleId: 'QuickPick',
    renderedState: { uid: 2 },
    state: { uid: 2 },
  })
  ViewletStates.set(3, {
    factory: {
      Commands: {
        focus,
      },
    },
    moduleId: 'Main',
    renderedState: { uid: 3 },
    state: { uid: 3 },
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})

  await Viewlet.closeWidget(2)

  expect(SimpleBrowserOverlay.hide).toHaveBeenCalledWith('quick-pick')
  expect(focus).toHaveBeenCalledWith({ uid: 3 })
})

test('openWidget - replaces an existing widget by its numeric uid', async () => {
  jest.mocked(Id.create).mockReturnValueOnce(2).mockReturnValueOnce(3)
  // @ts-ignore
  ViewletManager.load.mockImplementation(({ id, uid }) => {
    ViewletStates.set(uid, {
      factory: {},
      moduleId: id,
      state: { uid },
      renderedState: { uid },
    })
    return []
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Viewlet.openWidget('QuickPick', ['everything'])
  await Viewlet.openWidget('QuickPick', ['file'])
  expect(ViewletManager.load).toHaveBeenCalledTimes(2)
  expect(ViewletManager.load).toHaveBeenNthCalledWith(1, {
    // @ts-ignore
    focus: true,
    getModule: expect.anything(),
    id: 'QuickPick',
    show: false,
    type: 0,
    uid: 2,
    uri: 'quickPick://everything',
    args: [['everything']],
  })
  expect(ViewletManager.load).toHaveBeenNthCalledWith(2, {
    // @ts-ignore
    focus: true,
    getModule: expect.anything(),
    id: 'QuickPick',
    show: false,
    type: 0,
    uid: 3,
    uri: 'quickPick://file',
    args: [['file']],
  })
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(1, 'Viewlet.executeCommands', [
    ['Viewlet.append', 1, 2],
    ['Viewlet.focus', 2],
  ])
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(2, 'Viewlet.executeCommands', [
    ['Viewlet.dispose', 2],
    ['Viewlet.append', 1, 3],
    ['Viewlet.focus', 3],
  ])
  expect(ViewletStates.getInstance(2)).toBeUndefined()
  expect(ViewletStates.getInstance(3)?.moduleId).toBe('QuickPick')
})
