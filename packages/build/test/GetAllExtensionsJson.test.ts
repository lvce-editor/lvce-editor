import { expect, test } from '@jest/globals'
import { getAllExtensionsJson } from '../src/parts/GetAllExtensionsJson/GetAllExtensionsJson.ts'

test('marks bundled extensions as builtin', async () => {
  const extensions = await getAllExtensionsJson({
    commitHash: 'test-commit',
    pathPrefix: '/test-prefix',
  })
  const extension = extensions.find((item) => item.id === 'builtin.theme-ayu')

  expect(extension).toMatchObject({
    builtin: true,
    path: '/test-prefix/test-commit/extensions/builtin.theme-ayu',
  })
})

test('includes the built-in Erlang syntax highlighting extension', async () => {
  const extensions = await getAllExtensionsJson({
    commitHash: 'test-commit',
    pathPrefix: '/test-prefix',
  })
  const extension = extensions.find((item) => item.id === 'builtin.language-basics-erlang')

  expect(extension).toMatchObject({
    builtin: true,
    path: '/test-prefix/test-commit/extensions/builtin.language-basics-erlang',
  })
})

test('includes the built-in Gleam syntax highlighting extension', async () => {
  const extensions = await getAllExtensionsJson({
    commitHash: 'test-commit',
    pathPrefix: '/test-prefix',
  })
  const extension = extensions.find((item) => item.id === 'builtin.language-basics-gleam')

  expect(extension).toMatchObject({
    builtin: true,
    path: '/test-prefix/test-commit/extensions/builtin.language-basics-gleam',
  })
})

test('includes the built-in Roc syntax highlighting extension', async () => {
  const extensions = await getAllExtensionsJson({
    commitHash: 'test-commit',
    pathPrefix: '/test-prefix',
  })
  const extension = extensions.find((item) => item.id === 'builtin.language-basics-roc')

  expect(extension).toMatchObject({
    builtin: true,
    path: '/test-prefix/test-commit/extensions/builtin.language-basics-roc',
  })
})

test('includes the built-in Zig syntax highlighting extension', async () => {
  const extensions = await getAllExtensionsJson({
    commitHash: 'test-commit',
    pathPrefix: '/test-prefix',
  })
  const extension = extensions.find((item) => item.id === 'builtin.language-basics-zig')

  expect(extension).toMatchObject({
    builtin: true,
    path: '/test-prefix/test-commit/extensions/builtin.language-basics-zig',
  })
})

test('includes the built-in GPT Voice extension', async () => {
  const extensions = await getAllExtensionsJson({
    commitHash: 'test-commit',
    pathPrefix: '/test-prefix',
  })
  const extension = extensions.find((item) => item.id === 'builtin.gpt-voice')

  expect(extension).toMatchObject({
    builtin: true,
    disabled: true,
    path: '/test-prefix/test-commit/extensions/builtin.gpt-voice',
  })
})

test('excludes extensions that are not web compatible', async () => {
  const extensions = await getAllExtensionsJson({
    commitHash: 'test-commit',
    pathPrefix: '/test-prefix',
  })

  expect(extensions.some((item) => item.id === 'builtin.git')).toBe(false)
})
