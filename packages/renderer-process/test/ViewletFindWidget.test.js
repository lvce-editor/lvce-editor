/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'
import * as ViewletFindWidget from '../src/parts/ViewletFindWidget/ViewletFindWidget.ts'

test('create', () => {
  const state = ViewletFindWidget.create()
  const { $Viewlet } = state
  expect($Viewlet).toBeInstanceOf(HTMLElement)
})
