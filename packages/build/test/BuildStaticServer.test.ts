import { expect, test } from '@jest/globals'
import { shouldBeCopied } from '../src/parts/BuildStaticServer/BuildStaticServer.ts'

test('includes preview extensions in server builds', () => {
  expect(shouldBeCopied('builtin.media-preview')).toBe(true)
  expect(shouldBeCopied('builtin.video-preview')).toBe(true)
})

test('includes JSON language features in server builds', () => {
  expect(shouldBeCopied('builtin.language-features-json')).toBe(true)
})

test('includes Codex in server builds', () => {
  expect(shouldBeCopied('builtin.codex')).toBe(true)
})

test('excludes unrelated extensions from server builds', () => {
  expect(shouldBeCopied('builtin.markdown-preview')).toBe(false)
  expect(shouldBeCopied('builtin.language-features-typescript')).toBe(false)
})
