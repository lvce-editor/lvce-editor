import { jest } from '@jest/globals'
import * as Callback from '../src/parts/Callback/Callback.js'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'
import * as ViewletModuleId from '../src/parts/ViewletModuleId/ViewletModuleId.js'
beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ExtensionHost/ExtensionHostStatusBarItems.js',
  () => {
    return {
      getStatusBarItems: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const ExtensionHostStatusBarItems = await import(
  '../src/parts/ExtensionHost/ExtensionHostStatusBarItems.js'
)

const ViewletStatusBar = await import(
  '../src/parts/ViewletStatusBar/ViewletStatusBar.js'
)

beforeEach(() => {
  Callback.state.id = 0
})

test('name', () => {
  expect(ViewletStatusBar.name).toBe(ViewletModuleId.StatusBar)
})

test('create', () => {
  const state = ViewletStatusBar.create()
  expect(state).toBeDefined()
})

test('loadContent', async () => {
  // @ts-ignore
  ExtensionHostStatusBarItems.getStatusBarItems.mockImplementation(() => {
    return []
  })
  const state = ViewletStatusBar.create()
  expect(await ViewletStatusBar.loadContent(state)).toEqual({
    statusBarItemsLeft: [
      // {
      //   command: 909021,
      //   name: 'RunTests',
      //   text: 'Run Tests',
      //   tooltip: '',
      // },
    ],
    statusBarItemsRight: [],
  })
})

test.skip('contentLoaded', async () => {
  const state = {
    ...ViewletStatusBar.create(),
    statusBarItemsLeft: [
      {
        command: 909021,
        name: 'RunTests',
        text: 'Run Tests',
        tooltip: '',
      },
    ],
  }
  await ViewletStatusBar.contentLoaded(state)
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(1)
  expect(RendererProcess.state.send).toBeCalledWith({})
})

test('itemLeftCreate', () => {
  const state = ViewletStatusBar.create()
  expect(
    ViewletStatusBar.itemLeftCreate(
      state,
      'test name',
      'test text',
      'test tooltip'
    )
  ).toMatchObject({
    statusBarItemsLeft: [
      {
        name: 'test name',
        text: 'test text',
        tooltip: 'test tooltip',
      },
    ],
  })
})

test('itemLeftUpdate', async () => {
  const state = ViewletStatusBar.create()
  expect(
    ViewletStatusBar.itemLeftUpdate(state, {
      name: 'test name 2',
      text: 'test text 2',
      tooltip: 'test tooltip 2',
    })
  ).toMatchObject({
    statusBarItemsLeft: [
      {
        name: 'test name 2',
        text: 'test text 2',
        tooltip: 'test tooltip 2',
      },
    ],
  })
})

test('itemRightCreate', () => {
  const state = ViewletStatusBar.create()
  expect(
    ViewletStatusBar.itemRightCreate(state, {
      name: 'test name 1',
      text: 'test text 1',
      tooltip: 'test tooltip 1',
    })
  ).toMatchObject({
    statusBarItemsRight: [
      {
        name: 'test name 1',
        text: 'test text 1',
        tooltip: 'test tooltip 1',
      },
    ],
  })
})

test('itemRightUpdate', () => {
  const state = ViewletStatusBar.create()
  expect(
    ViewletStatusBar.itemRightUpdate(state, {
      name: 'test name 1',
      text: 'test text 2',
      tooltip: 'test tooltip 2',
    })
  ).toMatchObject({
    statusBarItemsRight: [
      {
        name: 'test name 1',
        text: 'test text 2',
        tooltip: 'test tooltip 2',
      },
    ],
  })
})

test('resize', () => {
  const state = ViewletStatusBar.create()
  const newState = ViewletStatusBar.resize(state, {
    top: 200,
    left: 200,
    width: 200,
    height: 200,
  })
  expect(newState).toEqual({
    height: 200,
    left: 200,
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
    top: 200,
    width: 200,
  })
})
