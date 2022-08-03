import * as EditorDelta from '../src/parts/EditorCommandDelta/EditorCommandDelta.js'

test('characterLeft', () => {
  expect(EditorDelta.characterLeft('a', 1)).toBe(1)
})

test('characterRight', () => {
  expect(EditorDelta.characterRight('a', 0)).toBe(1)
})

test('lineCharacterStart - empty line', () => {
  expect(EditorDelta.lineCharacterStart('', 0)).toBe(0)
})

test('lineCharacterStart - not indented', () => {
  expect(EditorDelta.lineCharacterStart('a', 1)).toBe(1)
})

test('lineCharacterStart - indented with spaces', () => {
  expect(EditorDelta.lineCharacterStart('  a', 3)).toBe(1)
  expect(EditorDelta.lineCharacterStart('  a', 2)).toBe(2)
})

test('lineCharacterStart - indented with tabs', () => {
  expect(EditorDelta.lineCharacterStart('\ta', 2)).toBe(1)
  expect(EditorDelta.lineCharacterStart('\ta', 1)).toBe(1)
})

test('lineCharacterStart - indented with tabs and spaces', () => {
  expect(EditorDelta.lineCharacterStart('\t \ta', 4)).toBe(1)
  expect(EditorDelta.lineCharacterStart('\t \ta', 3)).toBe(3)
})

test('lineEnd', () => {
  expect(EditorDelta.lineEnd('a', 0)).toBe(1)
})

test.skip('wordLeft - html', () => {
  expect(EditorDelta.wordLeft('<title>Document</title>', 23)).toBe(6)
  expect(EditorDelta.wordLeft('<title>Document</title>', 17)).toBe(2)
  expect(EditorDelta.wordLeft('<title>Document</title>', 15)).toBe(8)
  expect(EditorDelta.wordLeft('<title>Document</title>', 7)).toBe(6)
  expect(EditorDelta.wordLeft('<title>Document</title>', 1)).toBe(1)
})

test('wordLeft - snake_case', () => {
  expect(EditorDelta.wordLeft('foo_bar', 7)).toBe(7)
})

test('wordLeft - umlaut', () => {
  expect(EditorDelta.wordLeft('füße', 4)).toBe(4)
})

test('wordLeft - accent', () => {
  expect(EditorDelta.wordLeft('tàste', 5)).toBe(5)
})

test('wordLeft - jump over whitespace', () => {
  expect(EditorDelta.wordLeft('A1323 ', 6)).toBe(6)
})

test.skip('wordLeft - jump over punctuation', () => {
  expect(EditorDelta.wordLeft('Aa|||----B', 10)).toBe(1)
  expect(EditorDelta.wordLeft('Aa|||----B', 9)).toBe(9)
})

test.skip('wordRight', () => {})

test('wordRight - snake_case', () => {
  expect(EditorDelta.wordRight('foo_bar', 0)).toBe(7)
})

test('wordRight - umlaut', () => {
  expect(EditorDelta.wordRight('füße', 0)).toBe(4)
})

test('wordRight - accent', () => {
  expect(EditorDelta.wordRight('tàste', 0)).toBe(5)
})

test('wordRight - jump over whitespace', () => {
  expect(EditorDelta.wordRight(' A1323', 0)).toBe(6)
})

test('wordRight - jump over punctuation', () => {
  expect(EditorDelta.wordRight('Aa|||----B', 0)).toBe(2)
  expect(EditorDelta.wordRight('Aa|||----B', 2)).toBe(8)
})

test('wordPartLeft - jump over whitespace', () => {
  expect(EditorDelta.wordPartLeft('A1323 ', 6)).toBe(6)
})

test('wordPartLeft - camelCase', () => {
  expect(EditorDelta.wordPartLeft('fooBar', 6)).toBe(3)
  expect(EditorDelta.wordPartLeft('fooBar', 3)).toBe(3)
})

test('wordPartLeft - snake_case', () => {
  expect(EditorDelta.wordPartLeft('foo_bar', 7)).toBe(3)
  expect(EditorDelta.wordPartLeft('foo_bar', 4)).toBe(4)
})

test('wordPartLeft - multiple capital letters', () => {
  expect(EditorDelta.wordPartLeft('X-UA-Compatible', 15)).toBe(10)
  expect(EditorDelta.wordPartLeft('X-UA-Compatible', 5)).toBe(1)
  expect(EditorDelta.wordPartLeft('X-UA-Compatible', 4)).toBe(2)
  expect(EditorDelta.wordPartLeft('X-UA-Compatible', 2)).toBe(1)
  expect(EditorDelta.wordPartLeft('X-UA-Compatible', 1)).toBe(1)
})

test('wordPartLeft - multiple underscores', () => {
  expect(EditorDelta.wordPartLeft('A__B', 4)).toBe(1)
  expect(EditorDelta.wordPartLeft('A__B', 3)).toBe(3)
})

test('wordPartLeft - uppercase word', () => {
  expect(EditorDelta.wordPartLeft('REMOTE_PREFIX', 13)).toBe(6)
  expect(EditorDelta.wordPartLeft('REMOTE_PREFIX', 7)).toBe(1)
  expect(EditorDelta.wordPartLeft('REMOTE_PREFIX', 6)).toBe(6)
})

test('wordPartLeft - mixed word', () => {
  expect(EditorDelta.wordPartLeft('DEBUGEntry', 10)).toBe(5)
  expect(EditorDelta.wordPartLeft('DEBUGEntry', 5)).toBe(5)
})

test('wordPartLeft - short mixed word', () => {
  expect(EditorDelta.wordPartLeft('DDa', 3)).toBe(3)
})

test('wordPartLeft - with quotes', () => {
  expect(EditorDelta.wordPartLeft('"command": "actions.find"', 25)).toBe(1)
  expect(EditorDelta.wordPartLeft('"command": "actions.find"', 24)).toBe(4)
  expect(EditorDelta.wordPartLeft('"command": "actions.find"', 20)).toBe(1)
  expect(EditorDelta.wordPartLeft('"command": "actions.find"', 19)).toBe(7)
  expect(EditorDelta.wordPartLeft('"command": "actions.find"', 12)).toBe(1)
  expect(EditorDelta.wordPartLeft('"command": "actions.find"', 11)).toBe(3)
  expect(EditorDelta.wordPartLeft('"command": "actions.find"', 8)).toBe(7)
  expect(EditorDelta.wordPartLeft('"command": "actions.find"', 1)).toBe(1)
})

test('wordPartLeft - punctuation and numbers', () => {
  expect(EditorDelta.wordPartLeft('1<[<[<[2)})})})3', 16)).toBe(1)
  expect(EditorDelta.wordPartLeft('1<[<[<[2)})})})3', 15)).toBe(7)
  expect(EditorDelta.wordPartLeft('1<[<[<[2)})})})3', 8)).toBe(1)
  expect(EditorDelta.wordPartLeft('1<[<[<[2)})})})3', 7)).toBe(6)
  expect(EditorDelta.wordPartLeft('1<[<[<[2)})})})3', 1)).toBe(1)
})

test('wordPartRight - jump over whitespace', () => {
  expect(EditorDelta.wordPartRight(' A1323', 0)).toBe(6)
})

test('wordPartRight - camelCase', () => {
  expect(EditorDelta.wordPartRight('fooBar', 0)).toBe(3)
  expect(EditorDelta.wordPartRight('fooBar', 3)).toBe(3)
})

test('wordPartRight - snake_case', () => {
  expect(EditorDelta.wordPartRight('foo_bar', 0)).toBe(3)
  expect(EditorDelta.wordPartRight('foo_bar', 3)).toBe(4)
})

test('wordPartRight - multiple capital letters', () => {
  expect(EditorDelta.wordPartRight('X-UA-Compatible', 0)).toBe(1)
  expect(EditorDelta.wordPartRight('X-UA-Compatible', 1)).toBe(1)
  expect(EditorDelta.wordPartRight('X-UA-Compatible', 2)).toBe(2)
  expect(EditorDelta.wordPartRight('X-UA-Compatible', 4)).toBe(1)
  expect(EditorDelta.wordPartRight('X-UA-Compatible', 5)).toBe(10)
})

test('wordPartRight - multiple underscores', () => {
  expect(EditorDelta.wordPartRight('A__B', 0)).toBe(1)
  expect(EditorDelta.wordPartRight('A__B', 1)).toBe(2)
  expect(EditorDelta.wordPartRight('A__B', 3)).toBe(1)
})

test('wordPartRight - uppercase word', () => {
  expect(EditorDelta.wordPartRight('REMOTE_PREFIX', 0)).toBe(6)
  expect(EditorDelta.wordPartRight('REMOTE_PREFIX', 6)).toBe(1)
  expect(EditorDelta.wordPartRight('REMOTE_PREFIX', 7)).toBe(6)
})

test('wordPartRight - mixed word', () => {
  expect(EditorDelta.wordPartRight('DEBUGEntry', 0)).toBe(5)
  expect(EditorDelta.wordPartRight('DEBUGEntry', 5)).toBe(5)
})

test('wordPartRight - short mixed word', () => {
  expect(EditorDelta.wordPartRight('DDa', 0)).toBe(3)
})

test('wordPartRight - with quotes', () => {
  expect(EditorDelta.wordPartRight('"command": "actions.find"', 0)).toBe(1)
  expect(EditorDelta.wordPartRight('"command": "actions.find"', 1)).toBe(7)
  expect(EditorDelta.wordPartRight('"command": "actions.find"', 8)).toBe(2)
  expect(EditorDelta.wordPartRight('"command": "actions.find"', 10)).toBe(2)
  expect(EditorDelta.wordPartRight('"command": "actions.find"', 12)).toBe(7)
  expect(EditorDelta.wordPartRight('"command": "actions.find"', 19)).toBe(1)
  expect(EditorDelta.wordPartRight('"command": "actions.find"', 20)).toBe(4)
  expect(EditorDelta.wordPartRight('"command": "actions.find"', 24)).toBe(1)
})

test('wordPartRight - punctuation and numbers', () => {
  expect(EditorDelta.wordPartRight('1<[<[<[2)})})})3', 0)).toBe(1)
  expect(EditorDelta.wordPartRight('1<[<[<[2)})})})3', 1)).toBe(6)
  expect(EditorDelta.wordPartRight('1<[<[<[2)})})})3', 7)).toBe(1)
  expect(EditorDelta.wordPartRight('1<[<[<[2)})})})3', 8)).toBe(7)
  expect(EditorDelta.wordPartRight('1<[<[<[2)})})})3', 15)).toBe(1)
})

// TODO test AAAab__B
