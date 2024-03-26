import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'
import * as DiffDom from '../src/parts/DiffDom/DiffDom.js'
import * as DiffDomType from '../src/parts/DiffDomType/DiffDomType.js'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.js'
import { button, div, i, text } from '../src/parts/VirtualDomHelpers/VirtualDomHelpers.js'

test('diffDom - empty', () => {
  const oldDom = []
  const newDom = []
  expect(DiffDom.diffDom(oldDom, newDom)).toEqual([])
})

test('diffDom - remove a text node', () => {
  const oldDom = [text('hello world')]
  const newDom = []
  expect(DiffDom.diffDom(oldDom, newDom)).toEqual([
    {
      type: DiffDomType.Remove,
      nodes: [0],
    },
  ])
})

test('diffDom - add a text node', () => {
  const oldDom = []
  const newDom = [text('hello world')]
  expect(DiffDom.diffDom(oldDom, newDom)).toEqual([
    {
      index: 0,
      type: DiffDomType.Insert,
      nodes: [text('hello world')],
    },
  ])
})

test('diffDom - sub node attribute modified', () => {
  const oldDom = [
    div({ className: 'List' }, 2),
    div({ className: 'ListItems' }, 0),
    div({ className: 'ScrollBar' }, 1),
    div({ className: 'ScrollBarThumb', height: 10 }, 0),
  ]
  const newDom = [
    div({ className: 'List' }, 2),
    div({ className: 'ListItems' }, 0),
    div({ className: 'ScrollBar' }, 1),
    div({ className: 'ScrollBarThumb', height: 20 }, 0),
  ]
  expect(DiffDom.diffDom(oldDom, newDom)).toEqual([
    {
      type: DiffDomType.UpdateProp,
      index: 3,
      key: 'height',
      value: 20,
    },
  ])
})

test('diffDom - insert node - start', () => {
  const oldDom = [
    {
      type: VirtualDomElements.Div,
      className: 'b',
      childCount: 0,
      key: '2',
    },
  ]
  const newDom = [
    {
      type: VirtualDomElements.Span,
      className: 'a',
      childCount: 0,
      key: '1',
    },
    {
      type: VirtualDomElements.Div,
      className: 'b',
      childCount: 0,
      key: '2',
    },
  ]
  expect(DiffDom.diffDom(oldDom, newDom)).toEqual([
    {
      index: 0,
      nodes: [
        {
          childCount: 0,
          className: 'a',
          type: 8,
          key: '1',
        },
      ],
      type: 'insert',
    },
  ])
})

test('diffDom - insert node - middle', () => {
  const oldDom = [
    {
      type: VirtualDomElements.Div,
      className: 'a',
      childCount: 0,
      key: '1',
    },
    {
      type: VirtualDomElements.Div,
      className: 'c',
      childCount: 0,
      key: '3',
    },
  ]
  const newDom = [
    {
      type: VirtualDomElements.Div,
      className: 'a',
      childCount: 0,
      key: '1',
    },
    {
      type: VirtualDomElements.Span,
      className: 'b',
      childCount: 0,
      key: '2',
    },
    {
      type: VirtualDomElements.Div,
      className: 'c',
      childCount: 0,
      key: '3',
    },
  ]
  expect(DiffDom.diffDom(oldDom, newDom)).toEqual([
    {
      index: 1,
      nodes: [
        {
          childCount: 0,
          className: 'b',
          type: 8,
          key: '2',
        },
      ],
      type: 'insert',
    },
  ])
})

test('diffDom - insert node - end', () => {
  const oldDom = [
    {
      type: VirtualDomElements.Div,
      className: 'a',
      childCount: 0,
    },
  ]
  const newDom = [
    {
      type: VirtualDomElements.Div,
      className: 'a',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Span,
      className: 'b',
      childCount: 0,
    },
  ]
  expect(DiffDom.diffDom(oldDom, newDom)).toEqual([
    {
      index: 1,
      nodes: [
        {
          childCount: 0,
          className: 'b',
          type: 8,
        },
      ],
      type: 'insert',
    },
  ])
})

test('diffDom - sub node removed at end', () => {
  const oldDom = [
    div({ className: 'List' }, 2),
    div({ className: 'ListItems' }, 0),
    div({ className: 'ScrollBar' }, 1),
    div({ className: 'ScrollBarThumb', height: 10 }, 0),
  ]
  const newDom = [div({ className: 'List' }, 2), div({ className: 'ListItems' }, 0)]
  expect(DiffDom.diffDom(oldDom, newDom)).toEqual([
    {
      type: DiffDomType.Remove,
      nodes: [2],
    },
  ])
})

test('diffDom - sub node removed at start', () => {
  const oldDom = [
    div({ className: 'List' }, 2),
    div({ className: 'ScrollBar' }, 1),
    div({ className: 'ScrollBarThumb', height: 10 }, 0),
    div({ className: 'ListItems' }, 0),
  ]
  const newDom = [div({ className: 'List' }, 2), div({ className: 'ListItems' }, 0)]
  expect(DiffDom.diffDom(oldDom, newDom)).toEqual([
    {
      index: 1,
      key: 'className',
      type: DiffDomType.UpdateProp,
      value: 'ListItems',
    },
    {
      type: DiffDomType.Remove,
      nodes: [2],
    },
    {
      type: DiffDomType.Remove,
      nodes: [3],
    },
  ])
})

test('diffDom - nested nodes inserted', () => {
  const oldDom = []
  const newDom = [div({ className: 'List' }, 1), div({ className: 'ListItems' }, 0)]
  expect(DiffDom.diffDom(oldDom, newDom)).toEqual([
    {
      index: 0,
      type: DiffDomType.Insert,
      nodes: [div({ className: 'List' }, 1), div({ className: 'ListItems' }, 0)],
    },
  ])
})

test('diffDom - multiple nodes inserted', () => {
  const oldDom = []
  const newDom = [div({ className: 'a' }, 0), div({ className: 'b' }, 0)]
  expect(DiffDom.diffDom(oldDom, newDom)).toEqual([
    {
      index: 0,
      type: DiffDomType.Insert,
      nodes: [div({ className: 'a' }, 0), div({ className: 'b' }, 0)],
    },
  ])
})

test('diffDom - multiple nodes removed', () => {
  const oldDom = [div({ className: 'a' }, 0), div({ className: 'b' }, 0)]
  const newDom = []
  expect(DiffDom.diffDom(oldDom, newDom)).toEqual([
    {
      type: DiffDomType.Remove,
      nodes: [0, 1],
    },
  ])
})

test('diffDom - remove and add nodes', () => {
  const oldDom = [div({ className: 'a' }, 1), i({ className: 'b' }, 0), div({ className: 'a' }, 0)]
  const newDom = [div({ className: 'a' }, 0), div({ className: 'a' }, 1), i({ className: 'b' }, 0)]
  expect(DiffDom.diffDom(oldDom, newDom)).toEqual([
    {
      type: DiffDomType.Remove,
      nodes: [1],
    },
    {
      index: 2,
      nodes: [i({ className: 'b' }, 0)],
      type: DiffDomType.Insert,
    },
  ])
})

test('diffDom - add one node with one child node', () => {
  const oldDom = [div({ className: 'a' }, 0)]
  const newDom = [div({ className: 'a' }, 1), div({ className: 'a' }, 1), div({ className: 'a' }, 0)]
  expect(DiffDom.diffDom(oldDom, newDom)).toEqual([
    {
      index: 0,
      nodes: [div({ className: 'a' }, 1), div({ className: 'a' }, 0)],
      type: DiffDomType.Insert,
    },
  ])
})

test('diffDom - add node with child nodes', () => {
  const oldDom = [div({ className: 'a' }, 1), div({ className: 'a' }, 0)]
  const newDom = [div({ className: 'a' }, 1), div({ className: 'a' }, 1), div({ className: 'a' }, 1), div({ className: 'a' }, 0)]
  expect(DiffDom.diffDom(oldDom, newDom)).toEqual([
    {
      index: 1,
      nodes: [div({ className: 'a' }, 1), div({ className: 'a' }, 0)],
      type: DiffDomType.Insert,
    },
  ])
})

test('diffDom - remove node with child nodes', () => {
  const oldDom = [div({ className: 'a' }, 1), div({ className: 'a' }, 1), div({ className: 'a' }, 1), div({ className: 'a' }, 0)]
  const newDom = [div({ className: 'a' }, 1), div({ className: 'a' }, 0)]
  expect(DiffDom.diffDom(oldDom, newDom)).toEqual([
    {
      nodes: [2],
      type: DiffDomType.Remove,
    },
  ])
})

test.skip('diffDom - add node with child nodes', () => {
  const oldDom = [div({ className: 'a' }, 1), div({ className: 'a' }, 0)]
  const newDom = [div({ className: 'a' }, 1), div({ className: 'a' }, 1), div({ className: 'a' }, 1), div({ className: 'a' }, 0)]
  expect(DiffDom.diffDom(oldDom, newDom)).toEqual([
    {
      index: 1,
      nodes: [div({ className: 'a' }, 1), div({ className: 'a' }, 0)],
      type: DiffDomType.Insert,
    },
  ])
})

test('diffDom - remove node with child nodes', () => {
  const oldDom = [div({ className: 'a' }, 1), div({ className: 'a' }, 1), div({ className: 'a' }, 1), div({ className: 'a' }, 0)]
  const newDom = [div({ className: 'a' }, 1), div({ className: 'a' }, 0)]
  expect(DiffDom.diffDom(oldDom, newDom)).toEqual([
    {
      nodes: [2],
      type: DiffDomType.Remove,
    },
  ])
})

test('diffDom - remove child node and replace text node', () => {
  const oldDom = [
    div(
      {
        className: 'DebugSectionHeader',
        ariaExpanded: false,
      },
      2,
    ),
    div(
      {
        className: 'MaskIcon DebugMaskIcon',
        maskImage: '/icons/triangle-right.svg',
      },
      0,
    ),
    text('Call Stack'),
  ]
  const newDom = [
    div(
      {
        className: 'DebugPausedMessage',
      },
      1,
    ),
    text('Not Paused'),
  ]
  expect(DiffDom.diffDom(oldDom, newDom)).toEqual([
    {
      index: 0,
      type: DiffDomType.UpdateProp,
      key: 'className',
      value: 'DebugPausedMessage',
    },
    {
      index: 0,
      type: DiffDomType.RemoveProp,
      key: 'ariaExpanded',
    },
    {
      index: 1,
      type: DiffDomType.Replace,
      nodes: [text('Not Paused')],
    },
    {
      type: DiffDomType.Remove,
      nodes: [2],
    },
  ])
})

test('diffDom - endless recursion bug', () => {
  const oldDom = [
    div(
      {
        className: 'DebugButtons',
      },
      4,
    ),
    div(
      {
        className: 'IconButton DebugButton',
        title: 'Pause',
      },
      1,
    ),
    div(
      {
        className: 'MaskIcon',
        maskImage: '/icons/debug-pause.svg',
      },
      0,
    ),
    button(
      {
        className: 'IconButton DebugButton',
        title: 'Step Over',
      },
      1,
    ),

    div(
      {
        className: 'MaskIcon',
        maskImage: '/icons/debug-step-over.svg',
      },
      0,
    ),
    button(
      {
        className: 'IconButton DebugButton',
        title: 'Step Into',
      },
      1,
    ),
    div(
      {
        className: 'MaskIcon',
        maskImage: '/icons/debug-step-into.svg',
      },
      0,
    ),
    button(
      {
        className: 'IconButton DebugButton',
        title: 'Step Out',
      },
      1,
    ),
    div(
      {
        className: 'MaskIcon',
        maskImage: '/icons/debug-step-out.svg',
      },
      0,
    ),
    div(
      {
        className: 'DebugSectionHeader',
        tabIndex: 0,
      },
      2,
    ),
    div(
      {
        className: 'MaskIcon DebugMaskIcon',
        maskImage: '/icons/triangle-right.svg',
      },
      0,
    ),
    text('Watch'),
    div(
      {
        className: 'DebugSectionHeader',
        tabIndex: 0,
      },
      2,
    ),
    div(
      {
        className: 'MaskIcon DebugMaskIcon',
        maskImage: '/icons/triangle-right.svg',
      },
      0,
    ),
    text('BreakPoints'),
    div(
      {
        className: 'DebugSectionHeader',
        role: 'treeitem',
        ariaLevel: 1,
        ariaExpanded: false,
        tabIndex: 0,
      },
      2,
    ),
    div(
      {
        className: 'MaskIcon DebugMaskIcon',
        maskImage: '/icons/triangle-right.svg',
      },
      0,
    ),
    text('Scope'),
    div(
      {
        className: 'DebugSectionHeader',
        ariaExpanded: false,
      },
      2,
    ),
    div(
      {
        className: 'MaskIcon DebugMaskIcon',
        maskImage: '/icons/triangle-right.svg',
      },
      0,
    ),
    text('Call Stack'),
  ]
  const newDom = [
    div(
      {
        className: 'DebugButtons',
      },
      4,
    ),
    button(
      {
        className: 'IconButton DebugButton',
        title: 'Pause',
      },
      1,
    ),
    div(
      {
        className: 'MaskIcon',
        maskImage: '/icons/debug-pause.svg',
      },
      0,
    ),
    button(
      {
        className: 'IconButton DebugButton',
        title: 'Step Over',
      },
      1,
    ),
    div(
      {
        className: 'MaskIcon',
        maskImage: '/icons/debug-step-over.svg',
      },
      0,
    ),
    button(
      {
        className: 'IconButton DebugButton',
        title: 'Step Into',
      },
      1,
    ),
    div(
      {
        className: 'MaskIcon',
        maskImage: '/icons/debug-step-into.svg',
      },
      0,
    ),
    button(
      {
        className: 'IconButton DebugButton',
        title: 'Step Out',
      },
      1,
    ),
    div(
      {
        className: 'MaskIcon',
        maskImage: '/icons/debug-step-out.svg',
      },
      0,
    ),
    div(
      {
        className: 'DebugSectionHeader',
        tabIndex: 0,
      },
      2,
    ),
    div(
      {
        className: 'MaskIcon DebugMaskIcon',
        maskImage: '/icons/triangle-right.svg',
      },
      0,
    ),
    text('Watch'),
    div(
      {
        className: 'DebugSectionHeader',
        tabIndex: 0,
      },
      2,
    ),
    div(
      {
        className: 'MaskIcon DebugMaskIcon',
        maskImage: '/icons/triangle-right.svg',
      },
      0,
    ),
    text('BreakPoints'),
    div(
      {
        className: 'DebugSectionHeader',
        role: 'treeitem',
        ariaLevel: 1,
        ariaExpanded: true,
      },
      2,
    ),
    div(
      {
        className: 'MaskIcon DebugMaskIcon',
        maskImage: '/icons/triangle-down.svg',
      },
      0,
    ),
    text('Scope'),
    div(
      {
        className: 'DebugPausedMessage',
      },
      1,
    ),
    text('Not Paused'),
    div(
      {
        className: 'DebugSectionHeader',
        ariaExpanded: true,
      },
      2,
    ),
    div(
      {
        className: 'MaskIcon DebugMaskIcon',
        maskImage: '/icons/triangle-down.svg',
      },
      0,
    ),
    text('Call Stack'),
    div(
      {
        className: 'DebugPausedMessage',
      },
      1,
    ),
    text('Not Paused'),
  ]
  expect(DiffDom.diffDom(oldDom, newDom)).toEqual([
    {
      index: 1,
      nodes: [
        button(
          {
            className: 'IconButton DebugButton',
            title: 'Pause',
          },
          1,
        ),
        div(
          {
            className: 'MaskIcon',
            maskImage: '/icons/debug-pause.svg',
          },
          0,
        ),
      ],
      type: DiffDomType.Replace,
    },
    {
      index: 15,
      key: 'ariaExpanded',
      type: DiffDomType.UpdateProp,
      value: true,
    },
    {
      index: 15,
      key: 'tabIndex',
      type: DiffDomType.RemoveProp,
    },
    {
      index: 16,
      key: 'maskImage',
      type: DiffDomType.UpdateProp,
      value: '/icons/triangle-down.svg',
    },
    {
      index: 18,
      key: 'className',
      type: DiffDomType.UpdateProp,
      value: 'DebugPausedMessage',
    },
    {
      index: 18,
      key: 'ariaExpanded',
      type: DiffDomType.RemoveProp,
    },
    {
      index: 19,
      nodes: [text('Not Paused')],
      type: DiffDomType.Replace,
    },
    {
      nodes: [20],
      type: DiffDomType.Remove,
    },
    {
      index: 21,
      nodes: [
        div(
          {
            ariaExpanded: true,
            className: 'DebugSectionHeader',
          },
          2,
        ),
        div(
          {
            className: 'MaskIcon DebugMaskIcon',
            maskImage: '/icons/triangle-down.svg',
          },
          0,
        ),
        text('Call Stack'),
        div(
          {
            className: 'DebugPausedMessage',
          },
          1,
        ),
        text('Not Paused'),
      ],
      type: DiffDomType.Insert,
    },
  ])
})

test('diffDom - toggle replace - collapse', () => {
  const oldDom = [
    {
      type: 4,
      className: 'SearchHeader',
      childCount: 2,
    },
    {
      type: 4,
      className: 'SearchHeaderTop',
      childCount: 2,
    },
    {
      type: 1,
      className: 'IconButton SearchToggleButton SearchToggleButtonExpanded',
      title: 'Toggle Replace',
      ariaLabel: 'Toggle Replace',
      ariaExpanded: true,
      childCount: 1,
      'data-command': 'toggleReplace',
    },
    {
      type: 4,
      className: 'MaskIcon MaskIconChevronDown',
      childCount: 0,
    },
    {
      type: 4,
      className: 'SearchHeaderTopRight',
      childCount: 2,
    },
    {
      type: 4,
      className: 'SearchField',
      childCount: 4,
    },
    {
      type: 62,
      className: 'MultilineInputBox',
      spellcheck: false,
      autocapitalize: 'off',
      autocorrect: 'off',
      placeholder: 'Search',
      name: 'search-value',
      childCount: 0,
    },
    {
      type: 4,
      className: 'SearchFieldButton ',
      title: 'Match Case',
      role: 'checkbox',
      childCount: 1,
      ariaChecked: false,
      'data-command': 'toggleMatchCase',
    },
    {
      type: 4,
      className: 'MaskIcon MaskIconCaseSensitive',
      childCount: 0,
    },
    {
      type: 4,
      className: 'SearchFieldButton ',
      title: 'Match Whole Word',
      role: 'checkbox',
      childCount: 1,
      ariaChecked: false,
      'data-command': 'toggleMatchWholeWord',
    },
    {
      type: 4,
      className: 'MaskIcon MaskIconWholeWord',
      childCount: 0,
    },
    {
      type: 4,
      className: 'SearchFieldButton ',
      title: 'Use Regular Expression',
      role: 'checkbox',
      childCount: 1,
      ariaChecked: false,
      'data-command': 'toggleUseRegularExpression',
    },
    {
      type: 4,
      className: 'MaskIcon MaskIconRegex',
      childCount: 0,
    },
    {
      type: 4,
      className: 'SearchField SearchFieldReplace',
      childCount: 2,
    },
    {
      type: 6,
      className: 'SearchFieldInput',
      spellcheck: false,
      autocapitalize: 'off',
      inputType: 'text',
      autocorrect: 'off',
      placeholder: 'Replace',
      name: 'search-replace-value',
      childCount: 0,
    },
    {
      type: 1,
      className: 'SearchFieldButton',
      title: 'Replace All',
      childCount: 1,
    },
    {
      type: 4,
      className: 'MaskIcon MaskIconReplaceAll',
      role: 'none',
      childCount: 0,
    },
    {
      type: 4,
      className: 'ViewletSearchMessage',
      role: 'status',
      tabIndex: 0,
      childCount: 1,
    },
    {
      type: 12,
      text: '107 results in 12 files',
      childCount: 0,
    },
  ]
  const newDom = [
    {
      type: 4,
      className: 'SearchHeader',
      childCount: 2,
    },
    {
      type: 4,
      className: 'SearchHeaderTop',
      childCount: 2,
    },
    {
      type: 1,
      className: 'IconButton SearchToggleButton ',
      title: 'Toggle Replace',
      ariaLabel: 'Toggle Replace',
      ariaExpanded: false,
      childCount: 1,
      'data-command': 'toggleReplace',
    },
    {
      type: 4,
      className: 'MaskIcon MaskIconChevronRight',
      childCount: 0,
    },
    {
      type: 4,
      className: 'SearchHeaderTopRight',
      childCount: 1,
    },
    {
      type: 4,
      className: 'SearchField',
      childCount: 4,
    },
    {
      type: 62,
      className: 'MultilineInputBox',
      spellcheck: false,
      autocapitalize: 'off',
      autocorrect: 'off',
      placeholder: 'Search',
      name: 'search-value',
      childCount: 0,
    },
    {
      type: 4,
      className: 'SearchFieldButton ',
      title: 'Match Case',
      role: 'checkbox',
      childCount: 1,
      ariaChecked: false,
      'data-command': 'toggleMatchCase',
    },
    {
      type: 4,
      className: 'MaskIcon MaskIconCaseSensitive',
      childCount: 0,
    },
    {
      type: 4,
      className: 'SearchFieldButton ',
      title: 'Match Whole Word',
      role: 'checkbox',
      childCount: 1,
      ariaChecked: false,
      'data-command': 'toggleMatchWholeWord',
    },
    {
      type: 4,
      className: 'MaskIcon MaskIconWholeWord',
      childCount: 0,
    },
    {
      type: 4,
      className: 'SearchFieldButton ',
      title: 'Use Regular Expression',
      role: 'checkbox',
      childCount: 1,
      ariaChecked: false,
      'data-command': 'toggleUseRegularExpression',
    },
    {
      type: 4,
      className: 'MaskIcon MaskIconRegex',
      childCount: 0,
    },
    {
      type: 4,
      className: 'ViewletSearchMessage',
      role: 'status',
      tabIndex: 0,
      childCount: 1,
    },
    {
      type: 12,
      text: '107 results in 12 files',
      childCount: 0,
    },
  ]
  expect(DiffDom.diffDom(oldDom, newDom)).toEqual([
    {
      index: 2,
      key: 'className',
      type: DiffDomType.UpdateProp,
      value: 'IconButton SearchToggleButton ',
    },
    {
      index: 2,
      key: 'ariaExpanded',
      type: DiffDomType.UpdateProp,
      value: false,
    },
    {
      index: 3,
      key: 'className',
      type: DiffDomType.UpdateProp,
      value: 'MaskIcon MaskIconChevronRight',
    },
    {
      nodes: [13, 16],
      type: DiffDomType.Remove,
    },
  ])
})

test('diffDom - toggle replace - expand', () => {
  const newDom = [
    {
      type: 4,
      className: 'SearchHeader',
      childCount: 2,
    },
    {
      type: 4,
      className: 'SearchHeaderTop',
      childCount: 2,
    },
    {
      type: 1,
      className: 'IconButton SearchToggleButton SearchToggleButtonExpanded',
      title: 'Toggle Replace',
      ariaLabel: 'Toggle Replace',
      ariaExpanded: true,
      childCount: 1,
      'data-command': 'toggleReplace',
    },
    {
      type: 4,
      className: 'MaskIcon MaskIconChevronDown',
      childCount: 0,
    },
    {
      type: 4,
      className: 'SearchHeaderTopRight',
      childCount: 2,
    },
    {
      type: 4,
      className: 'SearchField',
      childCount: 4,
    },
    {
      type: 62,
      className: 'MultilineInputBox',
      spellcheck: false,
      autocapitalize: 'off',
      autocorrect: 'off',
      placeholder: 'Search',
      name: 'search-value',
      childCount: 0,
    },
    {
      type: 4,
      className: 'SearchFieldButton ',
      title: 'Match Case',
      role: 'checkbox',
      childCount: 1,
      ariaChecked: false,
      'data-command': 'toggleMatchCase',
    },
    {
      type: 4,
      className: 'MaskIcon MaskIconCaseSensitive',
      childCount: 0,
    },
    {
      type: 4,
      className: 'SearchFieldButton ',
      title: 'Match Whole Word',
      role: 'checkbox',
      childCount: 1,
      ariaChecked: false,
      'data-command': 'toggleMatchWholeWord',
    },
    {
      type: 4,
      className: 'MaskIcon MaskIconWholeWord',
      childCount: 0,
    },
    {
      type: 4,
      className: 'SearchFieldButton ',
      title: 'Use Regular Expression',
      role: 'checkbox',
      childCount: 1,
      ariaChecked: false,
      'data-command': 'toggleUseRegularExpression',
    },
    {
      type: 4,
      className: 'MaskIcon MaskIconRegex',
      childCount: 0,
    },
    {
      type: 4,
      className: 'SearchField SearchFieldReplace',
      childCount: 2,
    },
    {
      type: 6,
      className: 'SearchFieldInput',
      spellcheck: false,
      autocapitalize: 'off',
      inputType: 'text',
      autocorrect: 'off',
      placeholder: 'Replace',
      name: 'search-replace-value',
      childCount: 0,
    },
    {
      type: 1,
      className: 'SearchFieldButton',
      title: 'Replace All',
      childCount: 1,
    },
    {
      type: 4,
      className: 'MaskIcon MaskIconReplaceAll',
      role: 'none',
      childCount: 0,
    },
    {
      type: 4,
      className: 'ViewletSearchMessage',
      role: 'status',
      tabIndex: 0,
      childCount: 1,
    },
    {
      type: 12,
      text: '107 results in 12 files',
      childCount: 0,
    },
  ]
  const oldDom = [
    {
      type: 4,
      className: 'SearchHeader',
      childCount: 2,
    },
    {
      type: 4,
      className: 'SearchHeaderTop',
      childCount: 2,
    },
    {
      type: 1,
      className: 'IconButton SearchToggleButton ',
      title: 'Toggle Replace',
      ariaLabel: 'Toggle Replace',
      ariaExpanded: false,
      childCount: 1,
      'data-command': 'toggleReplace',
    },
    {
      type: 4,
      className: 'MaskIcon MaskIconChevronRight',
      childCount: 0,
    },
    {
      type: 4,
      className: 'SearchHeaderTopRight',
      childCount: 1,
    },
    {
      type: 4,
      className: 'SearchField',
      childCount: 4,
    },
    {
      type: 62,
      className: 'MultilineInputBox',
      spellcheck: false,
      autocapitalize: 'off',
      autocorrect: 'off',
      placeholder: 'Search',
      name: 'search-value',
      childCount: 0,
    },
    {
      type: 4,
      className: 'SearchFieldButton ',
      title: 'Match Case',
      role: 'checkbox',
      childCount: 1,
      ariaChecked: false,
      'data-command': 'toggleMatchCase',
    },
    {
      type: 4,
      className: 'MaskIcon MaskIconCaseSensitive',
      childCount: 0,
    },
    {
      type: 4,
      className: 'SearchFieldButton ',
      title: 'Match Whole Word',
      role: 'checkbox',
      childCount: 1,
      ariaChecked: false,
      'data-command': 'toggleMatchWholeWord',
    },
    {
      type: 4,
      className: 'MaskIcon MaskIconWholeWord',
      childCount: 0,
    },
    {
      type: 4,
      className: 'SearchFieldButton ',
      title: 'Use Regular Expression',
      role: 'checkbox',
      childCount: 1,
      ariaChecked: false,
      'data-command': 'toggleUseRegularExpression',
    },
    {
      type: 4,
      className: 'MaskIcon MaskIconRegex',
      childCount: 0,
    },
    {
      type: 4,
      className: 'ViewletSearchMessage',
      role: 'status',
      tabIndex: 0,
      childCount: 1,
    },
    {
      type: 12,
      text: '107 results in 12 files',
      childCount: 0,
    },
  ]
  expect(DiffDom.diffDom(oldDom, newDom)).toEqual([
    {
      index: 2,
      key: 'className',
      type: DiffDomType.UpdateProp,
      value: 'IconButton SearchToggleButton SearchToggleButtonExpanded',
    },
    {
      index: 2,
      key: 'ariaExpanded',
      type: DiffDomType.UpdateProp,
      value: true,
    },
    {
      index: 3,
      key: 'className',
      type: DiffDomType.UpdateProp,
      value: 'MaskIcon MaskIconChevronDown',
    },
    {
      index: 13,
      nodes: [
        {
          childCount: 2,
          className: 'SearchField SearchFieldReplace',
          type: 4,
        },
        {
          autocapitalize: 'off',
          autocorrect: 'off',
          childCount: 0,
          className: 'SearchFieldInput',
          inputType: 'text',
          name: 'search-replace-value',
          placeholder: 'Replace',
          spellcheck: false,
          type: 6,
        },
        {
          childCount: 1,
          className: 'SearchFieldButton',
          title: 'Replace All',
          type: 1,
        },
        {
          childCount: 0,
          className: 'MaskIcon MaskIconReplaceAll',
          role: 'none',
          type: 4,
        },
        {
          childCount: 1,
          className: 'ViewletSearchMessage',
          role: 'status',
          tabIndex: 0,
          type: 4,
        },
        {
          childCount: 0,
          text: '107 results in 12 files',
          type: 12,
        },
      ],
      type: DiffDomType.Insert,
    },
  ])
})

test('diffDom - source control buttons', () => {
  const oldDom = [
    {
      type: 4,
      className: 'SourceControlHeader',
      childCount: 1,
    },
    {
      type: 6,
      className: 'InputBox',
      spellcheck: false,
      autocapitalize: 'off',
      autocorrect: 'off',
      placeholder: "Message (Enter) to commit on 'master'",
      ariaLabel: 'Source Control Input',
      childCount: 0,
    },
    {
      type: 4,
      className: 'SplitButton ',
      childCount: 3,
    },
    {
      type: 4,
      className: 'SplitButtonContent ',
      childCount: 1,
      tabIndex: 0,
    },
    {
      type: 12,
      text: 'Commit',
      childCount: 0,
    },
    {
      type: 4,
      className: 'SplitButtonSeparator',
      childCount: 0,
    },
    {
      type: 4,
      className: 'SplitButtonDropDown ',
      childCount: 1,
      tabIndex: 0,
    },
    {
      type: 4,
      className: 'MaskIcon MaskIconChevronDown',
      childCount: 0,
    },
    {
      type: 4,
      className: 'SourceControlItems',
      role: 'tree',
      childCount: 3,
    },
    {
      type: 4,
      className: 'TreeItem',
      role: 'treeitem',
      ariaExpanded: true,
      ariaPosInSet: 1,
      ariaSetSize: 1,
      childCount: 3,
      paddingLeft: '1rem',
      paddingRight: '12px',
    },
    {
      type: 4,
      className: 'Chevron MaskIconChevronDown',
      childCount: 0,
    },
    {
      type: 4,
      className: 'Label Grow',
      childCount: 1,
    },
    {
      type: 12,
      text: 'Changes',
      childCount: 0,
    },
    {
      type: 4,
      className: 'Badge SourceControlBadge',
      childCount: 1,
    },
    {
      type: 12,
      text: '2',
      childCount: 0,
    },
    {
      type: 4,
      className: 'TreeItem',
      role: 'treeitem',
      ariaPosInSet: 1,
      ariaSetSize: 2,
      title: 'package-lock.json',
      childCount: 3,
      paddingLeft: '1rem',
      paddingRight: '12px',
    },
    {
      type: 17,
      className: 'FileIcon',
      src: '',
      role: 'none',
      childCount: 0,
    },
    {
      type: 4,
      className: 'Label Grow',
      childCount: 1,
    },
    {
      type: 12,
      text: 'package-lock.json',
      childCount: 0,
    },
    {
      type: 17,
      className: 'DecorationIcon',
      title: 'Modified',
      src: '/extensions/builtin.git/icons/dark/status-modified.svg',
      childCount: 0,
    },
    {
      type: 4,
      className: 'TreeItem',
      role: 'treeitem',
      ariaPosInSet: 2,
      ariaSetSize: 2,
      title: 'package.json',
      childCount: 3,
      paddingLeft: '1rem',
      paddingRight: '12px',
    },
    {
      type: 17,
      className: 'FileIcon',
      src: '',
      role: 'none',
      childCount: 0,
    },
    {
      type: 4,
      className: 'Label Grow',
      childCount: 1,
    },
    {
      type: 12,
      text: 'package.json',
      childCount: 0,
    },
    {
      type: 17,
      className: 'DecorationIcon',
      title: 'Modified',
      src: '/extensions/builtin.git/icons/dark/status-modified.svg',
      childCount: 0,
    },
  ]
  const newDom = [
    {
      type: 4,
      className: 'SourceControlHeader',
      childCount: 1,
    },
    {
      type: 6,
      className: 'InputBox',
      spellcheck: false,
      autocapitalize: 'off',
      autocorrect: 'off',
      placeholder: "Message (Enter) to commit on 'master'",
      ariaLabel: 'Source Control Input',
      childCount: 0,
    },
    {
      type: 4,
      className: 'SplitButton ',
      childCount: 3,
    },
    {
      type: 4,
      className: 'SplitButtonContent ',
      childCount: 1,
      tabIndex: 0,
    },
    {
      type: 12,
      text: 'Commit',
      childCount: 0,
    },
    {
      type: 4,
      className: 'SplitButtonSeparator',
      childCount: 0,
    },
    {
      type: 4,
      className: 'SplitButtonDropDown ',
      childCount: 1,
      tabIndex: 0,
    },
    {
      type: 4,
      className: 'MaskIcon MaskIconChevronDown',
      childCount: 0,
    },
    {
      type: 4,
      className: 'SourceControlItems',
      role: 'tree',
      childCount: 3,
    },
    {
      type: 4,
      className: 'TreeItem',
      role: 'treeitem',
      ariaExpanded: true,
      ariaPosInSet: 1,
      ariaSetSize: 1,
      childCount: 3,
      paddingLeft: '1rem',
      paddingRight: '12px',
    },
    {
      type: 4,
      className: 'Chevron MaskIconChevronDown',
      childCount: 0,
    },
    {
      type: 4,
      className: 'Label Grow',
      childCount: 1,
    },
    {
      type: 12,
      text: 'Changes',
      childCount: 0,
    },
    {
      type: 4,
      className: 'Badge SourceControlBadge',
      childCount: 1,
    },
    {
      type: 12,
      text: '2',
      childCount: 0,
    },
    {
      type: 4,
      className: 'TreeItem',
      role: 'treeitem',
      ariaPosInSet: 1,
      ariaSetSize: 2,
      title: 'package-lock.json',
      childCount: 3,
      paddingLeft: '1rem',
      paddingRight: '12px',
    },
    {
      type: 17,
      className: 'FileIcon',
      src: '/test/extensions/builtin.vscode-icons//icons/file_type_npm.svg',
      role: 'none',
      childCount: 0,
    },
    {
      type: 4,
      className: 'Label Grow',
      childCount: 1,
    },
    {
      type: 12,
      text: 'package-lock.json',
      childCount: 0,
    },
    {
      type: 17,
      className: 'DecorationIcon',
      title: 'Modified',
      src: '/extensions/builtin.git/icons/dark/status-modified.svg',
      childCount: 0,
    },
    {
      type: 4,
      className: 'TreeItem',
      role: 'treeitem',
      ariaPosInSet: 2,
      ariaSetSize: 2,
      title: 'package.json',
      childCount: 6,
      paddingLeft: '1rem',
      paddingRight: '12px',
    },
    {
      type: 17,
      className: 'FileIcon',
      src: '/test/extensions/builtin.vscode-icons//icons/file_type_npm.svg',
      role: 'none',
      childCount: 0,
    },
    {
      type: 4,
      className: 'Label Grow',
      childCount: 1,
    },
    {
      type: 12,
      text: 'package.json',
      childCount: 0,
    },
    {
      type: 1,
      className: 'SourceControlButton',
      title: 'Open File',
      ariaLabel: 'Open File',
      childCount: 1,
    },
    {
      type: 8,
      className: 'MaskIcon MaskIconGoToFile',
      role: 'none',
      childCount: 0,
    },
    {
      type: 1,
      className: 'SourceControlButton',
      title: 'Discard',
      ariaLabel: 'Discard',
      childCount: 1,
    },
    {
      type: 8,
      className: 'MaskIcon MaskIconDiscard',
      role: 'none',
      childCount: 0,
    },
    {
      type: 1,
      className: 'SourceControlButton',
      title: 'Stage',
      ariaLabel: 'Stage',
      childCount: 1,
    },
    {
      type: 8,
      className: 'MaskIcon MaskIconAdd',
      role: 'none',
      childCount: 0,
    },
    {
      type: 17,
      className: 'DecorationIcon',
      title: 'Modified',
      src: '/extensions/builtin.git/icons/dark/status-modified.svg',
      childCount: 0,
    },
  ]
  expect(DiffDom.diffDom(oldDom, newDom)).toEqual([
    {
      index: 16,
      key: 'src',
      type: 'updateProp',
      value: '/test/extensions/builtin.vscode-icons//icons/file_type_npm.svg',
    },
    {
      index: 21,
      key: 'src',
      type: 'updateProp',
      value: '/test/extensions/builtin.vscode-icons//icons/file_type_npm.svg',
    },
    {
      index: 24,
      nodes: [
        {
          ariaLabel: 'Open File',
          childCount: 1,
          className: 'SourceControlButton',
          title: 'Open File',
          type: 1,
        },
        {
          childCount: 0,
          className: 'MaskIcon MaskIconGoToFile',
          role: 'none',
          type: 8,
        },
      ],
      type: DiffDomType.Replace,
    },
    {
      index: 25,
      nodes: [
        {
          ariaLabel: 'Discard',
          childCount: 1,
          className: 'SourceControlButton',
          title: 'Discard',
          type: 1,
        },
        {
          childCount: 0,
          className: 'MaskIcon MaskIconDiscard',
          role: 'none',
          type: 8,
        },
        {
          ariaLabel: 'Stage',
          childCount: 1,
          className: 'SourceControlButton',
          title: 'Stage',
          type: 1,
        },
        {
          childCount: 0,
          className: 'MaskIcon MaskIconAdd',
          role: 'none',
          type: 8,
        },
        {
          childCount: 0,
          className: 'DecorationIcon',
          src: '/extensions/builtin.git/icons/dark/status-modified.svg',
          title: 'Modified',
          type: 17,
        },
      ],
      type: DiffDomType.Insert,
    },
  ])
})
