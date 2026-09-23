import { expect, test } from '@jest/globals'
import { getQuickPickMenuEntries } from '../src/parts/ViewletMain/ViewletMainMenuEntries.js'

test('getQuickPickMenuEntries includes save without formatting', () => {
  const entries = getQuickPickMenuEntries()

  expect(entries).toContainEqual({
    id: 'Main.saveWithoutFormatting',
    label: 'File: Save without Formatting',
  })
})
