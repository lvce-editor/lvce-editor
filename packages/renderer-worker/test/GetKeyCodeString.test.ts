import { expect, test } from '@jest/globals'
import * as GetKeyCodeString from '../src/parts/GetKeyCodeString/GetKeyCodeString.js'
import * as KeyCode from '../src/parts/KeyCode/KeyCode.js'
import * as KeyCodeString from '../src/parts/KeyCodeString/KeyCodeString.js'

test('Backspace', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.Backspace)).toBe(KeyCodeString.Backspace)
})

test('Tab', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.Tab)).toBe(KeyCodeString.Tab)
})

test('Escape', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.Escape)).toBe(KeyCodeString.Escape)
})

test('Enter', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.Enter)).toBe(KeyCodeString.Enter)
})

test('Space', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.Space)).toBe(KeyCodeString.Space)
})

test('PageUp', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.PageUp)).toBe(KeyCodeString.PageUp)
})

test('PageDown', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.PageDown)).toBe(KeyCodeString.PageDown)
})

test('End', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.End)).toBe(KeyCodeString.End)
})

test('Home', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.Home)).toBe(KeyCodeString.Home)
})

test('LeftArrow', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.LeftArrow)).toBe(KeyCodeString.LeftArrow)
})

test('UpArrow', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.UpArrow)).toBe(KeyCodeString.UpArrow)
})

test('RightArrow', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.RightArrow)).toBe(KeyCodeString.RightArrow)
})

test('DownArrow', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.DownArrow)).toBe(KeyCodeString.DownArrow)
})

test('Insert', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.Insert)).toBe(KeyCodeString.Insert)
})

test('Delete', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.Delete)).toBe(KeyCodeString.Delete)
})

test('Digit0', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.Digit0)).toBe(KeyCodeString.Digit0)
})

test('Digit1', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.Digit1)).toBe(KeyCodeString.Digit1)
})

test('Digit2', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.Digit2)).toBe(KeyCodeString.Digit2)
})

test('Digit3', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.Digit3)).toBe(KeyCodeString.Digit3)
})

test('Digit4', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.Digit4)).toBe(KeyCodeString.Digit4)
})

test('Digit5', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.Digit5)).toBe(KeyCodeString.Digit5)
})

test('Digit6', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.Digit6)).toBe(KeyCodeString.Digit6)
})

test('Digit7', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.Digit7)).toBe(KeyCodeString.Digit7)
})

test('Digit8', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.Digit8)).toBe(KeyCodeString.Digit8)
})

test('Digit9', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.Digit9)).toBe(KeyCodeString.Digit9)
})

test('KeyA', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.KeyA)).toBe(KeyCodeString.KeyA)
})

test('KeyB', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.KeyB)).toBe(KeyCodeString.KeyB)
})

test('KeyC', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.KeyC)).toBe(KeyCodeString.KeyC)
})

test('KeyD', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.KeyD)).toBe(KeyCodeString.KeyD)
})

test('KeyE', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.KeyE)).toBe(KeyCodeString.KeyE)
})

test('KeyF', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.KeyF)).toBe(KeyCodeString.KeyF)
})

test('KeyG', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.KeyG)).toBe(KeyCodeString.KeyG)
})

test('KeyH', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.KeyH)).toBe(KeyCodeString.KeyH)
})

test('KeyI', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.KeyI)).toBe(KeyCodeString.KeyI)
})

test('KeyJ', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.KeyJ)).toBe(KeyCodeString.KeyJ)
})

test('KeyK', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.KeyK)).toBe(KeyCodeString.KeyK)
})

test('KeyL', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.KeyL)).toBe(KeyCodeString.KeyL)
})

test('KeyM', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.KeyM)).toBe(KeyCodeString.KeyM)
})

test('KeyN', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.KeyN)).toBe(KeyCodeString.KeyN)
})

test('KeyO', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.KeyO)).toBe(KeyCodeString.KeyO)
})

test('KeyP', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.KeyP)).toBe(KeyCodeString.KeyP)
})

test('KeyQ', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.KeyQ)).toBe(KeyCodeString.KeyQ)
})

test('KeyR', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.KeyR)).toBe(KeyCodeString.KeyR)
})

test('KeyS', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.KeyS)).toBe(KeyCodeString.KeyS)
})

test('KeyT', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.KeyT)).toBe(KeyCodeString.KeyT)
})

test('KeyU', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.KeyU)).toBe(KeyCodeString.KeyU)
})

test('KeyV', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.KeyV)).toBe(KeyCodeString.KeyV)
})

test('KeyW', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.KeyW)).toBe(KeyCodeString.KeyW)
})

test('KeyX', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.KeyX)).toBe(KeyCodeString.KeyX)
})

test('KeyY', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.KeyY)).toBe(KeyCodeString.KeyY)
})

test('KeyZ', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.KeyZ)).toBe(KeyCodeString.KeyZ)
})

test('F1', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.F1)).toBe(KeyCodeString.F1)
})

test('F2', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.F2)).toBe(KeyCodeString.F2)
})

test('F3', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.F3)).toBe(KeyCodeString.F3)
})

test('F4', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.F4)).toBe(KeyCodeString.F4)
})

test('F5', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.F5)).toBe(KeyCodeString.F5)
})

test('F6', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.F6)).toBe(KeyCodeString.F6)
})

test('Backslash', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.Backslash)).toBe(KeyCodeString.Backslash)
})

test('Equal', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.Equal)).toBe(KeyCodeString.Equal)
})
test('Comma', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.Comma)).toBe(KeyCodeString.Comma)
})
test('Backquote', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.Backquote)).toBe(KeyCodeString.Backquote)
})
test('Plus', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.Plus)).toBe(KeyCodeString.Plus)
})
test('Star', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.Star)).toBe(KeyCodeString.Star)
})
test('Minus', () => {
  expect(GetKeyCodeString.getKeyCodeString(KeyCode.Minus)).toBe(KeyCodeString.Minus)
})
