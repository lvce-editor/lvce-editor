import { beforeEach, expect, jest, test } from '@jest/globals'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'

beforeEach(() => {
  jest.resetAllMocks()
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
  }
})
jest.unstable_mockModule('../src/parts/Id/Id.js', () => {
  return {
    create() {
      return 2
    },
  }
})
jest.unstable_mockModule('../src/parts/SimpleBrowserOverlay/SimpleBrowserOverlay.js', () => {
  return {
    hide: jest.fn(),
    show: jest.fn(),
  }
})

const ViewletManager = await import('../src/parts/ViewletManager/ViewletManager.js')
const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
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

test('closeWidget restores Simple Browser after closing Quick Pick', async () => {
  ViewletStates.set(2, {
    state: { uid: 2 },
    renderedState: { uid: 2 },
    moduleId: 'QuickPick',
    factory: {},
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})

  await Viewlet.closeWidget(2)

  expect(SimpleBrowserOverlay.hide).toHaveBeenCalledWith('quick-pick')
})

test('openWidget - should not open again when already open', async () => {
  // @ts-ignore
  ViewletManager.load.mockImplementation(({ id }) => {
    ViewletStates.set(id, { factory: {}, state: {}, renderedState: {} })
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
    uid: 2,
    uri: 'quickPick://file',
    args: [['file']],
  })
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(1, 'Viewlet.executeCommands', [
    ['Viewlet.append', 1, 2],
    ['Viewlet.focus', 2],
  ])
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(2, 'Viewlet.executeCommands', [
    ['Viewlet.dispose', 'QuickPick'],
    ['Viewlet.append', 1, 2],
    ['Viewlet.focus', 2],
  ])
})
