import * as GetDebugPropertyValueLabel from '../src/parts/GetDebugPropertyValueLabel/GetDebugPropertyValueLabel.js'

test('getDebugPropertyValueLabel = number', () => {
  const value = {
    type: 'number',
    description: '1',
  }
  expect(GetDebugPropertyValueLabel.getDebugPropertyValueLabel(value)).toBe(`1`)
})

test('getDebugPropertyValueLabel - boolean', () => {
  const value = {
    type: 'boolean',
    description: 'true',
  }
  expect(GetDebugPropertyValueLabel.getDebugPropertyValueLabel(value)).toBe('true')
})

test('getDebugPropertyValueLabel - undefined', () => {
  const value = {
    type: 'undefined',
  }
  expect(GetDebugPropertyValueLabel.getDebugPropertyValueLabel(value)).toBe('undefined')
})

test('getDebugPropertyValueLabel - symbol', () => {
  const value = {
    type: 'symbol',
    description: 'Symbol(before)',
  }
  expect(GetDebugPropertyValueLabel.getDebugPropertyValueLabel(value)).toBe('Symbol(before)')
})

test('getDebugPropertyValueLabel - object', () => {
  const value = {
    type: 'object',
    description: 'process',
  }
  expect(GetDebugPropertyValueLabel.getDebugPropertyValueLabel(value)).toBe('process')
})
test('getDebugPropertyValueLabel - function', () => {
  const value = {
    type: 'function',
    description: '(req, res) => {}',
  }
  expect(GetDebugPropertyValueLabel.getDebugPropertyValueLabel(value)).toBe('(req, res) => {}')
})

test('getDebugPropertyValueLabel - other', () => {
  const value = {}
  expect(GetDebugPropertyValueLabel.getDebugPropertyValueLabel(value)).toBe('{}')
})
