import * as ViewletMain from '../src/parts/ViewletMain/ViewletMain.js'
import * as ViewletMainCloseOthers from '../src/parts/ViewletMain/ViewletMainCloseOthers.js'

test('closeOthers - empty editors', () => {
  const state = {
    ...ViewletMain.create(),
  }
  const { newState, commands } = ViewletMainCloseOthers.closeOthers(state)
  expect(newState).toBe(state)
  expect(commands).toEqual([])
})

test('closeOthers - no other editors exist', () => {
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        id: '',
        uri: '',
        title: '',
      },
    ],
    focusedIndex: 0,
    selectedIndex: 0,
  }
  const { newState, commands } = ViewletMainCloseOthers.closeOthers(state)
  expect(newState).toEqual(state)
  expect(commands).toEqual([])
})

test('closeOthers - close one editor', () => {
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        id: '1',
        uri: '1',
        title: '1',
      },
      {
        id: '2',
        uri: '2',
        title: '2',
      },
    ],
    focusedIndex: 0,
    selectedIndex: 0,
  }
  const { newState, commands } = ViewletMainCloseOthers.closeOthers(state)
  expect(newState.editors).toEqual([
    {
      id: '1',
      uri: '1',
      title: '1',
    },
  ])
  expect(commands).toEqual([])
})
