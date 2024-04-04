/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'
import * as ViewletEditorCompletion from '../src/parts/ViewletEditorCompletion/ViewletEditorCompletion.ts'

test('create', () => {
  const state = ViewletEditorCompletion.create()
  expect(state).toBeDefined()
})
