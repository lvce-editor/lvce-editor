import * as GetDomTree from '../src/parts/GetDomTree/GetDomTree.js'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

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
        children: [],
      },
    ],
  })
})

test.skip('two elements', () => {
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

test('one child element', () => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      childCount: 1,
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
        childCount: 1,
        children: [
          {
            type: VirtualDomElements.Div,
            childCount: 0,
            children: [],
          },
        ],
      },
    ],
  })
})

test('one child elements', () => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      childCount: 2,
    },
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
        childCount: 2,
        children: [
          {
            type: VirtualDomElements.Div,
            childCount: 0,
            children: [],
          },
          {
            type: VirtualDomElements.Div,
            childCount: 0,
            children: [],
          },
        ],
      },
    ],
  })
})

test('one grandchild element', () => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      childCount: 1,
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
        childCount: 1,
        children: [
          {
            type: VirtualDomElements.Div,
            childCount: 1,
            children: [
              {
                type: VirtualDomElements.Div,
                childCount: 0,
                children: [],
              },
            ],
          },
        ],
      },
    ],
  })
})

test('scrollable list', () => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: 'List',
      childCount: 2,
    },
    {
      type: VirtualDomElements.Div,
      className: 'ListItems',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: 'ScrollBar',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: 'ScrollBarThumb',
      childCount: 0,
    },
  ]
  expect(GetDomTree.getDomTree(dom)).toEqual({
    type: 'root',
    children: [
      {
        type: VirtualDomElements.Div,
        className: 'List',
        childCount: 2,
        children: [
          {
            type: VirtualDomElements.Div,
            className: 'ListItems',
            childCount: 0,
            children: [],
          },
          {
            type: VirtualDomElements.Div,
            className: 'ScrollBar',
            childCount: 1,
            children: [
              {
                type: VirtualDomElements.Div,
                className: 'ScrollBarThumb',
                childCount: 0,
                children: [],
              },
            ],
          },
        ],
      },
    ],
  })
})
