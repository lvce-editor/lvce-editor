import { expect, test } from '@jest/globals'
import * as GetKeyCode from '../src/parts/GetKeyCode/GetKeyCode.ts'
import * as Key from '../src/parts/Key/Key.ts'
import * as KeyCode from '../src/parts/KeyCode/KeyCode.ts'

test('Backspace', () => {
  expect(GetKeyCode.getKeyCode(Key.Backspace)).toBe(KeyCode.Backspace)
})

test('Tab', () => {
  expect(GetKeyCode.getKeyCode(Key.Tab)).toBe(KeyCode.Tab)
})

test('Escape', () => {
  expect(GetKeyCode.getKeyCode(Key.Escape)).toBe(KeyCode.Escape)
})

test('Enter', () => {
  expect(GetKeyCode.getKeyCode(Key.Enter)).toBe(KeyCode.Enter)
})

test('Space', () => {
  expect(GetKeyCode.getKeyCode(Key.Space)).toBe(KeyCode.Space)
})

test('PageUp', () => {
  expect(GetKeyCode.getKeyCode(Key.PageUp)).toBe(KeyCode.PageUp)
})

test('PageDown', () => {
  expect(GetKeyCode.getKeyCode(Key.PageDown)).toBe(KeyCode.PageDown)
})

test('End', () => {
  expect(GetKeyCode.getKeyCode(Key.End)).toBe(KeyCode.End)
})

test('Home', () => {
  expect(GetKeyCode.getKeyCode(Key.Home)).toBe(KeyCode.Home)
})

test('LeftArrow', () => {
  expect(GetKeyCode.getKeyCode(Key.LeftArrow)).toBe(KeyCode.LeftArrow)
})

test('UpArrow', () => {
  expect(GetKeyCode.getKeyCode(Key.UpArrow)).toBe(KeyCode.UpArrow)
})

test('RightArrow', () => {
  expect(GetKeyCode.getKeyCode(Key.RightArrow)).toBe(KeyCode.RightArrow)
})

test('DownArrow', () => {
  expect(GetKeyCode.getKeyCode(Key.DownArrow)).toBe(KeyCode.DownArrow)
})

test('Insert', () => {
  expect(GetKeyCode.getKeyCode(Key.Insert)).toBe(KeyCode.Insert)
})

test('Delete', () => {
  expect(GetKeyCode.getKeyCode(Key.Delete)).toBe(KeyCode.Delete)
})

test('Digit0', () => {
  expect(GetKeyCode.getKeyCode(Key.Digit0)).toBe(KeyCode.Digit0)
})

test('Digit1', () => {
  expect(GetKeyCode.getKeyCode(Key.Digit1)).toBe(KeyCode.Digit1)
})

test('Digit2', () => {
  expect(GetKeyCode.getKeyCode(Key.Digit2)).toBe(KeyCode.Digit2)
})

test('Digit3', () => {
  expect(GetKeyCode.getKeyCode(Key.Digit3)).toBe(KeyCode.Digit3)
})

test('Digit4', () => {
  expect(GetKeyCode.getKeyCode(Key.Digit4)).toBe(KeyCode.Digit4)
})

test('Digit5', () => {
  expect(GetKeyCode.getKeyCode(Key.Digit5)).toBe(KeyCode.Digit5)
})

test('Digit6', () => {
  expect(GetKeyCode.getKeyCode(Key.Digit6)).toBe(KeyCode.Digit6)
})

test('Digit7', () => {
  expect(GetKeyCode.getKeyCode(Key.Digit7)).toBe(KeyCode.Digit7)
})

test('Digit8', () => {
  expect(GetKeyCode.getKeyCode(Key.Digit8)).toBe(KeyCode.Digit8)
})

test('Digit9', () => {
  expect(GetKeyCode.getKeyCode(Key.Digit9)).toBe(KeyCode.Digit9)
})

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

test('KeyJ', () => {
  expect(GetKeyCode.getKeyCode(Key.KeyJ)).toBe(KeyCode.KeyJ)
})

test('KeyK', () => {
  expect(GetKeyCode.getKeyCode(Key.KeyK)).toBe(KeyCode.KeyK)
})

test('KeyL', () => {
  expect(GetKeyCode.getKeyCode(Key.KeyL)).toBe(KeyCode.KeyL)
})

test('KeyM', () => {
  expect(GetKeyCode.getKeyCode(Key.KeyM)).toBe(KeyCode.KeyM)
})

test('KeyN', () => {
  expect(GetKeyCode.getKeyCode(Key.KeyN)).toBe(KeyCode.KeyN)
})

test('KeyO', () => {
  expect(GetKeyCode.getKeyCode(Key.KeyO)).toBe(KeyCode.KeyO)
})

test('KeyP', () => {
  expect(GetKeyCode.getKeyCode(Key.KeyP)).toBe(KeyCode.KeyP)
})

test('KeyQ', () => {
  expect(GetKeyCode.getKeyCode(Key.KeyQ)).toBe(KeyCode.KeyQ)
})

test('KeyR', () => {
  expect(GetKeyCode.getKeyCode(Key.KeyR)).toBe(KeyCode.KeyR)
})

test('KeyS', () => {
  expect(GetKeyCode.getKeyCode(Key.KeyS)).toBe(KeyCode.KeyS)
})

test('KeyT', () => {
  expect(GetKeyCode.getKeyCode(Key.KeyT)).toBe(KeyCode.KeyT)
})

test('KeyU', () => {
  expect(GetKeyCode.getKeyCode(Key.KeyU)).toBe(KeyCode.KeyU)
})

test('KeyV', () => {
  expect(GetKeyCode.getKeyCode(Key.KeyV)).toBe(KeyCode.KeyV)
})

test('KeyW', () => {
  expect(GetKeyCode.getKeyCode(Key.KeyW)).toBe(KeyCode.KeyW)
})

test('KeyX', () => {
  expect(GetKeyCode.getKeyCode(Key.KeyX)).toBe(KeyCode.KeyX)
})

test('KeyY', () => {
  expect(GetKeyCode.getKeyCode(Key.KeyY)).toBe(KeyCode.KeyY)
})

test('KeyZ', () => {
  expect(GetKeyCode.getKeyCode(Key.KeyZ)).toBe(KeyCode.KeyZ)
})

test('F1', () => {
  expect(GetKeyCode.getKeyCode(Key.F1)).toBe(KeyCode.F1)
})

test('F2', () => {
  expect(GetKeyCode.getKeyCode(Key.F2)).toBe(KeyCode.F2)
})

test('F3', () => {
  expect(GetKeyCode.getKeyCode(Key.F3)).toBe(KeyCode.F3)
})

test('F4', () => {
  expect(GetKeyCode.getKeyCode(Key.F4)).toBe(KeyCode.F4)
})

test('F5', () => {
  expect(GetKeyCode.getKeyCode(Key.F5)).toBe(KeyCode.F5)
})

test('F6', () => {
  expect(GetKeyCode.getKeyCode(Key.F6)).toBe(KeyCode.F6)
})

test('F7', () => {
  expect(GetKeyCode.getKeyCode(Key.F7)).toBe(KeyCode.F7)
})

test('F8', () => {
  expect(GetKeyCode.getKeyCode(Key.F8)).toBe(KeyCode.F8)
})

test('F9', () => {
  expect(GetKeyCode.getKeyCode(Key.F9)).toBe(KeyCode.F9)
})

test('F10', () => {
  expect(GetKeyCode.getKeyCode(Key.F10)).toBe(KeyCode.F10)
})

test('F11', () => {
  expect(GetKeyCode.getKeyCode(Key.F11)).toBe(KeyCode.F11)
})

test('F12', () => {
  expect(GetKeyCode.getKeyCode(Key.F12)).toBe(KeyCode.F12)
})

test('F13', () => {
  expect(GetKeyCode.getKeyCode(Key.F13)).toBe(KeyCode.F13)
})

test('F14', () => {
  expect(GetKeyCode.getKeyCode(Key.F14)).toBe(KeyCode.F14)
})

test('F15', () => {
  expect(GetKeyCode.getKeyCode(Key.F15)).toBe(KeyCode.F15)
})

test('F16', () => {
  expect(GetKeyCode.getKeyCode(Key.F16)).toBe(KeyCode.F16)
})

test('F17', () => {
  expect(GetKeyCode.getKeyCode(Key.F17)).toBe(KeyCode.F17)
})

test('F18', () => {
  expect(GetKeyCode.getKeyCode(Key.F18)).toBe(KeyCode.F18)
})

test('F19', () => {
  expect(GetKeyCode.getKeyCode(Key.F19)).toBe(KeyCode.F19)
})

test('F20', () => {
  expect(GetKeyCode.getKeyCode(Key.F20)).toBe(KeyCode.F20)
})

test('F21', () => {
  expect(GetKeyCode.getKeyCode(Key.F21)).toBe(KeyCode.F21)
})

test('F22', () => {
  expect(GetKeyCode.getKeyCode(Key.F22)).toBe(KeyCode.F22)
})

test('F23', () => {
  expect(GetKeyCode.getKeyCode(Key.F23)).toBe(KeyCode.F23)
})

test('F24', () => {
  expect(GetKeyCode.getKeyCode(Key.F24)).toBe(KeyCode.F24)
})

test('SemiColon', () => {
  expect(GetKeyCode.getKeyCode(Key.SemiColon)).toBe(KeyCode.SemiColon)
})

test('Equal', () => {
  expect(GetKeyCode.getKeyCode(Key.Equal)).toBe(KeyCode.Equal)
})

test('Comma', () => {
  expect(GetKeyCode.getKeyCode(Key.Comma)).toBe(KeyCode.Comma)
})

test('Minus', () => {
  expect(GetKeyCode.getKeyCode(Key.Minus)).toBe(KeyCode.Minus)
})

test('Period', () => {
  expect(GetKeyCode.getKeyCode(Key.Period)).toBe(KeyCode.Period)
})

test('Slash', () => {
  expect(GetKeyCode.getKeyCode(Key.Slash)).toBe(KeyCode.Slash)
})

test('Backquote', () => {
  expect(GetKeyCode.getKeyCode(Key.Backquote)).toBe(KeyCode.Backquote)
})

test('BracketLeft', () => {
  expect(GetKeyCode.getKeyCode(Key.BracketLeft)).toBe(KeyCode.BracketLeft)
})

test('Backslash', () => {
  expect(GetKeyCode.getKeyCode(Key.Backslash)).toBe(KeyCode.Backslash)
})

test('BracketRight', () => {
  expect(GetKeyCode.getKeyCode(Key.BracketRight)).toBe(KeyCode.BracketRight)
})

test('Quote', () => {
  expect(GetKeyCode.getKeyCode(Key.Quote)).toBe(KeyCode.Quote)
})

test('Star', () => {
  expect(GetKeyCode.getKeyCode(Key.Star)).toBe(KeyCode.Star)
})

test('Plus', () => {
  expect(GetKeyCode.getKeyCode(Key.Plus)).toBe(KeyCode.Plus)
})
