import { expect, test } from '@jest/globals'
import * as ViewletStatusBar from '../src/parts/ViewletStatusBar/ViewletStatusBar.ipc.js'

test('resize', () => {
  const state = ViewletStatusBar.create()
  const newState = ViewletStatusBar.resize(state, {
    x: 200,
    y: 200,
    width: 200,
    height: 200,
  })
  expect(newState).toEqual({
    height: 200,
    x: 200,
    y: 200,
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
    width: 200,
  })
})
