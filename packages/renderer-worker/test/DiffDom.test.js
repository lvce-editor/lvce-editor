import * as DiffDom from '../src/parts/DiffDom/DiffDom.js'
import * as DiffDomType from '../src/parts/DiffDomType/DiffDomType.js'
import { div, i, text } from '../src/parts/VirtualDomHelpers/VirtualDomHelpers.js'

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
      nodes: [2, 3],
    },
  ])
})

test('diffDom - nested nodes inserted', () => {
  const oldDom = []
  const newDom = [div({ className: 'List' }, 1), div({ className: 'ListItems' }, 0)]
  expect(DiffDom.diffDom(oldDom, newDom)).toEqual([
    {
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
  const oldDom = [div({ className: 'a' }, 1), i({ className: 'b' }, 0), div({ className: 'a' })]
  const newDom = [div({ className: 'a' }, 0), div({ className: 'a' }, 1), i({ className: 'b' }, 0)]
  expect(DiffDom.diffDom(oldDom, newDom)).toEqual([
    {
      index: 1,
      nodes: [div({ className: 'a' }, 1), i({ className: 'b' }, 0)],
      type: DiffDomType.Insert,
    },
    {
      nodes: [2],
      type: DiffDomType.Remove,
    },
  ])
})
