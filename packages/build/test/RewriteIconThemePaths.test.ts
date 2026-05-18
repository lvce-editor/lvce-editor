import { expect, test } from '@jest/globals'
import { rewriteIconThemePaths } from '../src/parts/RewriteIconThemePaths/RewriteIconThemePaths.js'

test('rewrites absolute icon theme paths to hashed production icon paths', () => {
  const content = `{
  "iconDefinitions": {
    "_file": {
      "iconPath": "/icons/default_file.svg"
    },
    "_folder": {
      "iconPath": "/icons/default_folder.svg"
    }
  }
}`

  const result = rewriteIconThemePaths(content, '/f22b0c1/icons')

  expect(result).toContain('"iconPath": "/f22b0c1/icons/default_file.svg"')
  expect(result).toContain('"iconPath": "/f22b0c1/icons/default_folder.svg"')
})

test('does not rewrite non-icon absolute paths', () => {
  const content = '{"path":"/css/App.css"}'

  const result = rewriteIconThemePaths(content, '/f22b0c1/icons')

  expect(result).toBe(content)
})
