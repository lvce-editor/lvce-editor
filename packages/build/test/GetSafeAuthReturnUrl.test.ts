import { expect, test } from '@jest/globals'
import { getSafeReturnUrl } from '../../../static/auth/callback.js'

test('getSafeReturnUrl restores the initiating nested page and preserves its query and hash', () => {
  const result = getSafeReturnUrl(
    'https://lvce-editor.github.io/explorer-view/nested/page?tab=files#selection',
    'https://lvce-editor.github.io/lvce-editor/auth/callback?code=code-1&state=state-1',
  )

  expect(result).toBe('https://lvce-editor.github.io/explorer-view/nested/page?tab=files#selection')
})

test('getSafeReturnUrl falls back to the deployment root for absent or external destinations', () => {
  const callbackHref = 'https://lvce-editor.github.io/lvce-editor/auth/callback?code=code-1'

  expect(getSafeReturnUrl('', callbackHref)).toBe('https://lvce-editor.github.io/lvce-editor/')
  expect(getSafeReturnUrl('https://attacker.example/path', callbackHref)).toBe('https://lvce-editor.github.io/lvce-editor/')
})

test('getSafeReturnUrl removes transient authentication parameters', () => {
  const result = getSafeReturnUrl(
    'https://lvce-editor.github.io/about-view?tab=extensions&code=old&state=old#error',
    'https://lvce-editor.github.io/lvce-editor/auth/callback',
  )

  expect(result).toBe('https://lvce-editor.github.io/about-view?tab=extensions#error')
})
