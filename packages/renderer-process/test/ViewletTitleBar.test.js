/**
 * @jest-environment jsdom
 */
import * as ViewletTitleBar from '../src/parts/ViewletTitleBar/ViewletTitleBar.ts'
import { beforeEach, test, expect } from '@jest/globals'

test('accessibility - title bar should have role of contentinfo', () => {
  const state = ViewletTitleBar.create()
  const { $TitleBar } = state
  expect($TitleBar.role).toBe('contentinfo')
})
