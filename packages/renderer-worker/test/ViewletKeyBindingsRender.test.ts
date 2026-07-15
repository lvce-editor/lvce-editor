import { expect, test } from '@jest/globals'
import * as ViewletKeyBindings from '../src/parts/ViewletKeyBindings/ViewletKeyBindings.ipc.js'
import * as ViewletManager from '../src/parts/ViewletManager/ViewletManager.js'
import * as ViewletModuleId from '../src/parts/ViewletModuleId/ViewletModuleId.js'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.js'

const render = (oldState, newState) => {
  return ViewletManager.render(ViewletKeyBindings, oldState, newState, ViewletModuleId.KeyBindings)
}

test.skip('render - add one keybinding', () => {
  const oldState = {
    ...ViewletKeyBindings.create(),
    filteredKeyBindings: [],
    minLineY: 2,
    maxLineY: 3,
    maxVisibleItems: 1,
  }
  const newState = {
    ...oldState,
    filteredKeyBindings: [
      {
        rawKey: 'Enter',
        isCtrl: false,
        isShift: false,
        key: 'Enter',
        command: 'EditorCompletion.selectCurrent',
        when: 'focus.editorCompletions',
      },
    ],
  }
  expect(render(oldState, newState)).toEqual([
    [
      'Viewlet.send',
      'KeyBindings',
      'setTableDom',
      [
        {
          childCount: 3,
          ariaLabel: 'KeyBindings',
          ariaRowCount: 1,
          className: 'KeyBindingsTable',
          type: VirtualDomElements.Table,
        },
        {
          childCount: 3,
          type: VirtualDomElements.ColGroup,
          className: 'KeyBindingsTableColGroup',
        },
        {
          childCount: 0,
          width: 0,
          type: VirtualDomElements.Col,
          className: 'KeyBindingsTableCol',
        },
        {
          childCount: 0,
          width: 0,
          type: VirtualDomElements.Col,
          className: 'KeyBindingsTableCol',
        },
        {
          childCount: 0,
          width: 0,
          type: VirtualDomElements.Col,
          className: 'KeyBindingsTableCol',
        },
        {
          childCount: 1,
          className: 'KeyBindingsTableHead',
          type: VirtualDomElements.THead,
        },
        {
          childCount: 3,
          ariaRowIndex: 1,
          className: 'KeyBindingsTableRow',
          type: VirtualDomElements.Tr,
        },
        {
          childCount: 1,
          className: 'KeyBindingsTableCell',
          type: VirtualDomElements.Th,
        },
        {
          childCount: 0,
          text: 'Command',
          type: VirtualDomElements.Text,
        },
        {
          childCount: 1,
          className: 'KeyBindingsTableCell',
          type: VirtualDomElements.Th,
        },
        {
          childCount: 0,
          text: 'Key',
          type: VirtualDomElements.Text,
        },
        {
          childCount: 1,
          className: 'KeyBindingsTableCell',
          type: VirtualDomElements.Th,
        },
        {
          childCount: 0,
          text: 'When',
          type: VirtualDomElements.Text,
        },
        {
          childCount: 0,
          className: 'KeyBindingsTableBody',
          type: VirtualDomElements.TBody,
        },
      ],
    ],
    ['Viewlet.ariaAnnounce', ''],
  ])
})

test.skip('render - remove one keybinding', () => {
  const oldState = {
    ...ViewletKeyBindings.create(),
    filteredKeyBindings: [
      {
        rawKey: 'Enter',
        isCtrl: false,
        isShift: false,
        key: 'Enter',
        command: 'EditorCompletion.selectCurrent',
        when: 'focus.editorCompletions',
      },
    ],
    minLineY: 2,
    maxLineY: 3,
    maxVisibleItems: 1,
  }
  const newState = {
    ...oldState,
    filteredKeyBindings: [],
  }
  expect(render(oldState, newState)).toEqual([
    [
      'Viewlet.send',
      'KeyBindings',
      'setTableDom',
      [
        {
          childCount: 3,
          ariaLabel: 'KeyBindings',
          ariaRowCount: 0,
          className: 'KeyBindingsTable',
          type: VirtualDomElements.Table,
        },
        {
          childCount: 3,
          className: 'KeyBindingsTableColGroup',
          type: 3,
        },
        {
          childCount: 0,
          className: 'KeyBindingsTableCol',
          type: 2,
          width: 0,
        },
        {
          childCount: 0,
          className: 'KeyBindingsTableCol',
          type: 2,
          width: 0,
        },
        {
          childCount: 0,
          className: 'KeyBindingsTableCol',
          type: 2,
          width: 0,
        },
        {
          childCount: 1,
          className: 'KeyBindingsTableHead',
          type: VirtualDomElements.THead,
        },
        {
          childCount: 3,
          ariaRowIndex: 1,
          className: 'KeyBindingsTableRow',
          type: VirtualDomElements.Tr,
        },
        {
          childCount: 1,
          className: 'KeyBindingsTableCell',
          type: VirtualDomElements.Th,
        },
        {
          childCount: 0,
          text: 'Command',
          type: VirtualDomElements.Text,
        },
        {
          childCount: 1,
          className: 'KeyBindingsTableCell',
          type: VirtualDomElements.Th,
        },
        {
          childCount: 0,
          text: 'Key',
          type: VirtualDomElements.Text,
        },
        {
          childCount: 1,
          className: 'KeyBindingsTableCell',
          type: VirtualDomElements.Th,
        },
        {
          childCount: 0,
          text: 'When',
          type: VirtualDomElements.Text,
        },
        {
          childCount: 0,
          className: 'KeyBindingsTableBody',
          type: VirtualDomElements.TBody,
        },
      ],
    ],
  ])
})
