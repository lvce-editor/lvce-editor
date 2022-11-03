import * as TerminalDataParser from '../src/parts/TerminalDataParser/TerminalDataParser.js'

const createBuffer = (text) => {
  return new TextEncoder().encode(text)
}

test('getText - empty', () => {
  const buffer = createBuffer('')
  const text = TerminalDataParser.getText(buffer)
  expect(text).toBe('')
})

test('getText - single character', () => {
  const buffer = createBuffer('A')
  const text = TerminalDataParser.getText(buffer)
  expect(text).toBe('A')
})

test('getText - multiple characters', () => {
  const buffer = createBuffer('ABC')
  const text = TerminalDataParser.getText(buffer)
  expect(text).toBe('ABC')
})

test('getText - colored text', () => {
  const buffer = createBuffer(`\x1B[0;35mtest`)
  const text = TerminalDataParser.getText(buffer)
  expect(text).toBe('test')
})

test.only('getText - colored text', () => {
  const buffer = createBuffer(
    `\x1B[?2004h\x1B[0;test\x1B[0;32m\x1B[0;34m test $ \x1B[0m`
  )
  const text = TerminalDataParser.getText(buffer)
  expect(text).toBe('test')
})
