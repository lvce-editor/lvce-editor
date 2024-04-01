/**
 * @jest-environment jsdom
 */
import * as ViewletKeyBindings from '../src/parts/ViewletKeyBindings/ViewletKeyBindings.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'
import { beforeEach, test, expect } from '@jest/globals'

test('create', () => {
  expect(ViewletKeyBindings.create()).toBeDefined()
})

test('setTableDom', () => {
  const state = ViewletKeyBindings.create()
  ViewletKeyBindings.setTableDom(state, [
    {
      type: VirtualDomElements.Table,
      props: {},
      childCount: 2,
    },
    {
      type: VirtualDomElements.THead,
      props: {},
      childCount: 0,
    },
    {
      type: VirtualDomElements.TBody,
      props: {},
      childCount: 0,
    },
  ])
  const { $KeyBindingsTableWrapper } = state
  expect($KeyBindingsTableWrapper.innerHTML).toBe(
    '<table><thead></thead><tbody></tbody></table><div class="Resizer"></div><div class="Resizer"></div>',
  )
})
