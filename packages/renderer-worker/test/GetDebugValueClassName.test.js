import * as ClassNames from '../src/parts/ClassNames/ClassNames.js'
import * as DebugValueType from '../src/parts/DebugValueType/DebugValueType.js'
import * as GetDebugValueClassName from '../src/parts/GetDebugValueClassName/GetDebugValueClassName.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('getDebugValueClassName - undefined', () => {
  const valueType = DebugValueType.Undefined
  expect(GetDebugValueClassName.getDebugValueClassName(valueType)).toBe(ClassNames.DebugValueUndefined)
})

test('getDebugValueClassName - number', () => {
  const valueType = DebugValueType.Number
  expect(GetDebugValueClassName.getDebugValueClassName(valueType)).toBe(ClassNames.DebugValueNumber)
})

test('getDebugValueClassName - object', () => {
  const valueType = DebugValueType.Object
  expect(GetDebugValueClassName.getDebugValueClassName(valueType)).toBe(ClassNames.DebugValueObject)
})

test('getDebugValueClassName - function', () => {
  const valueType = DebugValueType.Function
  expect(GetDebugValueClassName.getDebugValueClassName(valueType)).toBe(ClassNames.DebugValueFunction)
})

test('getDebugValueClassName - symbol', () => {
  const valueType = DebugValueType.Symbol
  expect(GetDebugValueClassName.getDebugValueClassName(valueType)).toBe(ClassNames.DebugValueSymbol)
})

test('getDebugValueClassName - boolean', () => {
  const valueType = DebugValueType.Boolean
  expect(GetDebugValueClassName.getDebugValueClassName(valueType)).toBe(ClassNames.DebugValueBoolean)
})

test('getDebugValueClassName - string', () => {
  const valueType = DebugValueType.String
  expect(GetDebugValueClassName.getDebugValueClassName(valueType)).toBe(ClassNames.DebugValueString)
})

test('getDebugValueClassName - other', () => {
  const valueType = ''
  expect(GetDebugValueClassName.getDebugValueClassName(valueType)).toBe('')
})
