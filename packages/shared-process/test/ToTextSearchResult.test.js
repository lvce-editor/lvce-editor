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
  expect(ToTextSearchResult.toTextSearchResult(parsedLine)).toEqual([
    { end: 8, lineNumber: 220, start: 5, text: 'ApplicationsFound=A k�vetkez� alkalmaz�sok olyan f�jlokat ', type: 2 },
  ])
})

test('toTextSearchResult - match with text', () => {
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
  expect(ToTextSearchResult.toTextSearchResult(parsedLine)).toEqual([
    { end: 23, lineNumber: 151, start: 20, text: 'elect Destination Location" wizard page\n', type: 2 },
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
  expect(() => ToTextSearchResult.toTextSearchResult(parsedLine)).toThrowError(new Error('unable to parse line data'))
})
