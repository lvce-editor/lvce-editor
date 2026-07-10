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
