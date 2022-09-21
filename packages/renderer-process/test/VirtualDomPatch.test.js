/**
 * @jest-environment jsdom
 */
import * as VirtualDomPatch from '../src/parts/VirtualDomPatch/VirtualDomPatch.js'
import * as VirtualDomDiffType from '../src/parts/VirtualDomDiffType/VirtualDomDiffType.js'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.js'

test('patch - add one element', () => {
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
  const $Root = document.createElement('div')
  VirtualDomPatch.patch($Root, patches)
  expect($Root.innerHTML).toBe(`<div></div>`)
})

test('patch - add one element with child', () => {
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
  const $Root = document.createElement('div')
  VirtualDomPatch.patch($Root, patches)
  expect($Root.innerHTML).toBe(`<div>hello world</div>`)
})

test('patch - add two elements', () => {
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
  const $Root = document.createElement('div')
  VirtualDomPatch.patch($Root, patches)
  expect($Root.innerHTML).toBe(`<div></div><div></div>`)
})
