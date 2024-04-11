/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'
import * as ViewletRunAndDebug from '../src/parts/ViewletRunAndDebug/ViewletRunAndDebug.ts'

test.skip('accessibility - scope section header should have tabIndex 0', () => {
  const state = ViewletRunAndDebug.create()
  // @ts-ignore
  const { $DebugSectionHeaderScope } = state
  expect($DebugSectionHeaderScope.tabIndex).toBe(0)
})

test.skip('accessibility - scope section header should have role treeitem', () => {
  const state = ViewletRunAndDebug.create()
  // @ts-ignore
  const { $DebugSectionHeaderScope } = state
  expect($DebugSectionHeaderScope.role).toBe('treeitem')
})
