/**
 * @jest-environment jsdom
 */
import * as VirtualDomDiff from '../src/parts/VirtualDomDiff/VirtualDomDiff.js'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.js'

test('renderDiff - update class name', () => {
  const oldHtml = `<div class="a"></div>`
  const diff = [
    {
      type: 'updateProp',
      key: 'className',
      value: 'b',
      index: 0,
    },
  ]
  const $Element = document.createElement('div')
  $Element.innerHTML = oldHtml
  VirtualDomDiff.renderDiff($Element, diff)
  expect($Element.innerHTML).toBe(`<div class="b"></div>`)
})

test.skip('renderDiff - insert node - start', () => {
  const oldHtml = `<div><div class="b"></div></div>`
  const diff = [
    {
      type: 'insert',
      nodes: [
        {
          type: VirtualDomElements.Div,
          className: 'a',
          childCount: 0,
        },
      ],
      index: 0,
    },
  ]
  const $Element = document.createElement('div')
  $Element.innerHTML = oldHtml
  VirtualDomDiff.renderDiff($Element, diff)
  expect($Element.innerHTML).toBe(`<div><div class="a"></div><div class="b"></div></div>`)
})

test.skip('renderDiff - insert node - middle', () => {
  const oldHtml = `<div><div class="a"></div><div class="c"></div></div>`
  const diff = [
    {
      type: 'insert',
      nodes: [
        {
          type: VirtualDomElements.Div,
          className: 'b',
          childCount: 0,
        },
      ],
      index: 1,
    },
  ]
  const $Element = document.createElement('div')
  $Element.innerHTML = oldHtml
  VirtualDomDiff.renderDiff($Element, diff)
  expect($Element.innerHTML).toBe(`<div><div class="a"></div><div class="b"></div><div class="c"></div></div>`)
})

test('renderDiff - insert node - end', () => {
  const oldHtml = `<div><div class="a"></div></div>`
  const diff = [
    {
      type: 'insert',
      nodes: [
        {
          type: VirtualDomElements.Div,
          className: 'b',
          childCount: 0,
        },
      ],
      index: 0,
    },
  ]
  const $Element = document.createElement('div')
  $Element.innerHTML = oldHtml
  VirtualDomDiff.renderDiff($Element, diff)
  expect($Element.innerHTML).toBe(`<div><div class="a"></div><div class="b"></div></div>`)
})

test.skip('renderDiff - toggle replace - collapse', () => {
  const oldHtml = ``
  const diff = []
  const $Element = document.createElement('div')
  $Element.innerHTML = oldHtml
  VirtualDomDiff.renderDiff($Element, diff)
  expect($Element.innerHTML).toBe(``)
})
