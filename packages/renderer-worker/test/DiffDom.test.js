import * as DiffDom from '../src/parts/DiffDom/DiffDom.js'
import { h, text } from '../src/parts/VirtualDomHelpers/VirtualDomHelpers.js'

test.skip('diffDom - empty', () => {
  expect(DiffDom.diffDom([], [])).toEqual([])
})

test.skip('diffDom - add a text node', () => {
  expect(DiffDom.diffDom([], [text('hello world')])).toEqual([
    {
      type: 'add',
      nodes: [text('hello world')],
    },
  ])
})
