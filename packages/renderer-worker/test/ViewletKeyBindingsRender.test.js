import * as ViewletManager from '../src/parts/ViewletManager/ViewletManager.js'
import * as ViewletKeyBindings from '../src/parts/ViewletKeyBindings/ViewletKeyBindings.js'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.js'
import * as ViewletModuleId from '../src/parts/ViewletModuleId/ViewletModuleId.js'

const render = (oldState, newState) => {
  return ViewletManager.render(
    ViewletKeyBindings,
    oldState,
    newState,
    ViewletModuleId.KeyBindings
  )
}

test.only('render - add one keybinding', () => {
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
          childCount: 2,
          props: {
            ariaLabel: 'KeyBindings',
            ariaRowCount: 1,
            className: 'KeyBindingsTable',
          },
          type: VirtualDomElements.Table,
        },
        {
          childCount: 1,
          props: {
            className: 'KeyBindingsTableHead',
          },
          type: VirtualDomElements.THead,
        },
        {
          childCount: 3,
          props: {
            ariaRowIndex: 1,
            className: 'KeyBindingsTableRow',
          },
          type: VirtualDomElements.Tr,
        },
        {
          childCount: 1,
          props: {
            className: 'KeyBindingsTableCell',
          },
          type: VirtualDomElements.Th,
        },
        {
          childCount: 0,
          props: {
            text: 'Command',
          },
          type: VirtualDomElements.Text,
        },
        {
          childCount: 1,
          props: {
            className: 'KeyBindingsTableCell',
          },
          type: VirtualDomElements.Th,
        },
        {
          childCount: 0,
          props: {
            text: 'Key',
          },
          type: VirtualDomElements.Text,
        },
        {
          childCount: 1,
          props: {
            className: 'KeyBindingsTableCell',
          },
          type: VirtualDomElements.Th,
        },
        {
          childCount: 0,
          props: {
            text: 'When',
          },
          type: VirtualDomElements.Text,
        },
        {
          childCount: 0,
          props: {
            className: 'KeyBindingsTableBody',
          },
          type: VirtualDomElements.TBody,
        },
      ],
    ],
    ['Viewlet.ariaAnnounce', ''],
  ])
})

test('render - remove one keybinding', () => {
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
          childCount: 2,
          props: {
            ariaLabel: 'KeyBindings',
            ariaRowCount: 0,
            className: 'KeyBindingsTable',
          },
          type: VirtualDomElements.Table,
        },
        {
          childCount: 1,
          props: {
            className: 'KeyBindingsTableHead',
          },
          type: VirtualDomElements.THead,
        },
        {
          childCount: 3,
          props: {
            ariaRowIndex: 1,
            className: 'KeyBindingsTableRow',
          },
          type: VirtualDomElements.Tr,
        },
        {
          childCount: 1,
          props: {
            className: 'KeyBindingsTableCell',
          },
          type: VirtualDomElements.Th,
        },
        {
          childCount: 0,
          props: {
            text: 'Command',
          },
          type: VirtualDomElements.Text,
        },
        {
          childCount: 1,
          props: {
            className: 'KeyBindingsTableCell',
          },
          type: VirtualDomElements.Th,
        },
        {
          childCount: 0,
          props: {
            text: 'Key',
          },
          type: VirtualDomElements.Text,
        },
        {
          childCount: 1,
          props: {
            className: 'KeyBindingsTableCell',
          },
          type: VirtualDomElements.Th,
        },
        {
          childCount: 0,
          props: {
            text: 'When',
          },
          type: VirtualDomElements.Text,
        },
        {
          childCount: 0,
          props: {
            className: 'KeyBindingsTableBody',
          },
          type: VirtualDomElements.TBody,
        },
      ],
    ],
  ])
})
