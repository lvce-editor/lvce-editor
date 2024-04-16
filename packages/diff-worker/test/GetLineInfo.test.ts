import { expect, test } from '@jest/globals'
import * as GetLineInfo from '../src/parts/GetLineInfo/GetLineInfo.ts'

test('one token', () => {
  const line = 'abc'
  const tokens = [1, 3]
  const TokenMap = {
    1: 'Abc',
  }
  expect(GetLineInfo.getLineInfo(line, tokens, TokenMap)).toEqual(['abc', 'Token Abc'])
})
