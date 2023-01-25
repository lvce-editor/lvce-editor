/**
 * @jest-environment jsdom
 */
import * as AriaAlert from '../src/parts/AriaAlert/AriaAlert.js'
import * as AriaAlertState from '../src/parts/AriaAlertState/AriaAlertState.js'

beforeEach(() => {
  AriaAlertState.state.$AriaAlert1 = undefined
  AriaAlertState.state.$AriaAlert2 = undefined
  AriaAlertState.state.$AriaMessages = undefined
})

test('alert', () => {
  AriaAlert.alert('sample message')
  const $AriaAlert1 = AriaAlertState.getAriaAlert1()
  expect($AriaAlert1.textContent).toBe('sample message')
})

test('alert same message multiple times', () => {
  AriaAlert.alert('sample message')
  const $AriaAlert1 = AriaAlertState.getAriaAlert1()
  const $AriaAlert2 = AriaAlertState.getAriaAlert2()
  expect($AriaAlert1.textContent).toBe('sample message')
  expect($AriaAlert2.textContent).not.toBe('sample message')
  AriaAlert.alert('sample message')
  expect($AriaAlert1.textContent).not.toBe('sample message')
  expect($AriaAlert2.textContent).toBe('sample message')
  AriaAlert.alert('sample message')
  expect($AriaAlert1.textContent).toBe('sample message')
  expect($AriaAlert2.textContent).not.toBe('sample message')
})
