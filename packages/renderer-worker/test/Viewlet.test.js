import { jest } from '@jest/globals'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'

beforeEach(() => {
  jest.resetAllMocks()
  ViewletStates.reset()
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
jest.unstable_mockModule(
  '../src/parts/ViewletManager/ViewletManager.js',
  () => {
    return {
      load: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const ViewletManager = await import(
  '../src/parts/ViewletManager/ViewletManager.js'
)
const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)
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

test('openWidget - once', async () => {
  // @ts-ignore
  ViewletManager.load.mockImplementation(() => {
    return []
  })
  await Viewlet.openWidget('QuickPick', ['everything'])
  expect(ViewletManager.load).toHaveBeenCalledTimes(1)
  expect(ViewletManager.load).toHaveBeenCalledWith({
    focus: true,
    getModule: expect.any(Function),
    id: 'QuickPick',
    show: false,
    type: 0,
    uri: 'quickPick://everything',
  })
})

test('openWidget - should not open again when already open', async () => {
  // @ts-ignore
  ViewletManager.load.mockImplementation(({ id }) => {
    console.log({ id })
    ViewletStates.set(id, { factory: {}, state: {} })
    return []
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Viewlet.openWidget('QuickPick', ['everything'])
  await Viewlet.openWidget('QuickPick', ['file'])
  expect(ViewletManager.load).toHaveBeenCalledTimes(2)
  expect(ViewletManager.load).toHaveBeenNthCalledWith(1, {
    focus: true,
    getModule: expect.any(Function),
    id: 'QuickPick',
    show: false,
    type: 0,
    uri: 'quickPick://everything',
  })
  expect(ViewletManager.load).toHaveBeenNthCalledWith(2, {
    focus: true,
    getModule: expect.any(Function),
    id: 'QuickPick',
    show: false,
    type: 0,
    uri: 'quickPick://file',
  })
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(
    1,
    'Viewlet.executeCommands',
    [
      ['Viewlet.append', 'Layout', 'QuickPick'],
      ['Viewlet.focus', 'QuickPick'],
    ]
  )
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(
    2,
    'Viewlet.executeCommands',
    [
      ['Viewlet.dispose', 'QuickPick'],
      ['Viewlet.append', 'Layout', 'QuickPick'],
      ['Viewlet.focus', 'QuickPick'],
    ]
  )
})
