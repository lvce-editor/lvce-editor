/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'
import * as ViewletEditorImage from '../src/parts/ViewletEditorImage/ViewletEditorImage.ts'

test('create', () => {
  const state = ViewletEditorImage.create()
  expect(state).toBeDefined()
})
