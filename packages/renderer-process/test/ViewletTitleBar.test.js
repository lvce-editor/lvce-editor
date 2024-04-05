/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'
import * as ViewletTitleBar from '../src/parts/ViewletTitleBar/ViewletTitleBar.ts'

test('accessibility - title bar should have role of contentinfo', () => {
  const state = ViewletTitleBar.create()
  const { $TitleBar } = state
  expect($TitleBar.role).toBe('contentinfo')
})
