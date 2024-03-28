/**
 * @jest-environment jsdom
 */
import * as VirtualDom from '../src/parts/VirtualDom/VirtualDom.js'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.js'
import { beforeEach, test, expect } from '@jest/globals'

test('render - single tag', () => {
  const dom = VirtualDom.render([
    {
      type: VirtualDomElements.H1,
      childCount: 0,
    },
  ])
  expect(dom.innerHTML).toBe('<h1></h1>')
})

test('render - single text node', () => {
  const dom = VirtualDom.render([
    {
      type: VirtualDomElements.Text,
      text: 'test',
      childCount: 0,
    },
  ])
  expect(dom.innerHTML).toBe('test')
})

test('render - multiple element nodes', () => {
  const dom = VirtualDom.render([
    {
      type: VirtualDomElements.Table,
      childCount: 2,
    },
    {
      type: VirtualDomElements.THead,
      childCount: 0,
    },
    {
      type: VirtualDomElements.TBody,
      childCount: 0,
    },
  ])
  expect(dom.innerHTML).toBe('<table><thead></thead><tbody></tbody></table>')
})

test('render - nesting level 2', () => {
  const dom = VirtualDom.render([
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
  ])
  expect(dom.innerHTML).toBe('<div><div><div></div></div></div>')
})

test('render - nesting level 3', () => {
  const dom = VirtualDom.render([
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
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      childCount: 0,
    },
  ])
  expect(dom.innerHTML).toBe('<div><div><div><div></div></div></div></div>')
})

test('render - nesting level 4', () => {
  const dom = VirtualDom.render([
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
  ])
  expect(dom.innerHTML).toBe('<div><div><div><div><div></div></div></div></div></div>')
})

test('render - nesting level 5', () => {
  const dom = VirtualDom.render([
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
      childCount: 1,
    },
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
  ])
  expect(dom.innerHTML).toBe('<div><div><div><div><div><div></div></div></div></div></div></div>')
})

test('render - trailing text node', () => {
  const dom = VirtualDom.render([
    {
      type: VirtualDomElements.Div,
      childCount: 2,
    },
    {
      type: VirtualDomElements.Div,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Text,
      text: 'abc',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Text,
      text: 'def',
      childCount: 0,
    },
  ])
  expect(dom.innerHTML).toBe('<div><div>abc</div>def</div>')
})

test('render - element with element children and text children', () => {
  const dom = VirtualDom.render([
    {
      type: VirtualDomElements.Td,
      childCount: 3,
    },
    {
      type: VirtualDomElements.Kbd,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Text,
      text: 'Ctrl',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Text,
      text: '+',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Kbd,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Text,
      text: 'P',
      childCount: 0,
    },
  ])
  expect(dom.innerHTML).toBe('<td><kbd>Ctrl</kbd>+<kbd>P</kbd></td>')
})

test('renderInto - update title', () => {
  const dom = VirtualDom.render([
    {
      type: VirtualDomElements.Button,
      title: 'a',
      childCount: 0,
    },
  ])
  expect(dom.innerHTML).toBe('<button title="a"></button>')
  VirtualDom.renderInto(dom, [
    {
      type: VirtualDomElements.Button,
      title: 'b',
      childCount: 0,
    },
  ])
  expect(dom.innerHTML).toBe('<button title="b"></button>')
})

test('renderInto - update text node', () => {
  const dom = VirtualDom.render([
    {
      type: VirtualDomElements.Text,
      text: 'a',
      childCount: 0,
    },
  ])
  expect(dom.innerHTML).toBe('a')
  VirtualDom.renderInto(dom, [
    {
      type: VirtualDomElements.Text,
      text: 'b',
      childCount: 0,
    },
  ])
  expect(dom.innerHTML).toBe('b')
})
