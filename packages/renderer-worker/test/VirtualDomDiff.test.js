import * as VirtualDomDiff from '../src/parts/VirtualDomDiff/VirtualDomDiff.js'
import * as VirtualDomDiffType from '../src/parts/VirtualDomDiffType/VirtualDomDiffType.js'
import { div, text } from '../src/parts/VirtualDomHelpers/VirtualDomHelpers.js'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.js'

test('diff - no changes', () => {
  const oldDom = []
  const newDom = []
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([])
})

test('diff - one attribute added', () => {
  const oldDom = [div({}, 0)]
  const newDom = [
    div(
      {
        ariaSelected: true,
      },
      0
    ),
  ]
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      index: 0,
      operation: VirtualDomDiffType.AttributeSet,
      key: 'ariaSelected',
      value: true,
    },
  ])
})

test('diff - one attribute changed', () => {
  const oldDom = [
    div(
      {
        ariaSelected: false,
      },
      0
    ),
  ]
  const newDom = [
    div(
      {
        ariaSelected: true,
      },
      0
    ),
  ]
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      index: 0,
      operation: VirtualDomDiffType.AttributeSet,
      key: 'ariaSelected',
      value: true,
    },
  ])
})

test('diff - one attribute removed', () => {
  const oldDom = [
    div(
      {
        ariaSelected: false,
      },
      0
    ),
  ]
  const newDom = [div({}, 0)]
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      index: 0,
      operation: VirtualDomDiffType.AttributeRemove,
      key: 'ariaSelected',
    },
  ])
})

test('diff - one element added', () => {
  const oldDom = []
  const newDom = [div({}, 0)]
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      operation: VirtualDomDiffType.ElementsAdd,
      newDom: [
        {
          type: VirtualDomElements.Div,
          props: {},
          childCount: 0,
        },
      ],
    },
  ])
})

test('diff - one element added with child', () => {
  const oldDom = []
  const newDom = [div({}, 1), text('hello world')]
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      operation: VirtualDomDiffType.ElementsAdd,
      newDom: [
        {
          type: VirtualDomElements.Div,
          props: {},
          childCount: 1,
        },
        {
          type: VirtualDomElements.Text,
          props: {
            text: 'hello world',
          },
          childCount: 0,
        },
      ],
    },
  ])
})

test('diff - one element added - at start of element', () => {
  const oldDom = [div({}, 2), text('b'), text('c')]
  const newDom = [div({}, 3), text('a'), text('b'), text('c')]
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      operation: VirtualDomDiffType.AttributeSet,
      index: 1,
      key: 'text',
      value: 'a',
    },
    {
      operation: VirtualDomDiffType.AttributeSet,
      index: 2,
      key: 'text',
      value: 'b',
    },
    {
      operation: VirtualDomDiffType.ElementsAdd,
      newDom: [
        {
          childCount: 0,
          props: {
            text: 'c',
          },
          type: VirtualDomElements.Text,
        },
      ],
    },
  ])
})

test('diff - one element added - between elements', () => {
  const oldDom = [div({}, 2), text('a'), text('c')]
  const newDom = [div({}, 3), text('a'), text('b'), text('c')]
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      operation: VirtualDomDiffType.AttributeSet,
      index: 2,
      key: 'text',
      value: 'b',
    },
    {
      operation: VirtualDomDiffType.ElementsAdd,
      newDom: [
        {
          childCount: 0,
          props: {
            text: 'c',
          },
          type: VirtualDomElements.Text,
        },
      ],
    },
  ])
})

test('diff - one element added - at end of element', () => {
  const oldDom = [div({}, 2), text('a'), text('b')]
  const newDom = [div({}, 2), text('a'), text('b')]
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([])
})

test('diff - two elements added', () => {
  const oldDom = []
  const newDom = [div({}, 0), div({}, 0)]
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      operation: VirtualDomDiffType.ElementsAdd,
      newDom: [
        {
          type: VirtualDomElements.Div,
          props: {},
          childCount: 0,
        },
        {
          type: VirtualDomElements.Div,
          props: {},
          childCount: 0,
        },
      ],
    },
  ])
})

test('diff - one attribute removed, one attribute added', () => {
  const oldDom = [div({ id: 'QuickPickItemActive' }, 0), div({}, 0)]
  const newDom = [div({}, 0), div({ id: 'QuickPickItemActive' }, 0)]
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      operation: VirtualDomDiffType.AttributeRemove,
      key: 'id',
      index: 0,
    },
    {
      operation: VirtualDomDiffType.AttributeSet,
      key: 'id',
      value: 'QuickPickItemActive',
      index: 1,
    },
  ])
})
