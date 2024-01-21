import * as GetDomTree from '../src/parts/GetDomTree/GetDomTree.js'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.js'

test('empty', () => {
  const dom = []
  expect(GetDomTree.getDomTree(dom)).toEqual({
    type: 'root',
    children: [],
  })
})

test('single element', () => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      childCount: 0,
    },
  ]
  expect(GetDomTree.getDomTree(dom)).toEqual({
    type: 'root',
    children: [
      {
        type: VirtualDomElements.Div,
        childCount: 0,
      },
    ],
  })
})

test('two elements', () => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      childCount: 0,
    },
  ]
  expect(GetDomTree.getDomTree(dom)).toEqual({
    type: 'root',
    children: [
      {
        type: VirtualDomElements.Div,
        childCount: 0,
      },
      {
        type: VirtualDomElements.Div,
        childCount: 0,
      },
    ],
  })
})
