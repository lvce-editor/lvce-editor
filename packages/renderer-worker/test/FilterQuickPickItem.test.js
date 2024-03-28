import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'
import * as FilterQuickPickItem from '../src/parts/FilterQuickPickItem/FilterQuickPickItem.js'

// TODO
test('filterQuickPickItem - path', () => {
  const word = '/test/folder-1/folder-2/folder-3/folder-4/folder-5/content'
  const pattern = 'con'
  expect(FilterQuickPickItem.filterQuickPickItem(pattern, word)).toEqual([])
})

test('filterQuickPickItem - label', () => {
  const word = 'Select Color Theme'
  const pattern = 'col'
  expect(FilterQuickPickItem.filterQuickPickItem(pattern, word)).toEqual([28, 7, 10])
})
