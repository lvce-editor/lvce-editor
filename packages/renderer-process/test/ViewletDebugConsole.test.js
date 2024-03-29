/**
 * @jest-environment jsdom
 */
import * as ViewletDebugConsole from '../src/parts/ViewletDebugConsole/ViewletDebugConsole.js'
import * as Viewlet from '../src/parts/Viewlet/Viewlet.js'
import { beforeEach, test, expect } from '@jest/globals'

test('create', () => {
  const state = ViewletDebugConsole.create()
  expect(state).toBeDefined()
})

test.skip('mount', () => {
  const state = ViewletDebugConsole.create()
  const $Parent = document.createElement('div')
  // TODO mount should be implemented on Viewlet
  Viewlet.mount($Parent, state)
  expect($Parent.children.length).toBe(1)
})

test.skip('focus', () => {
  const state = ViewletDebugConsole.create()
  Viewlet.mount(document.body, state)
  // @ts-ignore
  ViewletDebugConsole.focus(state)
  expect(document.activeElement).toBe(state.$Input)
})
