import { expect, test } from '@jest/globals'
import * as TextSearchResultType from '../src/parts/TextSearchResultType/TextSearchResultType.js'
import * as ToTextSearchResult from '../src/parts/ToTextSearchResult/ToTextSearchResult.js'

test('toTextSearchResult - match with bytes', () => {
  const parsedLine = {
    type: 'match',
    data: {
      path: {
        text: './build/win32/i18n/Default.hu.isl',
      },
      lines: {
        bytes:
          'QXBwbGljYXRpb25zRm91bmQ9QSBr9nZldGtlevUgYWxrYWxtYXrhc29rIG9seWFuIGbhamxva2F0IGhhc3pu4WxuYWssIGFtZWx5ZWtldCBhIFRlbGVw7XT1bmVrIGZyaXNz7XRlbmkga2VsbC4gQWrhbmxvdHQsIGhvZ3kgZW5nZWTpbHllenplIGEgVGVsZXDtdPVuZWsgZXplbiBhbGthbG1heuFzb2sgYXV0b21hdGlrdXMgYmV64XLhc+F0Lgo=',
      },
      line_number: 220,
      absolute_offset: 11384,
      submatches: [
        {
          match: {
            text: 'cat',
          },
          start: 5,
          end: 8,
        },
      ],
    },
  }
  const remaining = ''
  const charsBefore = 20
  const charsAfter = 50
  expect(ToTextSearchResult.toTextSearchResult(parsedLine, remaining, charsBefore, charsAfter)).toEqual([
    { end: 8, lineNumber: 220, start: 5, text: 'ApplicationsFound=A k�vetkez� alkalmaz�sok olyan f�jlokat ', type: 2 },
  ])
})

test.skip('toTextSearchResult - match with text', () => {
  const parsedLine = {
    type: 'match',
    data: {
      path: {
        text: './build/win32/i18n/Default.hu.isl',
      },
      lines: {
        text: '; *** "Select Destination Location" wizard page\n',
      },
      line_number: 151,
      absolute_offset: 6785,
      submatches: [
        {
          match: {
            text: 'cat',
          },
          start: 28,
          end: 31,
        },
      ],
    },
  }
  const remaining = ''
  const charsBefore = 20
  const charsAfter = 50
  expect(ToTextSearchResult.toTextSearchResult(parsedLine, remaining, charsBefore, charsAfter)).toEqual([
    {
      end: 24,
      lineNumber: 151,
      start: 21,
      text: 'Select Destination Location" wizard page\n',
      type: TextSearchResultType.Match,
    },
  ])
})

test('toTextSearchResult - match without text or bytes', () => {
  const parsedLine = {
    type: 'match',
    data: {
      path: {
        text: './build/win32/i18n/Default.hu.isl',
      },
      lines: {},
      line_number: 151,
      absolute_offset: 6785,
      submatches: [
        {
          match: {
            text: 'cat',
          },
          start: 28,
          end: 31,
        },
      ],
    },
  }
  const remaining = ''
  const charsBefore = 20
  const charsAfter = 50
  expect(() => ToTextSearchResult.toTextSearchResult(parsedLine, remaining, charsBefore, charsAfter)).toThrow(new Error('unable to parse line data'))
})

test.skip('toTextSearchResult - match in the middle', () => {
  const parsedLine = {
    type: 'match',
    data: {
      path: { text: './languages/index.py' },
      lines: { text: '# Program to display the Fibonacci sequence up to n-th term\\n' },
      line_number: 1,
      absolute_offset: 0,
      submatches: [{ match: { text: 'cc' }, start: 31, end: 33 }],
    },
  }
  const remaining = ''
  const charsBefore = 26
  const charsAfter = 50
  expect(ToTextSearchResult.toTextSearchResult(parsedLine, remaining, charsBefore, charsAfter)).toEqual([
    {
      end: 31,
      lineNumber: 1,
      start: 29,
      text: 'Program to display the Fibonacci sequence up to n-th term\\n',
      type: TextSearchResultType.Match,
    },
  ])
})

test('toTextSearchResult - match at the end', () => {
  const parsedLine = {
    type: 'match',
    data: {
      path: { text: './languages/a.txt' },
      lines: {
        text: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaacc',
      },
      line_number: 1,
      absolute_offset: 0,
      submatches: [{ match: { text: 'cc' }, start: 311, end: 313 }],
    },
  }
  const remaining = ''
  const charsBefore = 26
  const charsAfter = 50
  expect(ToTextSearchResult.toTextSearchResult(parsedLine, remaining, charsBefore, charsAfter)).toEqual([
    {
      end: 28,
      lineNumber: 1,
      start: 26,
      text: 'aaaaaaaaaaaaaaaaaaaaaaaaaacc',
      type: TextSearchResultType.Match,
    },
  ])
})

test('toTextSearchResult - short match', () => {
  const parsedLine = {
    type: 'match',
    data: {
      path: { text: './short.txt' },
      lines: { text: 'abccc' },
      line_number: 1,
      absolute_offset: 0,
      submatches: [{ match: { text: 'cc' }, start: 2, end: 4 }],
    },
  }
  const remaining = ''
  const charsBefore = 26
  const charsAfter = 50
  expect(ToTextSearchResult.toTextSearchResult(parsedLine, remaining, charsBefore, charsAfter)).toEqual([
    {
      end: 4,
      lineNumber: 1,
      start: 2,
      text: 'abccc',
      type: TextSearchResultType.Match,
    },
  ])
})
