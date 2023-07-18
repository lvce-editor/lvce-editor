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
  expect(ParseHtml.parseHtml('<p><img alt="demo" src="./demo.png"></p>')).toEqual([
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
