/**
 * @jest-environment jsdom
 */
import * as ViewletTitleBarButtons from '../src/parts/ViewletTitleBarButtons/ViewletTitleBarButtons.js'
import { beforeEach, test, expect } from '@jest/globals'

test('create', () => {
  const state = ViewletTitleBarButtons.create()
  expect(state).toBeDefined()
})
