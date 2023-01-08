import * as DebugDisplay from '../src/parts/DebugDisplay/DebugDisplay.js'
import * as DebugScopeType from '../src/parts/DebugScopeType/DebugScopeType.js'
import * as DebuggerPausedReason from '../src/parts/DebugPausedReason/DebugPausedReason.js'

test('getScopeLabel - local', () => {
  expect(
    DebugDisplay.getScopeLabel({
      type: DebugScopeType.Local,
    })
  ).toBe('Local')
})

test('getScopeLabel - closure', () => {
  expect(
    DebugDisplay.getScopeLabel({
      type: DebugScopeType.Closure,
    })
  ).toBe('Closure')
})

test('getScopeLabel - catch', () => {
  expect(
    DebugDisplay.getScopeLabel({
      type: DebugScopeType.Catch,
    })
  ).toBe('`Catch` block')
})

test('getScopeLabel - with', () => {
  expect(
    DebugDisplay.getScopeLabel({
      type: DebugScopeType.With,
    })
  ).toBe('`With` block')
})

test('getScopeLabel - block', () => {
  expect(
    DebugDisplay.getScopeLabel({
      type: DebugScopeType.Block,
    })
  ).toBe('Block')
})

test('getScopeLabel - script', () => {
  expect(
    DebugDisplay.getScopeLabel({
      type: DebugScopeType.Script,
    })
  ).toBe('Script')
})

test('getScopeLabel - eval', () => {
  expect(
    DebugDisplay.getScopeLabel({
      type: DebugScopeType.Eval,
    })
  ).toBe('Eval')
})

test('getScopeLabel - module', () => {
  expect(
    DebugDisplay.getScopeLabel({
      type: DebugScopeType.Module,
    })
  ).toBe('Module')
})

test('getScopeLabel - wasm-expression-stack', () => {
  expect(
    DebugDisplay.getScopeLabel({
      type: DebugScopeType.WasmExpressionStack,
    })
  ).toBe('Expression')
})

test('getPausedMessage - exception', () => {
  expect(DebugDisplay.getPausedMessage(DebuggerPausedReason.Exception)).toBe(
    'Paused on exception'
  )
})
