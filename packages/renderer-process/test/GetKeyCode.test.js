import * as Key from '../src/parts/Key/Key.js'
import * as KeyCode from '../src/parts/KeyCode/KeyCode.js'
import * as GetKeyCode from '../src/parts/GetKeyCode/GetKeyCode.js'

test('KeyA', () => {
  expect(GetKeyCode.getKeyCode(Key.KeyA)).toBe(KeyCode.KeyA)
})

test('KeyB', () => {
  expect(GetKeyCode.getKeyCode(Key.KeyB)).toBe(KeyCode.KeyB)
})

test('KeyC', () => {
  expect(GetKeyCode.getKeyCode(Key.KeyC)).toBe(KeyCode.KeyC)
})

test('KeyD', () => {
  expect(GetKeyCode.getKeyCode(Key.KeyD)).toBe(KeyCode.KeyD)
})

test('KeyE', () => {
  expect(GetKeyCode.getKeyCode(Key.KeyE)).toBe(KeyCode.KeyE)
})

test('KeyF', () => {
  expect(GetKeyCode.getKeyCode(Key.KeyF)).toBe(KeyCode.KeyF)
})

test('KeyG', () => {
  expect(GetKeyCode.getKeyCode(Key.KeyG)).toBe(KeyCode.KeyG)
})

test('KeyH', () => {
  expect(GetKeyCode.getKeyCode(Key.KeyH)).toBe(KeyCode.KeyH)
})

test('KeyI', () => {
  expect(GetKeyCode.getKeyCode(Key.KeyI)).toBe(KeyCode.KeyI)
})
