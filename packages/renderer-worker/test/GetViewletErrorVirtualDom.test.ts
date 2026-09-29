import { expect, test } from '@jest/globals'
import { getViewletErrorVirtualDom } from '../src/parts/GetViewletErrorVirtualDom/GetViewletErrorVirtualDom.js'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.js'

test('getViewletErrorVirtualDom', () => {
  const syntaxHighlightedCodeFrame = [
    {
      childCount: 1,
      className: 'SyntaxHighlightedCodeFrame',
      type: VirtualDomElements.Pre,
    },
    {
      childCount: 0,
      text: 'const value = 1',
      type: VirtualDomElements.Text,
    },
  ]

  expect(
    getViewletErrorVirtualDom({
      message: 'Oops',
      stack: `TypeError: Oops
    at test.js:1:1`,
      syntaxHighlightedCodeFrame,
      type: 'TypeError',
    }),
  ).toEqual([
    {
      childCount: 3,
      className: 'Viewlet Error',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'ViewletErrorMessage',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      text: 'TypeError: Oops',
      type: VirtualDomElements.Text,
    },
    ...syntaxHighlightedCodeFrame,
    {
      childCount: 1,
      className: 'ViewletErrorStack',
      type: VirtualDomElements.Pre,
    },
    {
      childCount: 0,
      text: '    at test.js:1:1',
      type: VirtualDomElements.Text,
    },
  ])
})
