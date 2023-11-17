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
