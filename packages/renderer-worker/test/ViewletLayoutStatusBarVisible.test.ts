import { expect, test } from '@jest/globals'
import * as ViewletLayout from '../src/parts/ViewletLayout/ViewletLayout.ts'

test('getStatusBarVisible returns the status bar visibility', () => {
  const state = {
    ...ViewletLayout.create(1),
    statusBarVisible: false,
  }

  expect(ViewletLayout.getStatusBarVisible(state)).toBe(false)
})
