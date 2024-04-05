/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'
import * as ViewletExtensionDetail from '../src/parts/ViewletExtensionDetail/ViewletExtensionDetail.ts'
import * as ViewletSize from '../src/parts/ViewletSize/ViewletSize.ts'

test('create', () => {
  const state = ViewletExtensionDetail.create()
  expect(state).toBeDefined()
})

test('setSize - normal', () => {
  const state = ViewletExtensionDetail.create()
  const { $Viewlet } = state
  ViewletExtensionDetail.setSize(state, ViewletSize.Small, ViewletSize.Normal)
  expect($Viewlet.className).toBe('Viewlet ExtensionDetail Normal')
})
