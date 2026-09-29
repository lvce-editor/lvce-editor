import { expect, test } from '@jest/globals'

const HasCodeQueryParam = await import('../src/parts/HasCodeQueryParam/HasCodeQueryParam.js')

test('hasCodeQueryParam returns true when code query param is present', () => {
  const result = HasCodeQueryParam.hasCodeQueryParam('https://app.example/callback?code=code-1&state=state-1')

  expect(result).toBe(true)
})

test('hasCodeQueryParam returns false when code query param is absent', () => {
  const result = HasCodeQueryParam.hasCodeQueryParam('https://app.example/workspace?folder=/tmp/project')

  expect(result).toBe(false)
})

test('hasCodeQueryParam returns false for invalid urls', () => {
  const result = HasCodeQueryParam.hasCodeQueryParam('invalid-url')

  expect(result).toBe(false)
})
