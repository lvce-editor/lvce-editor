/**
 * @jest-environment jsdom
 */
import * as ViewletEditorCompletion from '../src/parts/ViewletEditorCompletion/ViewletEditorCompletion.ts'
import { beforeEach, test, expect } from '@jest/globals'

test('create', () => {
  const state = ViewletEditorCompletion.create()
  expect(state).toBeDefined()
})
