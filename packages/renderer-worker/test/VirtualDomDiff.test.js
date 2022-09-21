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
      path: 0,
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
      path: 0,
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
      path: 0,
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
      operation: VirtualDomDiffType.ElementAdd,
      type: VirtualDomElements.Div,
      props: {},
      childCount: 0,
    },
  ])
})

test('diff - one element added with child', () => {
  const oldDom = []
  const newDom = [div({}, 1), text('hello world')]
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      operation: VirtualDomDiffType.ElementAdd,
      type: VirtualDomElements.Div,
      props: {},
      childCount: 1,
    },
    {
      operation: VirtualDomDiffType.ElementAdd,
      type: VirtualDomElements.Text,
      props: {
        text: 'hello world',
      },
      childCount: 0,
    },
  ])
})

test('diff - one element added - at start of element', () => {
  const oldDom = [div({}, 2), text('b'), text('c')]
  const newDom = [div({}, 3), text('a'), text('b'), text('c')]
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      key: 'text',
      operation: 1,
      path: 1,
      value: 'a',
    },
    {
      key: 'text',
      operation: 1,
      path: 2,
      value: 'b',
    },
    {
      childCount: 0,
      operation: 3,
      props: {
        text: 'c',
      },
      type: 7,
    },
  ])
})

test('diff - one element added - between elements', () => {
  const oldDom = [div({}, 2), text('a'), text('c')]
  const newDom = [div({}, 3), text('a'), text('b'), text('c')]
  const changes = VirtualDomDiff.diff(oldDom, newDom)
  expect(changes).toEqual([
    {
      key: 'text',
      operation: 1,
      path: 2,
      value: 'b',
    },
    {
      childCount: 0,
      operation: 3,
      props: {
        text: 'c',
      },
      type: 7,
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
      operation: VirtualDomDiffType.ElementAdd,
      type: VirtualDomElements.Div,
      props: {},
      childCount: 0,
    },
    {
      operation: VirtualDomDiffType.ElementAdd,
      type: VirtualDomElements.Div,
      props: {},
      childCount: 0,
    },
  ])
})
