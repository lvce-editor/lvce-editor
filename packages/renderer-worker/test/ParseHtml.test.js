import * as ParseHtml from '../src/parts/ParseHtml/ParseHtml.js'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.js'
import { text } from '../src/parts/VirtualDomHelpers/VirtualDomHelpers.js'

test('text', () => {
  expect(ParseHtml.parseHtml('Hello World')).toEqual([text('Hello World')])
})

test('heading', () => {
  expect(ParseHtml.parseHtml('<h1>Hello World</h1>')).toEqual([
    {
      type: VirtualDomElements.H1,
      childCount: 1,
    },
    text('Hello World'),
  ])
})

test('element with id', () => {
  expect(ParseHtml.parseHtml('<h1 id="hello-world"></h1>')).toEqual([
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

test.skip('element with with image and sibling tag', () => {
  const html = '<p><img alt="demo" src="./demo.png"></p><p>more text</p>'
  expect(ParseHtml.parseHtml(html)).toEqual([
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

test.skip('deeply nested tags', () => {
  const html = `<div><div><div></div></div><div></div></div>`
  expect(ParseHtml.parseHtml(html)).toEqual([
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
