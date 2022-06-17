/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as ActiveViewlet from '../src/parts/Viewlet/ActiveViewlet.js'

test('getState / setState', () => {
  const testState = {
    x: 42,
  }
  ActiveViewlet.setState('Extensions', testState)
  const $Input = document.createElement('input')
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet'
  $Viewlet.dataset.viewletId = 'Extensions'
  $Viewlet.append($Input)
  const spy = jest.fn((event) => {
    console.log(event)
    const state = ActiveViewlet.getStateFromEvent(event)
    expect(state).toBe(testState)
  })
  const event = new CustomEvent('a')
  $Input.addEventListener('a', spy)
  $Input.dispatchEvent(event)
  expect(spy).toHaveBeenCalled()
})
