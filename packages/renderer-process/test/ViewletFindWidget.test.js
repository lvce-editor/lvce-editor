/**
 * @jest-environment jsdom
 */
import * as ViewletFindWidget from '../src/parts/ViewletFindWidget/ViewletFindWidget.js'
import { beforeEach, test, expect } from '@jest/globals'

test('create', () => {
  const state = ViewletFindWidget.create()
  const { $Viewlet } = state
  expect($Viewlet).toBeInstanceOf(HTMLElement)
})
