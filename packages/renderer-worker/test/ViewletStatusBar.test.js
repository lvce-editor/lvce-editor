import { beforeEach, expect, jest, test } from '@jest/globals'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ExtensionHost/ExtensionHostStatusBarItems.js', () => {
  return {
    getStatusBarItems: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const ExtensionHostStatusBarItems = await import('../src/parts/ExtensionHost/ExtensionHostStatusBarItems.js')

const ViewletStatusBar = await import('../src/parts/ViewletStatusBar/ViewletStatusBar.js')

test('create', () => {
  const state = ViewletStatusBar.create()
  expect(state).toBeDefined()
})

test.skip('loadContent', async () => {
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
  // @ts-ignore
  await ViewletStatusBar.contentLoaded(state)
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(1)
  // @ts-ignore
  expect(RendererProcess.state.send).toBeCalledWith({})
})

test('itemLeftCreate', () => {
  const state = ViewletStatusBar.create()
  expect(ViewletStatusBar.itemLeftCreate(state, 'test name', 'test text', 'test tooltip')).toMatchObject({
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
    }),
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
    }),
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
    }),
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
