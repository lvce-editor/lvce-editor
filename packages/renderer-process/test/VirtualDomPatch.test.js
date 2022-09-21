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
