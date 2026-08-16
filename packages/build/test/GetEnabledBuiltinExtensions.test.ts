import { expect, test } from '@jest/globals'
import { getEnabledBuiltinExtensions } from '../src/parts/GetEnabledBuiltinExtensions/GetEnabledBuiltinExtensions.ts'

test('includes extensions when enabled is not specified', () => {
  const extension = { name: 'builtin.test' }

  expect(getEnabledBuiltinExtensions([extension])).toEqual([extension])
})

test('includes enabled extensions', () => {
  const extension = { enabled: true, name: 'builtin.test' }

  expect(getEnabledBuiltinExtensions([extension])).toEqual([extension])
})

test('excludes disabled extensions', () => {
  const extension = { enabled: false, name: 'builtin.test' }

  expect(getEnabledBuiltinExtensions([extension])).toEqual([])
})
