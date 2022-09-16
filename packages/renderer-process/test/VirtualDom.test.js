/**
 * @jest-environment jsdom
 */
import * as VirtualDom from '../src/parts/VirtualDom/VirtualDom.js'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.js'

test('render - single tag', () => {
  const dom = VirtualDom.render([
    {
      type: VirtualDomElements.H1,
      props: {},
      childCount: 0,
    },
  ])
  expect(dom.innerHTML).toBe('<h1></h1>')
})

test('render - single text node', () => {
  const dom = VirtualDom.render([
    {
      type: VirtualDomElements.Text,
      props: {
        text: 'test',
      },
      childCount: 0,
    },
  ])
  expect(dom.innerHTML).toBe('test')
})

test('render - multiple element nodes', () => {
  const dom = VirtualDom.render([
    {
      type: VirtualDomElements.Table,
      props: {},
      childCount: 2,
    },
    {
      type: VirtualDomElements.THead,
      props: {},
      childCount: 0,
    },
    {
      type: VirtualDomElements.TBody,
      props: {},
      childCount: 0,
    },
  ])
  expect(dom.innerHTML).toBe('<table><thead></thead><tbody></tbody></table>')
})

test('render - nesting level 2', () => {
  const dom = VirtualDom.render([
    {
      type: VirtualDomElements.Div,
      props: {},
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      props: {},
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      props: {},
      childCount: 0,
    },
  ])
  expect(dom.innerHTML).toBe('<div><div><div></div></div></div>')
})

test('render - nesting level 3', () => {
  const dom = VirtualDom.render([
    {
      type: VirtualDomElements.Div,
      props: {},
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      props: {},
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      props: {},
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      props: {},
      childCount: 0,
    },
  ])
  expect(dom.innerHTML).toBe('<div><div><div><div></div></div></div></div>')
})

test('render - nesting level 4', () => {
  const dom = VirtualDom.render([
    {
      type: VirtualDomElements.Div,
      props: {},
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      props: {},
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      props: {},
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      props: {},
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      props: {},
      childCount: 0,
    },
  ])
  expect(dom.innerHTML).toBe(
    '<div><div><div><div><div></div></div></div></div></div>'
  )
})

test('render - nesting level 5', () => {
  const dom = VirtualDom.render([
    {
      type: VirtualDomElements.Div,
      props: {},
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      props: {},
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      props: {},
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      props: {},
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      props: {},
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      props: {},
      childCount: 0,
    },
  ])
  expect(dom.innerHTML).toBe(
    '<div><div><div><div><div><div></div></div></div></div></div></div>'
  )
})

test('render - trailing text node', () => {
  const dom = VirtualDom.render([
    {
      type: VirtualDomElements.Div,
      props: {},
      childCount: 2,
    },
    {
      type: VirtualDomElements.Div,
      props: {},
      childCount: 1,
    },
    {
      type: VirtualDomElements.Text,
      props: {
        text: 'abc',
      },
      childCount: 0,
    },
    {
      type: VirtualDomElements.Text,
      props: {
        text: 'def',
      },
      childCount: 0,
    },
  ])
  expect(dom.innerHTML).toBe('<div><div>abc</div>def</div>')
})

test('render - element with element children and text children', () => {
  const dom = VirtualDom.render([
    {
      type: VirtualDomElements.Td,
      props: {},
      childCount: 3,
    },
    {
      type: VirtualDomElements.Kbd,
      props: {},
      childCount: 1,
    },
    {
      type: VirtualDomElements.Text,
      props: {
        text: 'Ctrl',
      },
      childCount: 0,
    },
    {
      type: VirtualDomElements.Text,
      props: {
        text: '+',
      },
      childCount: 0,
    },
    {
      type: VirtualDomElements.Kbd,
      props: {},
      childCount: 1,
    },
    {
      type: VirtualDomElements.Text,
      props: {
        text: 'P',
      },
      childCount: 0,
    },
  ])
  expect(dom.innerHTML).toBe('<td><kbd>Ctrl</kbd>+<kbd>P</kbd></td>')
})
