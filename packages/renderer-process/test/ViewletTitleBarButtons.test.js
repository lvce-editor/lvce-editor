/**
 * @jest-environment jsdom
 */
import * as ViewletTitleBarButtons from '../src/parts/ViewletTitleBarButtons/ViewletTitleBarButtons.ts'
import { beforeEach, test, expect } from '@jest/globals'

test('create', () => {
  const state = ViewletTitleBarButtons.create()
  expect(state).toBeDefined()
})
