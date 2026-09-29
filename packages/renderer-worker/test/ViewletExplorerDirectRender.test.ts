import { expect, test } from '@jest/globals'
import * as ViewletExplorer from '../src/parts/ViewletExplorer/ViewletExplorer.js'

test('explorer declares direct rendering support', () => {
  expect(ViewletExplorer.hasDirectRender).toBe(true)
})
