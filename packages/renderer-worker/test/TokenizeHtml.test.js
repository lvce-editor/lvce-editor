import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'
import * as HtmlTokenType from '../src/parts/HtmlTokenType/HtmlTokenType.js'
import * as TokenizeHtml from '../src/parts/TokenizeHtml/TokenizeHtml.js'

test('text', () => {
  expect(TokenizeHtml.tokenizeHtml('Hello World')).toEqual([
    {
      type: HtmlTokenType.Content,
      text: 'Hello World',
    },
  ])
})

test('heading', () => {
  expect(TokenizeHtml.tokenizeHtml('<h1>Hello World</h1>')).toEqual([
    {
      text: '<',
      type: HtmlTokenType.OpeningAngleBracket,
    },
    {
      text: 'h1',
      type: HtmlTokenType.TagNameStart,
    },
    {
      text: '>',
      type: HtmlTokenType.ClosingAngleBracket,
    },
    {
      text: 'Hello World',
      type: HtmlTokenType.Content,
    },
    {
      text: '<',
      type: HtmlTokenType.OpeningAngleBracket,
    },
    {
      text: '/',
      type: HtmlTokenType.ClosingTagSlash,
    },
    {
      text: 'h1',
      type: HtmlTokenType.TagNameEnd,
    },
    {
      text: '>',
      type: HtmlTokenType.ClosingAngleBracket,
    },
  ])
})
