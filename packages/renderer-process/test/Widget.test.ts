/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'
import * as Widget from '../src/parts/Widget/Widget.ts'

test('append', () => {
  const $Element = document.createElement('div')
  Widget.append($Element)
  // @ts-ignore
  expect(Widget.state.$Widgets.children).toHaveLength(1)
  expect($Element.isConnected).toBe(true)
  Widget.remove($Element)
})

test('remove', () => {
  const $Element = document.createElement('div')
  Widget.append($Element)
  Widget.remove($Element)
  expect($Element.isConnected).toBe(false)
  expect(Widget.state.$Widgets).toBeUndefined()
})
