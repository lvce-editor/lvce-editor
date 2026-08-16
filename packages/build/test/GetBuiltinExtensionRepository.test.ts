import { expect, test } from '@jest/globals'
import { getBuiltinExtensionRepository } from '../src/parts/GetBuiltinExtensionRepository/GetBuiltinExtensionRepository.ts'

test('returns the repository owner and name', () => {
  expect(
    getBuiltinExtensionRepository({
      name: 'builtin.gpt-voice',
      repository: 'github.com/lvce-editor/gpt-voice-extension',
    }),
  ).toBe('lvce-editor/gpt-voice-extension')
})

test('throws when the repository is not hosted on GitHub', () => {
  expect(() =>
    getBuiltinExtensionRepository({
      name: 'builtin.test',
      repository: 'example.com/lvce-editor/test',
    }),
  ).toThrow('expected extension repository to start with github.com/')
})
