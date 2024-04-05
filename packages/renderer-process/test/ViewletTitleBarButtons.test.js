/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'
import * as ViewletTitleBarButtons from '../src/parts/ViewletTitleBarButtons/ViewletTitleBarButtons.ts'

test('create', () => {
  const state = ViewletTitleBarButtons.create()
  expect(state).toBeDefined()
})
