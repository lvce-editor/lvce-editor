/**
 * @jest-environment jsdom
 */
import * as AriaAlert from '../src/parts/AriaAlert/AriaAlert.js'

beforeEach(() => {
  AriaAlert.state.$AriaAlert1 = undefined
  AriaAlert.state.$AriaAlert2 = undefined
  AriaAlert.state.$AriaMessages = undefined
})

test('alert', () => {
  AriaAlert.alert('sample message')
  expect(AriaAlert.state.$AriaAlert1.textContent).toBe('sample message')
})

test('alert same message multiple times', () => {
  AriaAlert.alert('sample message')
  expect(AriaAlert.state.$AriaAlert1.textContent).toBe('sample message')
  expect(AriaAlert.state.$AriaAlert2.textContent).not.toBe('sample message')
  AriaAlert.alert('sample message')
  expect(AriaAlert.state.$AriaAlert1.textContent).not.toBe('sample message')
  expect(AriaAlert.state.$AriaAlert2.textContent).toBe('sample message')
  AriaAlert.alert('sample message')
  expect(AriaAlert.state.$AriaAlert1.textContent).toBe('sample message')
  expect(AriaAlert.state.$AriaAlert2.textContent).not.toBe('sample message')
})
