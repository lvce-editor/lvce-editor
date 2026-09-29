import { expect, test } from '@jest/globals'
import * as ExtensionInstallType from '../src/parts/ExtensionInstallType/ExtensionInstallType.js'
import * as ParseUrlGithub from '../src/parts/ParseUrlGithub/ParseUrlGithub.js'

test('parseUrlGithub - release', async () => {
  const url = `https://github.com/lvce-editor/prettier/releases/download/v0.10.0/prettier-v0.10.0.tar.br`
  expect(ParseUrlGithub.parseUrlGithub(url)).toEqual({
    options: {
      url: `https://github.com/lvce-editor/prettier/releases/download/v0.10.0/prettier-v0.10.0.tar.br`,
    },
    type: ExtensionInstallType.Url,
  })
})
