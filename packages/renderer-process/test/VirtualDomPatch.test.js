/**
 * @jest-environment jsdom
 */
import * as VirtualDomPatch from '../src/parts/VirtualDomPatch/VirtualDomPatch.js'
import * as VirtualDomDiffType from '../src/parts/VirtualDomDiffType/VirtualDomDiffType.js'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.js'
import * as VirtualDom from '../src/parts/VirtualDom/VirtualDom.js'

test('patch - add one element', () => {
  const oldDom = []
  const patches = [
    {
      operation: VirtualDomDiffType.ElementsAdd,
      index: -1,
      newDom: [
        {
          type: VirtualDomElements.Div,
          props: {},
          childCount: 0,
        },
      ],
    },
  ]
  const $Root = VirtualDom.render(oldDom)
  VirtualDomPatch.patch($Root, patches)
  expect($Root.innerHTML).toBe(`<div></div>`)
})

test('patch - add one element with child', () => {
  const oldDom = []
  const patches = [
    {
      operation: VirtualDomDiffType.ElementsAdd,
      index: -1,
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
  ]
  const $Root = VirtualDom.render(oldDom)
  VirtualDomPatch.patch($Root, patches)
  expect($Root.innerHTML).toBe(`<div>hello world</div>`)
})

test('patch - add two elements', () => {
  const oldDom = []
  const patches = [
    {
      operation: VirtualDomDiffType.ElementsAdd,
      index: -1,
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
  ]
  const $Root = VirtualDom.render(oldDom)
  VirtualDomPatch.patch($Root, patches)
  expect($Root.innerHTML).toBe(`<div></div><div></div>`)
})

test('patch -  one attribute removed, one attribute added', () => {
  const oldDom = [
    {
      type: VirtualDomElements.Div,
      props: {
        id: 'QuickPickItemActive',
      },
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      props: {},
      childCount: 0,
    },
  ]
  const patches = [
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
  ]
  const $Root = VirtualDom.render(oldDom)
  VirtualDomPatch.patch($Root, patches)
  expect($Root.innerHTML).toBe(
    `<div></div><div id="QuickPickItemActive"></div>`
  )
})

test('diff - with children, one attribute removed, one attribute added', () => {
  const oldDom = [
    {
      type: VirtualDomElements.Div,
      props: {
        id: 'QuickPickItemActive',
        className: 'QuickPickItem',
      },
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      props: {
        className: 'QuickPickItemLabel',
      },
      childCount: 1,
    },
    {
      type: VirtualDomElements.Text,
      props: {
        text: '1',
      },
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      props: {
        className: 'QuickPickItem',
      },
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      props: {
        className: 'QuickPickItemLabel',
      },
      childCount: 1,
    },
    {
      type: VirtualDomElements.Text,
      props: {
        text: '2',
      },
      childCount: 0,
    },
  ]
  const patches = [
    {
      index: 0,
      key: 'id',
      operation: 2,
    },
    {
      index: 3,
      key: 'id',
      operation: 1,
      value: 'QuickPickItemActive',
    },
  ]
  const $Root = VirtualDom.render(oldDom)
  VirtualDomPatch.patch($Root, patches)
  expect($Root.innerHTML).toBe(
    '<div class="QuickPickItem"><div class="QuickPickItemLabel">1</div></div><div class="QuickPickItem" id="QuickPickItemActive"><div class="QuickPickItemLabel">2</div></div>'
  )
})
