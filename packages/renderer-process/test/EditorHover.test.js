/**
 * @jest-environment jsdom
 */
import * as EditorHover from '../src/parts/EditorHover/EditorHover.js'

test('show', () => {
  EditorHover.create(0, 0, {
    label: 'item 1',
  })
  const $Hover = document.querySelector('#EditorHover')
  expect($Hover.style.left).toBe('0px')
  expect($Hover.style.top).toBe('0px')
  expect($Hover.textContent).toBe('item 1')
})
