/**
 * @jest-environment jsdom
 */
import * as Widget from '../src/parts/Widget/Widget.js'

test('append', () => {
  const $Element = document.createElement('div')
  Widget.append($Element)
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
