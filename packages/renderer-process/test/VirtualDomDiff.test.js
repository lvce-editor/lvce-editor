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

test('renderDiff - remove a text node', () => {
  const oldHtml = `a`
  const diff = [
    {
      type: 'remove',
      nodes: [0],
    },
  ]
  const $Element = document.createElement('div')
  $Element.innerHTML = oldHtml
  VirtualDomDiff.renderDiff($Element, diff)
  expect($Element.innerHTML).toBe(``)
})

test('renderDiff - sub node attribute modified', () => {
  const oldHtml = `<div class="List"><div class="ListItems"></div><div class="ScrollBar"><div class="ScrollBarThumb"></div></div>`
  const diff = [
    {
      type: 'updateProp',
      index: 3,
      key: 'height',
      value: 20,
    },
  ]
  const $Element = document.createElement('div')
  $Element.innerHTML = oldHtml
  VirtualDomDiff.renderDiff($Element, diff)
  expect($Element.innerHTML).toBe(
    '<div class="List"><div class="ListItems"></div><div class="ScrollBar"><div class="ScrollBarThumb" style="height: 20px;"></div></div></div>',
  )
})

test('renderDiff - sub node removed at end', () => {
  const oldHtml = `<div class="List"><div class="ListItems"></div><div class="ScrollBar"><div class="ScrollBarThumb"></div></div>`
  const diff = [
    {
      type: 'remove',
      nodes: [2],
    },
  ]
  const $Element = document.createElement('div')
  $Element.innerHTML = oldHtml
  VirtualDomDiff.renderDiff($Element, diff)
  expect($Element.innerHTML).toBe('<div class="List"><div class="ListItems"></div></div>')
})

test('renderDiff - sub node removed at start', () => {
  const oldHtml = `<div class="List"><div class="ScrollBar"><div class="ScrollBarThumb"></div><div class="ListItems"></div></div>`
  const diff = [
    {
      index: 1,
      key: 'className',
      type: 'updateProp',
      value: 'ListItems',
    },
    {
      type: 'remove',
      nodes: [2],
    },
    {
      type: 'remove',
      nodes: [3],
    },
  ]
  const $Element = document.createElement('div')
  $Element.innerHTML = oldHtml
  VirtualDomDiff.renderDiff($Element, diff)
  expect($Element.innerHTML).toBe('<div class="List"><div class="ListItems"></div></div>')
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

test('renderDiff - remove and add nodes', () => {
  const oldHtml = `<div class="a"><i class="b"></i></div><div class="a"></div>`
  const diff = [
    {
      type: 'remove',
      nodes: [1],
    },
    {
      index: 2,
      nodes: [
        {
          type: VirtualDomElements.I,
          className: 'b',
          childCount: 0,
        },
      ],
      type: 'insert',
    },
  ]
  const $Element = document.createElement('div')
  $Element.innerHTML = oldHtml
  VirtualDomDiff.renderDiff($Element, diff)
  expect($Element.innerHTML).toBe('<div class="a"></div><div class="a"><i class="b"></i></div>')
})
