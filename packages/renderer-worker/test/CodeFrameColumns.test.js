// based on https://github.com/babel/babel/blob/6be6e04f396f03feace4431f709564a8d842163a/packages/babel-code-frame/test/index.js (License MIT)

import * as CodeFrameColumns from '../src/parts/CodeFrameColumns/CodeFrameColumns.js'

test('basic usage', () => {
  const rawLines = ['class Foo {', '  constructor()', '};'].join('\n')
  expect(
    CodeFrameColumns.create(rawLines, {
      start: {
        line: 2,
        column: 16,
      },
    })
  ).toEqual(
    [
      '  1 | class Foo {',
      '> 2 |   constructor()',
      '    |                ^',
      '  3 | };',
    ].join('\n')
  )
})

test('maximum context lines and padding', () => {
  const rawLines = [
    '/**',
    ' * Sums two numbers.',
    ' *',
    ' * @param a Number',
    ' * @param b Number',
    ' * @returns Number',
    ' */',
    '',
    'function sum(a, b) {',
    '  return a + b',
    '}',
  ].join('\n')
  expect(
    CodeFrameColumns.create(rawLines, {
      start: {
        line: 7,
        column: 2,
      },
    })
  ).toEqual(
    [
      '   5 |  * @param b Number',
      '   6 |  * @returns Number',
      '>  7 |  */',
      '     |  ^',
      '   8 |',
      '   9 | function sum(a, b) {',
      '  10 |   return a + b',
    ].join('\n')
  )
})

test('no unnecessary padding due to one-off errors', () => {
  const rawLines = [
    '/**',
    ' * Sums two numbers.',
    ' *',
    ' * @param a Number',
    ' * @param b Number',
    ' * @returns Number',
    ' */',
    '',
    'function sum(a, b) {',
    '  return a + b',
    '}',
  ].join('\n')
  expect(
    CodeFrameColumns.create(rawLines, {
      start: {
        line: 6,
        column: 2,
      },
    })
  ).toEqual(
    [
      '  4 |  * @param a Number',
      '  5 |  * @param b Number',
      '> 6 |  * @returns Number',
      '    |  ^',
      '  7 |  */',
      '  8 |',
      '  9 | function sum(a, b) {',
    ].join('\n')
  )
})

test('tabs', () => {
  const rawLines = [
    '\tclass Foo {',
    '\t  \t\t    constructor\t(\t)',
    '\t};',
  ].join('\n')
  expect(
    CodeFrameColumns.create(rawLines, {
      start: { line: 2, column: 25 },
    })
  ).toEqual(
    [
      '  1 | \tclass Foo {',
      '> 2 | \t  \t\t    constructor\t(\t)',
      '    | \t  \t\t               \t \t ^',
      '  3 | \t};',
    ].join('\n')
  )
})

test('opts.linesAbove', () => {
  const rawLines = [
    '/**',
    ' * Sums two numbers.',
    ' *',
    ' * @param a Number',
    ' * @param b Number',
    ' * @returns Number',
    ' */',
    '',
    'function sum(a, b) {',
    '  return a + b',
    '}',
  ].join('\n')
  expect(
    CodeFrameColumns.create(
      rawLines,
      {
        start: { line: 7, column: 2 },
      },
      { linesAbove: 1 }
    )
  ).toEqual(
    [
      '   6 |  * @returns Number',
      '>  7 |  */',
      '     |  ^',
      '   8 |',
      '   9 | function sum(a, b) {',
      '  10 |   return a + b',
    ].join('\n')
  )
})

test('opts.linesBelow', () => {
  const rawLines = [
    '/**',
    ' * Sums two numbers.',
    ' *',
    ' * @param a Number',
    ' * @param b Number',
    ' * @returns Number',
    ' */',
    '',
    'function sum(a, b) {',
    '  return a + b',
    '}',
  ].join('\n')
  expect(
    CodeFrameColumns.create(
      rawLines,
      {
        start: {
          line: 7,
          column: 2,
        },
      },
      { linesBelow: 1 }
    )
  ).toEqual(
    [
      '  5 |  * @param b Number',
      '  6 |  * @returns Number',
      '> 7 |  */',
      '    |  ^',
      '  8 |',
    ].join('\n')
  )
})

test('opts.linesAbove and opts.linesBelow', () => {
  const rawLines = [
    '/**',
    ' * Sums two numbers.',
    ' *',
    ' * @param a Number',
    ' * @param b Number',
    ' * @returns Number',
    ' */',
    '',
    'function sum(a, b) {',
    '  return a + b',
    '}',
  ].join('\n')
  expect(
    CodeFrameColumns.create(
      rawLines,
      { start: { line: 7, column: 2 } },
      { linesAbove: 1, linesBelow: 1 }
    )
  ).toEqual(
    ['  6 |  * @returns Number', '> 7 |  */', '    |  ^', '  8 |'].join('\n')
  )
})

test('opts.linesAbove no lines above', () => {
  const rawLines = [
    'class Foo {',
    '  constructor() {',
    '    console.log(arguments);',
    '  }',
    '};',
  ].join('\n')
  expect(
    CodeFrameColumns.create(rawLines, { start: { line: 2 } }, { linesAbove: 0 })
  ).toEqual(
    [
      '> 2 |   constructor() {',
      '  3 |     console.log(arguments);',
      '  4 |   }',
      '  5 | };',
    ].join('\n')
  )
})

test('opts.linesBelow no lines below', () => {
  const rawLines = [
    'class Foo {',
    '  constructor() {',
    '    console.log(arguments);',
    '  }',
    '};',
  ].join('\n')
  expect(
    CodeFrameColumns.create(rawLines, { start: { line: 2 } }, { linesBelow: 0 })
  ).toEqual(['  1 | class Foo {', '> 2 |   constructor() {'].join('\n'))
})

test('opts.linesBelow single line', () => {
  const rawLines = [
    'class Foo {',
    '  constructor() {',
    '    console.log(arguments);',
    '  }',
    '};',
  ].join('\n')
  expect(
    CodeFrameColumns.create(
      rawLines,
      { start: { line: 2 } },
      { linesAbove: 0, linesBelow: 0 }
    )
  ).toEqual(['> 2 |   constructor() {'].join('\n'))
})

test('basic usage, new API', () => {
  const rawLines = ['class Foo {', '  constructor()', '};'].join('\n')
  expect(
    CodeFrameColumns.create(rawLines, { start: { line: 2, column: 16 } })
  ).toEqual(
    [
      '  1 | class Foo {',
      '> 2 |   constructor()',
      '    |                ^',
      '  3 | };',
    ].join('\n')
  )
})

test('mark multiple columns', () => {
  const rawLines = ['class Foo {', '  constructor()', '};'].join('\n')
  expect(
    CodeFrameColumns.create(rawLines, {
      start: { line: 2, column: 3 },
      end: { line: 2, column: 16 },
    })
  ).toEqual(
    [
      '  1 | class Foo {',
      '> 2 |   constructor()',
      '    |   ^^^^^^^^^^^^^',
      '  3 | };',
    ].join('\n')
  )
})

test('mark multiple columns across lines', () => {
  const rawLines = ['class Foo {', '  constructor() {', '  }', '};'].join('\n')
  expect(
    CodeFrameColumns.create(rawLines, {
      start: { line: 2, column: 17 },
      end: { line: 3, column: 3 },
    })
  ).toEqual(
    [
      '  1 | class Foo {',
      '> 2 |   constructor() {',
      '    |                 ^',
      '> 3 |   }',
      '    | ^^^',
      '  4 | };',
    ].join('\n')
  )
})

test('mark multiple columns across multiple lines', () => {
  const rawLines = [
    'class Foo {',
    '  constructor() {',
    '    console.log(arguments);',
    '  }',
    '};',
  ].join('\n')
  expect(
    CodeFrameColumns.create(rawLines, {
      start: { line: 2, column: 17 },
      end: { line: 4, column: 3 },
    })
  ).toEqual(
    [
      '  1 | class Foo {',
      '> 2 |   constructor() {',
      '    |                 ^',
      '> 3 |     console.log(arguments);',
      '    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^',
      '> 4 |   }',
      '    | ^^^',
      '  5 | };',
    ].join('\n')
  )
})

test('mark across multiple lines without columns', () => {
  const rawLines = [
    'class Foo {',
    '  constructor() {',
    '    console.log(arguments);',
    '  }',
    '};',
  ].join('\n')
  expect(
    CodeFrameColumns.create(rawLines, { start: { line: 2 }, end: { line: 4 } })
  ).toEqual(
    [
      '  1 | class Foo {',
      '> 2 |   constructor() {',
      '> 3 |     console.log(arguments);',
      '> 4 |   }',
      '  5 | };',
    ].join('\n')
  )
})

test('opts.message', () => {
  const rawLines = ['class Foo {', '  constructor()', '};'].join('\n')
  expect(
    CodeFrameColumns.create(
      rawLines,
      { start: { line: 2, column: 16 } },
      {
        message: 'Missing {',
      }
    )
  ).toEqual(
    [
      '  1 | class Foo {',
      '> 2 |   constructor()',
      '    |                ^ Missing {',
      '  3 | };',
    ].join('\n')
  )
})

test('opts.message without column', () => {
  const rawLines = ['class Foo {', '  constructor()', '};'].join('\n')
  expect(
    CodeFrameColumns.create(
      rawLines,
      { start: { line: 2 } },
      {
        message: 'Missing {',
      }
    )
  ).toEqual(
    [
      '  Missing {',
      '  1 | class Foo {',
      '> 2 |   constructor()',
      '  3 | };',
    ].join('\n')
  )
})

test('opts.message with multiple lines', () => {
  const rawLines = [
    'class Foo {',
    '  constructor() {',
    '    console.log(arguments);',
    '  }',
    '};',
  ].join('\n')
  expect(
    CodeFrameColumns.create(
      rawLines,
      {
        start: { line: 2, column: 17 },
        end: { line: 4, column: 3 },
      },
      {
        message: 'something about the constructor body',
      }
    )
  ).toEqual(
    [
      '  1 | class Foo {',
      '> 2 |   constructor() {',
      '    |                 ^',
      '> 3 |     console.log(arguments);',
      '    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^',
      '> 4 |   }',
      '    | ^^^ something about the constructor body',
      '  5 | };',
    ].join('\n')
  )
})

test('opts.message with multiple lines without columns', () => {
  const rawLines = [
    'class Foo {',
    '  constructor() {',
    '    console.log(arguments);',
    '  }',
    '};',
  ].join('\n')
  expect(
    CodeFrameColumns.create(
      rawLines,
      { start: { line: 2 }, end: { line: 4 } },
      {
        message: 'something about the constructor body',
      }
    )
  ).toEqual(
    [
      '  something about the constructor body',
      '  1 | class Foo {',
      '> 2 |   constructor() {',
      '> 3 |     console.log(arguments);',
      '> 4 |   }',
      '  5 | };',
    ].join('\n')
  )
})
