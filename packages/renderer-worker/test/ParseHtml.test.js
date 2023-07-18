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
