import { expect, test } from '@jest/globals'
import { shouldBeCopied } from '../src/parts/BuildStaticServer/BuildStaticServer.ts'

test('includes media preview in server builds', () => {
  expect(shouldBeCopied('builtin.media-preview')).toBe(true)
})

test('excludes unrelated extensions from server builds', () => {
  expect(shouldBeCopied('builtin.video-preview')).toBe(false)
})
