/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, jest, test } from '@jest/globals'
import * as KeyCode from '../src/parts/KeyCode/KeyCode.js'
import * as KeyModifier from '../src/parts/KeyModifier/KeyModifier.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.js', () => {
  return {
    send: jest.fn(() => {}),
  }
})

const RendererWorker = await import('../src/parts/RendererWorker/RendererWorker.js')
const KeyBindings = await import('../src/parts/KeyBindings/KeyBindings.js')
const KeyBindingsEvents = await import('../src/parts/KeyBindingsEvents/KeyBindingsEvents.js')
const KeyBindingsState = await import('../src/parts/KeyBindingsState/KeyBindingsState.js')

beforeEach(() => {
  if (KeyBindingsState.state.modifierTimeout !== -1) {
    clearTimeout(KeyBindingsState.state.modifierTimeout)
    KeyBindingsState.state.modifierTimeout = -1
  }
  KeyBindingsState.state.modifier = ''
  KeyBindingsState.state.keyBindingSets = Object.create(null)
  KeyBindingsState.state.keyBindings = []
})

test('addKeyBindings', () => {
  KeyBindings.setIdentifiers(new Uint32Array([KeyCode.KeyA]))
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: 'a',
    }),
  )
  expect(RendererWorker.send).toHaveBeenCalledWith('KeyBindings.handleKeyBinding', KeyCode.KeyA)
})

test('addKeyBindings - dispatch event with no matching keyBinding', () => {
  KeyBindings.setIdentifiers(new Uint32Array([KeyCode.KeyA]))
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: 'b',
    }),
  )
  expect(RendererWorker.send).not.toHaveBeenCalled()
})

test('addKeyBindings - dispatch Event with context matching', () => {
  KeyBindings.setIdentifiers(new Uint32Array([KeyCode.KeyA]))
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: 'a',
    }),
  )
  expect(RendererWorker.send).toHaveBeenCalledWith('KeyBindings.handleKeyBinding', KeyCode.KeyA)
})

test('addKeyBindings - dispatch event with ctrl modifier', () => {
  KeyBindings.setIdentifiers(new Uint32Array([KeyModifier.CtrlCmd | KeyCode.KeyA]))
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: 'a',
      ctrlKey: true,
    }),
  )
  expect(RendererWorker.send).toHaveBeenCalledWith('KeyBindings.handleKeyBinding', KeyModifier.CtrlCmd | KeyCode.KeyA)
})

test('addKeyBindings - dispatch event with shift modifier', () => {
  KeyBindings.setIdentifiers(new Uint32Array([KeyModifier.Shift | KeyCode.KeyA]))
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: 'a',
      shiftKey: true,
    }),
  )
  expect(RendererWorker.send).toHaveBeenCalledWith('KeyBindings.handleKeyBinding', KeyModifier.Shift | KeyCode.KeyA)
})

test('addKeyBindings - dispatch event with alt modifier', () => {
  KeyBindings.setIdentifiers(new Uint32Array([KeyModifier.Alt | KeyCode.KeyA]))
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: 'a',
      altKey: true,
    }),
  )
  expect(RendererWorker.send).toHaveBeenCalledWith('KeyBindings.handleKeyBinding', KeyModifier.Alt | KeyCode.KeyA)
})

test('addKeyBindings - dispatch event with space key', () => {
  KeyBindings.setIdentifiers(new Uint32Array([KeyCode.Space]))
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: ' ',
    }),
  )
  expect(RendererWorker.send).toHaveBeenCalledWith('KeyBindings.handleKeyBinding', KeyCode.Space)
})
