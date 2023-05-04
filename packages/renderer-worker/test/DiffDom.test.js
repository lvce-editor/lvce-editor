import * as DiffDom from '../src/parts/DiffDom/DiffDom.js'
import * as DiffDomType from '../src/parts/DiffDomType/DiffDomType.js'
import { text } from '../src/parts/VirtualDomHelpers/VirtualDomHelpers.js'

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
