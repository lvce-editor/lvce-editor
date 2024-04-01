/**
 * @jest-environment jsdom
 */
import * as ViewletRunAndDebug from '../src/parts/ViewletRunAndDebug/ViewletRunAndDebug.ts'
import { beforeEach, test, expect } from '@jest/globals'

test.skip('accessibility - scope section header should have tabIndex 0', () => {
  const state = ViewletRunAndDebug.create()
  const { $DebugSectionHeaderScope } = state
  expect($DebugSectionHeaderScope.tabIndex).toBe(0)
})

test.skip('accessibility - scope section header should have role treeitem', () => {
  const state = ViewletRunAndDebug.create()
  const { $DebugSectionHeaderScope } = state
  expect($DebugSectionHeaderScope.role).toBe('treeitem')
})
