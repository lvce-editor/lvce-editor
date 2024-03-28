import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'
import * as GetTextSearchRipGrepArgs from '../src/parts/GetTextSearchRipGrepArgs/GetTextSearchRipGrepArgs.js'

test('getRipGrepArgs - threads', () => {
  expect(
    GetTextSearchRipGrepArgs.getRipGrepArgs({
      threads: 1,
      isCaseSensitive: false,
      searchString: 'test',
      useRegularExpression: false,
    }),
  ).toEqual([
    '--hidden',
    '--no-require-git',
    '--smart-case',
    '--stats',
    '--json',
    '--threads',
    '1',
    '--ignore-case',
    '--fixed-strings',
    '--',
    'test',
    '.',
  ])
})

test('getRipGrepArgs - isCaseSensitive', () => {
  expect(
    GetTextSearchRipGrepArgs.getRipGrepArgs({
      threads: 1,
      isCaseSensitive: true,
      searchString: 'test',
      useRegularExpression: false,
    }),
  ).toEqual([
    '--hidden',
    '--no-require-git',
    '--smart-case',
    '--stats',
    '--json',
    '--threads',
    '1',
    '--case-sensitive',
    '--fixed-strings',
    '--',
    'test',
    '.',
  ])
})

test('getRipGrepArgs - useRegularExpression', () => {
  expect(
    GetTextSearchRipGrepArgs.getRipGrepArgs({
      threads: 1,
      isCaseSensitive: false,
      searchString: 'test',
      useRegularExpression: true,
    }),
  ).toEqual(['--hidden', '--no-require-git', '--smart-case', '--stats', '--json', '--threads', '1', '--ignore-case', '--regexp', 'test', '.'])
})
