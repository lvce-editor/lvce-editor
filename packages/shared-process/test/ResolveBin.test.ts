import { expect, test } from '@jest/globals'
import * as ResolveBin from '../src/parts/ResolveBin/ResolveBin.js'

test('resolveBin - existing package', () => {
  expect(ResolveBin.resolveBin('@lvce-editor/assert')).toContain('assert')
})

test('resolveBin - missing package', () => {
  expect(ResolveBin.resolveBin('@lvce-editor/does-not-exist')).toBe('')
})
