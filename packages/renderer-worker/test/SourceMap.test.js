import * as SourceMap from '../src/parts/SourceMap/SourceMap.js'

test('getOriginalPosition - error - source map is null', () => {
  expect(() => SourceMap.getOriginalPosition(null, 0, 0)).toThrowError(
    new Error('Failed to get original sourcemap position: AssertionError: expected value to be of type object')
  )
})

test('getOriginalPosition - error - line is not of type number', () => {
  expect(() =>
    SourceMap.getOriginalPosition(
      {
        names: [],
        sources: [],
        mappings: '',
      },
      '0',
      0
    )
  ).toThrowError(new Error('Failed to get original sourcemap position: AssertionError: expected value to be of type number'))
})

test('getOriginalPosition - error - column is not of type number', () => {
  expect(() =>
    SourceMap.getOriginalPosition(
      {
        names: [],
        sources: [],
        mappings: '',
      },
      0,
      '0'
    )
  ).toThrowError(new Error('Failed to get original sourcemap position: AssertionError: expected value to be of type number'))
})

test.skip('getOriginalPosition', () => {
  const sourceMap = {
    sources: ['../src/parts/Test/Test.js'],
    mappings: ';;;AAEO;',
    names: [],
  }
  const line = 3
  const column = 3
  expect(SourceMap.getOriginalPosition(sourceMap, line, column)).toEqual({
    originalLine: 0,
    originalColumn: 0,
    source: '../src/parts/Test/Test.js',
  })
})

test('getOriginalPosition - multiple positions', () => {
  const sourceMap = {
    version: 3,
    sources: ['../src/add.ts', '../src/index.ts'],
    mappings: ';;;AAAO,MAAM,MAAM,CAAC,GAAG,MAAM;AAC3B,WAAO,IAAI;AAAA,EACb;;;ACAA,MAAI,GAAG,CAAC;',
    names: [],
  }
  expect(SourceMap.getOriginalPosition(sourceMap, 4, 0)).toEqual({
    originalLine: 1,
    originalColumn: 7,
    source: '../src/add.ts',
  })
  expect(SourceMap.getOriginalPosition(sourceMap, 4, 6)).toEqual({
    originalLine: 1,
    originalColumn: 13,
    source: '../src/add.ts',
  })
  expect(SourceMap.getOriginalPosition(sourceMap, 4, 12)).toEqual({
    originalLine: 1,
    originalColumn: 19,
    source: '../src/add.ts',
  })
  expect(SourceMap.getOriginalPosition(sourceMap, 4, 13)).toEqual({
    originalLine: 1,
    originalColumn: 20,
    source: '../src/add.ts',
  })
  expect(SourceMap.getOriginalPosition(sourceMap, 4, 16)).toEqual({
    originalLine: 1,
    originalColumn: 23,
    source: '../src/add.ts',
  })
  expect(SourceMap.getOriginalPosition(sourceMap, 4, 22)).toEqual({
    originalLine: 1,
    originalColumn: 29,
    source: '../src/add.ts',
  })
  expect(SourceMap.getOriginalPosition(sourceMap, 5, 0)).toEqual({
    originalLine: 2,
    originalColumn: 2,
    source: '../src/add.ts',
  })
  expect(SourceMap.getOriginalPosition(sourceMap, 5, 11)).toEqual({
    originalLine: 2,
    originalColumn: 9,
    source: '../src/add.ts',
  })
  expect(SourceMap.getOriginalPosition(sourceMap, 5, 15)).toEqual({
    originalLine: 2,
    originalColumn: 13,
    source: '../src/add.ts',
  })
  expect(SourceMap.getOriginalPosition(sourceMap, 6, 0)).toEqual({
    originalLine: 2,
    originalColumn: 13,
    source: '../src/add.ts',
  })
  expect(SourceMap.getOriginalPosition(sourceMap, 6, 2)).toEqual({
    originalLine: 3,
    originalColumn: 0,
    source: '../src/add.ts',
  })
  expect(SourceMap.getOriginalPosition(sourceMap, 9, 0)).toEqual({
    originalLine: 3,
    originalColumn: 0,
    source: '../src/index.ts',
  })
  expect(SourceMap.getOriginalPosition(sourceMap, 9, 6)).toEqual({
    originalLine: 3,
    originalColumn: 4,
    source: '../src/index.ts',
  })
  expect(SourceMap.getOriginalPosition(sourceMap, 9, 9)).toEqual({
    originalLine: 3,
    originalColumn: 7,
    source: '../src/index.ts',
  })
  expect(SourceMap.getOriginalPosition(sourceMap, 9, 10)).toEqual({
    originalLine: 3,
    originalColumn: 8,
    source: '../src/index.ts',
  })
})
