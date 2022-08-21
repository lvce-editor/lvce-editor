import * as I18NString from '../src/parts/I18NString/I18NString.js'

test('i18nString - only key', () => {
  expect(I18NString.i18nString('key')).toBe('key')
})

test('i18nString - one placeholder', () => {
  expect(I18NString.i18nString('{PH1} result', { PH1: 1 })).toBe('1 result')
})

test('i18nString - multiple placeholders', () => {
  expect(
    I18NString.i18nString('{PH1} results in {PH2} files', { PH1: 3, PH2: 2 })
  ).toBe('3 results in 2 files')
})
