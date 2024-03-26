import * as ParseHtml from '../src/parts/ParseHtml/ParseHtml.js'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.js'
import { text } from '../src/parts/VirtualDomHelpers/VirtualDomHelpers.js'

test('text', () => {
  const html = 'Hello World'
  const allowedAttributes = []
  expect(ParseHtml.parseHtml(html, allowedAttributes)).toEqual([text('Hello World')])
})

test('heading', () => {
  const html = '<h1>Hello World</h1>'
  const allowedAttributes = []
  expect(ParseHtml.parseHtml(html, allowedAttributes)).toEqual([
    {
      type: VirtualDomElements.H1,
      childCount: 1,
    },
    text('Hello World'),
  ])
})

test('element with id', () => {
  const html = '<h1 id="hello-world"></h1>'
  const allowedAttributes = ['id']
  expect(ParseHtml.parseHtml(html, allowedAttributes)).toEqual([
    {
      type: VirtualDomElements.H1,
      childCount: 0,
      id: 'hello-world',
    },
  ])
})

test('element with with image', () => {
  const html = '<p><img alt="demo" src="./demo.png"></p>'
  const allowedAttributes = ['alt', 'src']
  expect(ParseHtml.parseHtml(html, allowedAttributes)).toEqual([
    {
      type: VirtualDomElements.P,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Img,
      childCount: 0,
      alt: 'demo',
      src: './demo.png',
    },
  ])
})

test('element with with image and sibling tag', () => {
  const html = '<p><img alt="demo" src="./demo.png"></p><p>more text</p>'
  const allowedAttributes = ['alt', 'src']
  expect(ParseHtml.parseHtml(html, allowedAttributes)).toEqual([
    {
      type: VirtualDomElements.P,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Img,
      childCount: 0,
      alt: 'demo',
      src: './demo.png',
    },
    {
      type: VirtualDomElements.P,
      childCount: 1,
    },
    text('more text'),
  ])
})

test('element with two child elements', () => {
  const html = '<div><div></div><div></div></div>'
  const allowedAttributes = []
  expect(ParseHtml.parseHtml(html, allowedAttributes)).toEqual([
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
  ])
})

test('deeply nested tags', () => {
  const html = '<div><div><div></div></div><div></div></div>'
  const allowedAttributes = []
  expect(ParseHtml.parseHtml(html, allowedAttributes)).toEqual([
    {
      type: VirtualDomElements.Div,
      childCount: 2,
    },
    {
      type: VirtualDomElements.Div,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      childCount: 0,
    },
  ])
})

test('element with disallowed attribute', () => {
  const html = '<h1 onerror="alert(1)"></h1>'
  const allowedAttributes = []
  expect(ParseHtml.parseHtml(html, allowedAttributes)).toEqual([
    {
      type: VirtualDomElements.H1,
      childCount: 0,
    },
  ])
})

test('nested element with id', () => {
  const html = '<p>some text<a href="#">link</a></p>'
  const allowedAttributes = ['href']
  expect(ParseHtml.parseHtml(html, allowedAttributes)).toEqual([
    {
      type: VirtualDomElements.P,
      childCount: 2,
    },
    text('some text'),
    {
      type: VirtualDomElements.A,
      childCount: 1,
      href: '#',
    },
    text('link'),
  ])
})

test('element with class', () => {
  const html = '<div class="EditorRow"></div>'
  const allowedAttributes = ['className']
  expect(ParseHtml.parseHtml(html, allowedAttributes)).toEqual([
    {
      type: VirtualDomElements.Div,
      childCount: 0,
      className: 'EditorRow',
    },
  ])
})

test('text with angle bracket', () => {
  const html = '<div>&gt;</div>'
  const allowedAttributes = []
  expect(ParseHtml.parseHtml(html, allowedAttributes)).toEqual([
    {
      type: VirtualDomElements.Div,
      childCount: 1,
    },
    text('>'),
  ])
})
