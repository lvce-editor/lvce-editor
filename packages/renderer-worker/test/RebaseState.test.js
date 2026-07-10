import { expect, test } from '@jest/globals'
import * as RebaseState from '../src/parts/RebaseState/RebaseState.js'

test('applies state changes to the latest state', () => {
  const oldState = {
    activityBarId: -1,
    mainId: 1,
    titleBarId: -1,
  }
  const latestState = {
    activityBarId: -1,
    mainId: 1,
    titleBarId: 2,
  }
  const newState = {
    activityBarId: 3,
    mainId: 1,
    titleBarId: -1,
  }

  expect(RebaseState.rebaseState(oldState, latestState, newState)).toEqual({
    activityBarId: 3,
    mainId: 1,
    titleBarId: 2,
  })
})

test('returns the new state when the latest state has not changed', () => {
  const oldState = { activityBarId: -1 }
  const newState = { activityBarId: 3 }

  expect(RebaseState.rebaseState(oldState, oldState, newState)).toBe(newState)
})
