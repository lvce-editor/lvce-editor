/**
 * @jest-environment jsdom
 */
import * as AriaAlert from '../src/parts/AriaAlert/AriaAlert.ts'
import * as AriaAlertState from '../src/parts/AriaAlertState/AriaAlertState.ts'
import { beforeEach, test, expect } from '@jest/globals'

beforeEach(() => {
  AriaAlertState.state.$AriaAlert1 = undefined
  AriaAlertState.state.$AriaAlert2 = undefined
  AriaAlertState.state.$AriaMessages = undefined
})

test('alert', () => {
  AriaAlert.alert('sample message')
  const $AriaAlert1 = AriaAlertState.getAriaAlert1()
  // @ts-ignore
  expect($AriaAlert1.textContent).toBe('sample message')
})

test('alert same message multiple times', () => {
  AriaAlert.alert('sample message')
  const $AriaAlert1 = AriaAlertState.getAriaAlert1()
  const $AriaAlert2 = AriaAlertState.getAriaAlert2()
  // @ts-ignore
  expect($AriaAlert1.textContent).toBe('sample message')
  // @ts-ignore
  expect($AriaAlert2.textContent).not.toBe('sample message')
  AriaAlert.alert('sample message')
  // @ts-ignore
  expect($AriaAlert1.textContent).not.toBe('sample message')
  // @ts-ignore
  expect($AriaAlert2.textContent).toBe('sample message')
  AriaAlert.alert('sample message')
  // @ts-ignore
  expect($AriaAlert1.textContent).toBe('sample message')
  // @ts-ignore
  expect($AriaAlert2.textContent).not.toBe('sample message')
})
