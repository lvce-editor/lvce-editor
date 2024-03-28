/**
 * @jest-environment jsdom
 */
import * as ViewletEditorImage from '../src/parts/ViewletEditorImage/ViewletEditorImage.js'
import { beforeEach, test, expect } from '@jest/globals'

test('create', () => {
  const state = ViewletEditorImage.create()
  expect(state).toBeDefined()
})
