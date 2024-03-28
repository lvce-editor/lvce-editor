/**
 * @jest-environment jsdom
 */
import * as ViewletEditorCompletion from '../src/parts/ViewletEditorCompletion/ViewletEditorCompletion.js'
import { beforeEach, test, expect } from '@jest/globals'

test('create', () => {
  const state = ViewletEditorCompletion.create()
  expect(state).toBeDefined()
})
