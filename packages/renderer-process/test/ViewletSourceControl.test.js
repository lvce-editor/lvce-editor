/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'
import * as Viewlet from '../src/parts/Viewlet/Viewlet.ts'
import * as ViewletSourceControl from '../src/parts/ViewletSourceControl/ViewletSourceControl.ts'

test('create', () => {
  const state = ViewletSourceControl.create()
  expect(state).toBeDefined()
})

test.skip('focus', () => {
  const state = ViewletSourceControl.create()
  Viewlet.mount(document.body, state)
  ViewletSourceControl.focus(state)
  // @ts-ignore
  expect(document.activeElement).toBe(state.$ViewSourceControlInput)
})
